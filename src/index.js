import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import yaml from 'js-yaml';
import ini from 'ini';

const contentFile = pathToFile => fs.readFileSync(path.normalize(pathToFile), 'utf8');

const parser = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.ini': ini.parse,
};

const getContent = (...pathToFiles) => pathToFiles
  .map(pathToFile => parser[path.extname(pathToFile)](contentFile(pathToFile)));

const keyTypes = [
  {
    type: 'nested',
    check: (first, second, key) => (_.isObject(first[key]) && _.isObject(second[key]))
      && !(first[key] instanceof Array && second[key] instanceof Array),
    process: (first, second, func) => func(first, second),
  },
  {
    type: 'not changed',
    check: (first, second, key) => first[key] && second[key]
      && first[key] === second[key],
    process: first => first,
  },
  {
    type: 'changed',
    check: (first, second, key) => first[key] && second[key]
      && first[key] !== second[key],
    process: (first, second) => ({ old: first, new: second }),
  },
  {
    type: 'deleted',
    check: (first, second, key) => first[key] && !second[key],
    process: first => first,
  },
  {
    type: 'inserted',
    check: (first, second, key) => !first[key] && second[key],
    process: (first, second) => second,
  },
];

const makeAst = (firstConfig = {}, secondConfig = {}) => {
  const commonKeys = _.union(Object.keys(firstConfig), Object.keys(secondConfig));
  return commonKeys.map((key) => {
    const { type, process } = keyTypes.find(item => item.check(firstConfig, secondConfig, key));
    const value = process(firstConfig[key], secondConfig[key], makeAst);
    return { name: key, type, value };
  });
};

// Example AST:
// [ { name: 'common',
//     type: 'nested',
//     value:  [ { name: 'setting1', type: 'not changed', value: 'Value 1' },
//   { name: 'setting2', type: 'deleted', value: '200' },
//   { name: 'setting3', type: 'not changed', value: true },
//   { name: 'setting6', type: 'deleted', value: { key: 'value' } },
//   { name: 'setting4', type: 'inserted', value: 'blah blah' },
//   { name: 'setting5', type: 'inserted', value: { key5: 'value5' } } ] },
//   { name: 'group1', type: 'nested', value:
//   [ { name: 'baz', type: 'changed', value: { old: 'bas', new: 'bars' } },
//      { name: 'foo', type: 'not changed', value: 'bar' } ] },
//   { name: 'group2', type: 'deleted', value: { abc: '12345' } },
//   { name: 'group3', type: 'inserted', value: { fee: '100500' } } ]

const simpleTypesRender = [
  {
    type: 'not changed',
    render: (key, value) => `  ${key}: ${value}`,
  },
  {
    type: 'changed',
    render: (key, value, tabsSpace) => `+ ${key}: ${value.new}\n${tabsSpace}- ${key}: ${value.old}`,
  },
  {
    type: 'deleted',
    render: (key, value) => `- ${key}: ${value}`,
  },
  {
    type: 'inserted',
    render: (key, value) => `+ ${key}: ${value}`,
  },
];


const objRender = (node, tabsGroupEl) => Object.keys(node).map(key => `${tabsGroupEl}${key}: ${node[key]}`).join('\n');

const renderNestedDiff = (ast, tabs = 1) => {
  const tabsSpace = ' '.repeat(tabs * 4);
  const tabsDiff = ' '.repeat((tabs * 4) - 2);
  const tabsGroupEl = ' '.repeat((tabs + 1) * 4);

  const diffText = ast.map((node) => {
    if (node.type === 'nested') {
      return `${tabsSpace}${node.name}: {\n${renderNestedDiff(node.value, tabs + 1)}\n${tabsSpace}}`;
    }
    if (node.type === 'deleted') {
      if (_.isObject(node.value)) {
        return `${tabsDiff}- ${node.name}: {\n${objRender(node.value, tabsGroupEl)}\n${tabsSpace}}`;
      }
    }
    if (node.type === 'inserted') {
      if (_.isObject(node.value)) {
        return `${tabsDiff}+ ${node.name}: {\n${objRender(node.value, tabsGroupEl)}\n${tabsSpace}}`;
      }
    }
    const { render } = simpleTypesRender.find(item => item.type === node.type);
    return `${tabsDiff}${render(node.name, node.value, tabsDiff)}`;
  });

  return diffText.join('\n');
};


const getMainStr = (property, propertyType) => `Property '${property}' was ${propertyType}`;
const getFromStr = (from, to) => `. From ${from} to ${to}`;
const getWithStr = valueStr => ` with ${valueStr}`;

const renderPlainDiff = (ast, prop = '') => {
  const diffText = ast.map((node) => {
    const property = `${prop}${node.name}`;

    if (node.type === 'nested') {
      return renderPlainDiff(node.value, `${property}.`);
    }
    if (node.type === 'deleted') {
      return getMainStr(property, 'removed');
    }
    if (node.type === 'inserted') {
      if (_.isObject(node.value)) {
        return `${getMainStr(property, 'added')}${getWithStr('complex value')}`;
      }
      return `${getMainStr(property, 'added')}${getWithStr(`value: ${node.value}`)}`;
    }
    if (node.type === 'changed') {
      return `${getMainStr(property, 'updated')}${getFromStr(node.value.old, node.value.new)}`;
    }
    return '';
  });

  return diffText.filter(el => el !== '').join('\n');
};

const gendiff = (pathToFile1, pathToFile2, format = null) => {
  const diffAst = makeAst(...getContent(pathToFile1, pathToFile2));
  if (format === 'plain') {
    return renderPlainDiff(diffAst);
  }
  return `{\n${renderNestedDiff(diffAst)}\n}`;
};

export default gendiff;

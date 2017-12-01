import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import yaml from 'js-yaml';
import ini from 'ini';

const contentFile = (pathToFile) => fs.readFileSync(path.normalize(pathToFile), 'utf8');

const getContent = (pathToFile1, pathToFile2) => {
  const parser = {
    '.json': (content) => JSON.parse(content),
    '.yml': (content) => yaml.safeLoad(content),
    '.ini': (content) => ini.parse(content),
  };
  const typeFile1 = path.parse(pathToFile1).ext;
  const typeFile2 = path.parse(pathToFile2).ext;
  const contentFile1 = parser[typeFile1](contentFile(pathToFile1));
  const contentFile2 = parser[typeFile2](contentFile(pathToFile2));
  return [contentFile1, contentFile2];
};

const keyTypes = [
  {
    type: 'nested',
    check: (first, second, key) => (first[key] instanceof Object && second[key] instanceof Object)
      && !(first[key] instanceof Array && second[key] instanceof Array),
    process: (first, second, fun) => fun(first, second),
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

const renderDiff = (ast, tabs = 1) => {
  const tabsSpace = ' '.repeat(tabs * 4);
  const tabsDiff = ' '.repeat((tabs * 4) - 2);
  const tabsGroupEl = ' '.repeat((tabs + 1) * 4);

  const diffText = ast.map(node => {
    if (node.type === 'nested') {
      return `${tabsSpace}${node.name}: {\n${renderDiff(node.value, tabs + 1)}\n${tabsSpace}}`;
    }
    if ((node.type === 'deleted' || node.type === 'inserted') && node.value instanceof Object) {
      const objValue = node.value;
      const value = Object.keys(objValue).map(key => `${tabsGroupEl}${key}: ${objValue[key]}`).join('\n');
      if (node.type === 'deleted') {
        return `${tabsDiff}- ${node.name}: {\n${value}\n${tabsSpace}}`;
      }
      return `${tabsDiff}+ ${node.name}: {\n${value}\n${tabsSpace}}`;
    }
    const { render } = simpleTypesRender.find(item => item.type === node.type);
    return `${tabsDiff}${render(node.name, node.value, tabsDiff)}`;
  });

  return diffText.join('\n');
};

const gendiff = (pathToFile1, pathToFile2) => {
  const diffAst = makeAst(...getContent(pathToFile1, pathToFile2));
  return `{\n${renderDiff(diffAst)}\n}`;
};

export default gendiff;

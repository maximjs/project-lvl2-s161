import { union, isObject } from 'lodash';

const keyTypes = [
  {
    type: 'nested',
    check: (first, second, key) => (isObject(first[key]) && isObject(second[key]))
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
  const commonKeys = union(Object.keys(firstConfig), Object.keys(secondConfig));
  return commonKeys.map((key) => {
    const { type, process } = keyTypes.find(item => item.check(firstConfig, secondConfig, key));
    const value = process(firstConfig[key], secondConfig[key], makeAst);
    return (type === 'nested') ? { name: key, type, children: value } : { name: key, type, value };
  });
};

// Example AST:
// [ { name: 'common',
//     type: 'nested',
//     children:
//     [ { name: 'setting1', type: 'changed', value: { old: 'Value 1', new: 'Value 2' } },
//   { name: 'setting2', type: 'deleted', value: '200' },
//   { name: 'setting3', type: 'not changed', value: true },
//   { name: 'setting6', type: 'deleted', value: { key: 'value' } },
//   { name: 'setting4', type: 'inserted', value: 'blah blah' },
//   { name: 'setting5', type: 'inserted', value: { key5: 'value5' } } ] },
//   { name: 'group1',
//     type: 'nested',
//     children:
//     [ { name: 'baz', type: 'changed', value: { old: 'bas', new: 'bars' } },
//   { name: 'foo', type: 'not changed', value: 'bar' } ] },
//   { name: 'group2', type: 'deleted', value: { abc: '12345' } },
//   { name: 'group3', type: 'inserted', value: { fee: '100500' } } ]

export default makeAst;

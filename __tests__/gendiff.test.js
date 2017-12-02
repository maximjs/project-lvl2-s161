import path from 'path';
import fs from 'fs';
import gendiff from '../src';

const result1 = fs.readFileSync(path.normalize('__tests__/__fixtures__/result_flat_json.txt'), 'utf8');
const result2 = fs.readFileSync(path.normalize('__tests__/__fixtures__/result_flat_yml.txt'), 'utf8');
const result3 = fs.readFileSync(path.normalize('__tests__/__fixtures__/result_flat_ini.txt'), 'utf8');
const result4 = fs.readFileSync(path.normalize('__tests__/__fixtures__/result_nested_json.txt'), 'utf8');
const result5 = fs.readFileSync(path.normalize('__tests__/__fixtures__/result_nested_yml.txt'), 'utf8');
const result6 = fs.readFileSync(path.normalize('__tests__/__fixtures__/result_nested_ini.txt'), 'utf8');

test('Comparison of flat files (json)', () => {
  expect(gendiff('__tests__/__fixtures__/before_flat.json', '__tests__/__fixtures__/after_flat.json'))
    .toBe(result1);
});

test('Comparison of flat files (yaml)', () => {
  expect(gendiff('__tests__/__fixtures__/before_flat.yml', '__tests__/__fixtures__/after_flat.yml'))
    .toBe(result2);
});

test('Comparison of flat files (ini)', () => {
  expect(gendiff('__tests__/__fixtures__/before_flat.ini', '__tests__/__fixtures__/after_flat.ini'))
    .toBe(result3);
});

test('Comparison of nested files (json)', () => {
  expect(gendiff('__tests__/__fixtures__/before_nested.json', '__tests__/__fixtures__/after_nested.json'))
    .toBe(result4);
});

test('Comparison of nested files (yaml)', () => {
  expect(gendiff('__tests__/__fixtures__/before_nested.yml', '__tests__/__fixtures__/after_nested.yml'))
    .toBe(result5);
});

test('Comparison of nested files (ini)', () => {
  expect(gendiff('__tests__/__fixtures__/before_nested.ini', '__tests__/__fixtures__/after_nested.ini'))
    .toBe(result6);
});

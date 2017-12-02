import path from 'path';
import fs from 'fs';
import gendiff from '../src';

test('Comparison of flat files (json)', () => {
  expect(gendiff('__tests__/__fixtures__/before_flat.json', '__tests__/__fixtures__/after_flat.json'))
    .toBe(fs.readFileSync(path.normalize('__tests__/__fixtures__/result_flat_json.txt'), 'utf8'));
});

test('Comparison of flat files (yaml)', () => {
  expect(gendiff('__tests__/__fixtures__/before_flat.yml', '__tests__/__fixtures__/after_flat.yml'))
    .toBe(fs.readFileSync(path.normalize('__tests__/__fixtures__/result_flat_yml.txt'), 'utf8'));
});

test('Comparison of flat files (ini)', () => {
  expect(gendiff('__tests__/__fixtures__/before_flat.ini', '__tests__/__fixtures__/after_flat.ini'))
    .toBe(fs.readFileSync(path.normalize('__tests__/__fixtures__/result_flat_ini.txt'), 'utf8'));
});

test('Comparison of nested files (json)', () => {
  expect(gendiff('__tests__/__fixtures__/before_nested.json', '__tests__/__fixtures__/after_nested.json'))
    .toBe(fs.readFileSync(path.normalize('__tests__/__fixtures__/result_nested_json.txt'), 'utf8'));
});

test('Comparison of nested files (yaml)', () => {
  expect(gendiff('__tests__/__fixtures__/before_nested.yml', '__tests__/__fixtures__/after_nested.yml'))
    .toBe(fs.readFileSync(path.normalize('__tests__/__fixtures__/result_nested_yml.txt'), 'utf8'));
});

test('Comparison of nested files (ini)', () => {
  expect(gendiff('__tests__/__fixtures__/before_nested.ini', '__tests__/__fixtures__/after_nested.ini'))
    .toBe(fs.readFileSync(path.normalize('__tests__/__fixtures__/result_nested_ini.txt'), 'utf8'));
});

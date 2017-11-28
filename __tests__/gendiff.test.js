import path from 'path';
import fs from 'fs';
import gendiff from '../src';

let result1;
let result2;
let result3;
beforeAll(() => {
  result1 = fs.readFileSync(path.normalize('__tests__/__fixtures__/result_json.txt'), 'utf8');
  result2 = fs.readFileSync(path.normalize('__tests__/__fixtures__/result_yml.txt'), 'utf8');
  result3 = fs.readFileSync(path.normalize('__tests__/__fixtures__/result_ini.txt'), 'utf8');
});

test('Comparison of flat files (json)', () => {
  expect(gendiff('__tests__/__fixtures__/before.json', '__tests__/__fixtures__/after.json')).toBe(result1);
});

test('Comparison of flat files (yaml)', () => {
  expect(gendiff('__tests__/__fixtures__/before.yml', '__tests__/__fixtures__/after.yml')).toBe(result2);
});

test('Comparison of flat files (ini)', () => {
  expect(gendiff('__tests__/__fixtures__/before.ini', '__tests__/__fixtures__/after.ini')).toBe(result3);
});

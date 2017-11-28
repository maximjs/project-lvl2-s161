import path from 'path';
import fs from 'fs';
import gendiff from '../src';

let result1;
let result2;
beforeAll(() => {
  result1 = fs.readFileSync(path.normalize('__tests__/__fixtures__/result_json.txt'), 'utf8');
  result2 = fs.readFileSync(path.normalize('__tests__/__fixtures__/result_yml.txt'), 'utf8');
});

test('Comparison of flat files (json)', () => {
  expect(gendiff('__tests__/__fixtures__/before.json', '__tests__/__fixtures__/after.json')).toBe(result1);
});

test('Comparison of flat files (yaml)', () => {
  expect(gendiff('__tests__/__fixtures__/before.yml', '__tests__/__fixtures__/after.yml')).toBe(result2);
});

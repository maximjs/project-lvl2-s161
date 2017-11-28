import path from 'path';
import fs from 'fs';
import gendiff from '../src';

let result1;
beforeAll(() => {
  result1 = fs.readFileSync(path.normalize('__tests__/__fixtures__/result1.txt'), 'utf8');
});

test('Comparison of flat files (JSON)', () => {
  expect(gendiff('__tests__/__fixtures__/before.json', '__tests__/__fixtures__/after.json')).toBe(result1);
});

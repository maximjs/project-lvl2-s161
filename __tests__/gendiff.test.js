import path from 'path';
import fs from 'fs';

import gendiff from '../src';
import renders from '../src/renders';

const fixturesPath = '__tests__/__fixtures__/';

test('Comparison of flat files (json)', () => {
  const result1 = fs.readFileSync(path.normalize(`${fixturesPath}result_flat_json.txt`), 'utf8');
  expect(gendiff(`${fixturesPath}before_flat.json`, `${fixturesPath}after_flat.json`)).toBe(result1);
});

test('Comparison of flat files (yaml)', () => {
  const result2 = fs.readFileSync(path.normalize(`${fixturesPath}result_flat_yml.txt`), 'utf8');
  expect(gendiff(`${fixturesPath}before_flat.yml`, `${fixturesPath}after_flat.yml`)).toBe(result2);
});

test('Comparison of flat files (ini)', () => {
  const result3 = fs.readFileSync(path.normalize(`${fixturesPath}result_flat_ini.txt`), 'utf8');
  expect(gendiff(`${fixturesPath}before_flat.ini`, `${fixturesPath}after_flat.ini`)).toBe(result3);
});

test('Comparison of nested files (json)', () => {
  const result4 = fs.readFileSync(path.normalize(`${fixturesPath}result_nested_json.txt`), 'utf8');
  expect(gendiff(`${fixturesPath}before_nested.json`, `${fixturesPath}after_nested.json`)).toBe(result4);
});

test('Comparison of nested files (yaml)', () => {
  const result5 = fs.readFileSync(path.normalize(`${fixturesPath}result_nested_yml.txt`), 'utf8');
  expect(gendiff(`${fixturesPath}before_nested.yml`, `${fixturesPath}after_nested.yml`)).toBe(result5);
});

test('Comparison of nested files (ini)', () => {
  const result6 = fs.readFileSync(path.normalize(`${fixturesPath}result_nested_ini.txt`), 'utf8');
  expect(gendiff(`${fixturesPath}before_nested.ini`, `${fixturesPath}after_nested.ini`)).toBe(result6);
});

test('Comparison of nested files with command -f plain (json)', () => {
  const result7 = fs.readFileSync(path.normalize(`${fixturesPath}result_format_plain_json.txt`), 'utf8');
  expect(gendiff(`${fixturesPath}before_nested.json`, `${fixturesPath}after_nested.json`, renders.plain)).toBe(result7);
});

test('Comparison of nested files with command -f json (json)', () => {
  const result8 = fs.readFileSync(path.normalize(`${fixturesPath}result_format_json_json.txt`), 'utf8');
  expect(gendiff(`${fixturesPath}before_nested.json`, `${fixturesPath}after_nested.json`, renders.json)).toBe(result8);
});

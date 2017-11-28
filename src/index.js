import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import yaml from 'js-yaml';
import ini from 'ini';

const getContent = (pathToFile1, pathToFile2) => {
  const parser = {
    '.json': (path1) => JSON.parse(fs.readFileSync(path.normalize(path1), 'utf8')),
    '.yml': (path2) => yaml.safeLoad(fs.readFileSync(path.normalize(path2), 'utf8')),
    '.ini': (path2) => ini.parse(fs.readFileSync(path.normalize(path2), 'utf8')),
  };
  const typeFile1 = path.parse(pathToFile1).ext;
  const typeFile2 = path.parse(pathToFile2).ext;

  const contentFile1 = parser[typeFile1](pathToFile1);
  const contentFile2 = parser[typeFile2](pathToFile2);
  return [contentFile1, contentFile2];
};

const gendiff = (pathToFile1, pathToFile2) => {
  const [contentFile1, contentFile2] = getContent(pathToFile1, pathToFile2);
  const commonKeys = _.union(Object.keys(contentFile1), Object.keys(contentFile2));

  const diffCommonKeys = commonKeys.reduce((acc, el) => {
    if (contentFile1[el] && contentFile2[el] && contentFile1[el] !== contentFile2[el]) {
      acc += ` + ${el}: ${contentFile2[el]}\n - ${el}: ${contentFile1[el]}\n`;
      return acc;
    } else if (contentFile1[el] && contentFile2[el] && contentFile1[el] === contentFile2[el]) {
      acc += `   ${el}: ${contentFile1[el]}\n`;
      return acc;
    } else if (contentFile1[el] && !contentFile2[el]) {
      acc += ` - ${el}: ${contentFile1[el]}\n`;
      return acc;
    }
    acc += ` + ${el}: ${contentFile2[el]}\n`;
    return acc;
  }, '');
  const diff = `{\n${diffCommonKeys}}`;
  return diff;
};

export default gendiff;

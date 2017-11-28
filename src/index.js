import path from 'path';
import fs from 'fs';
import _ from 'lodash';
import yaml from 'js-yaml';

const gendiff = (pathToFile1, pathToFile2) => {
  const getContent = (path1, path2) => {
    const typeFile1 = path.parse(path1).ext;
    const typeFile2 = path.parse(path2).ext;

    if (typeFile1 === '.json' && typeFile2 === '.json') {
      const contentFile1 = JSON.parse(fs.readFileSync(path.normalize(path1), 'utf8'));
      const contentFile2 = JSON.parse(fs.readFileSync(path.normalize(path2), 'utf8'));
      return [contentFile1, contentFile2];
    }
    if (typeFile1 === '.yml' && typeFile2 === '.yml') {
      const contentFile1 = yaml.safeLoad(fs.readFileSync(path.normalize(path1), 'utf8'));
      const contentFile2 = yaml.safeLoad(fs.readFileSync(path.normalize(path2), 'utf8'));
      return [contentFile1, contentFile2];
    }
  };

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

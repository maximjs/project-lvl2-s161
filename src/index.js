import path from 'path';
import fs from 'fs';
import _ from 'lodash';

const gendiff = (pathToFile1, pathToFile2) => {
  const contentFile1 = JSON.parse(fs.readFileSync(path.normalize(pathToFile1), 'utf8'));
  const contentFile2 = JSON.parse(fs.readFileSync(path.normalize(pathToFile2), 'utf8'));
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

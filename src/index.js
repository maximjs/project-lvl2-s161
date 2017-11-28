import commander from 'commander';
import path from 'path';
import fs from 'fs';

const gendiff = (pathToFile1, pathToFile2) => {
  const contentFile1 = JSON.parse(fs.readFileSync(path.normalize(pathToFile1), 'utf8'));
  const contentFile2 = JSON.parse(fs.readFileSync(path.normalize(pathToFile2), 'utf8'));

  const diffCommonKeys = Object.keys(contentFile1).reduce((acc, el) => {
    if (Object.keys(contentFile2).includes(el) && contentFile1[el] !== contentFile2[el]) {
      acc += ` + ${el}: ${contentFile2[el]}\n - ${el}: ${contentFile1[el]}\n`;
      return acc;
    } else if (Object.keys(contentFile2).includes(el) && contentFile1[el] === contentFile2[el]) {
      acc += `   ${el}: ${contentFile1[el]}\n`;
      return acc;
    }
    acc += ` - ${el}: ${contentFile1[el]}\n`;
    return acc;
  }, '');

  const diffNewKeys = Object.keys(contentFile2).reduce((acc, el) => {
    if (!Object.keys(contentFile1).includes(el)) {
      acc += ` + ${el}: ${contentFile2[el]}\n`;
      return acc;
    }
    return acc;
  }, '');

  const commonDiff = diffCommonKeys + diffNewKeys;
  const diff = `{\n${commonDiff}}`;
  return diff;
};

export const runGenDiff = (params) => {
  const program = commander;
  program
    .version('0.0.1')
    .usage('[options] <firstConfig> <secondConfig>')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'Output format');
  program.parse(params);
  const diff = gendiff(program.args[0], program.args[1]);
  console.log(diff);
};

export default gendiff;

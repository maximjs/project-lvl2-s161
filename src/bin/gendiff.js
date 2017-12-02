#!/usr/bin/env node
import commander from 'commander';
import gendiff from '..';

const runGenDiff = (params) => {
  const program = commander;
  program
    .version('0.1.1')
    .usage('[options] <firstConfig> <secondConfig>')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'Output format')
    .action((file1, file2) => {
      if (program.format) {
        console.log(gendiff(file1, file2, program.format));
      } else {
        console.log(gendiff(file1, file2));
      }
    });
  program.parse(params);
};

runGenDiff(process.argv);

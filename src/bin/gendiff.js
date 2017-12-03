#!/usr/bin/env node
import program from 'commander';
import gendiff from '..';
import renders from '../renders';

const runGenDiff = (params) => {
  program
    .version('0.1.2')
    .usage('[options] <firstConfig> <secondConfig>')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'Output format (default is nested)')
    .action((file1, file2) => {
      const render = renders[program.format || 'default'];
      if (!render) {
        console.error(`Unsupported format, try these: ${Object.keys(renders).join(', ')}`);
        process.exit(1);
      }
      console.log(gendiff(file1, file2, render));
    });
  program.parse(params);
};

runGenDiff(process.argv);

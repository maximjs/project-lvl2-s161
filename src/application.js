import commander from 'commander';

const program = commander;

program
  .version('0.0.1')
  .usage('[options] <firstConfig> <secondConfig>')
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'Output format');

export default program;

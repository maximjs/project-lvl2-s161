import { isObject } from 'lodash';

const simpleTypesRender = [
  {
    type: 'not changed',
    render: (key, value) => `  ${key}: ${value}`,
  },
  {
    type: 'changed',
    render: (key, value, tabsSpace) => `+ ${key}: ${value.new}\n${tabsSpace}- ${key}: ${value.old}`,
  },
  {
    type: 'deleted',
    render: (key, value) => `- ${key}: ${value}`,
  },
  {
    type: 'inserted',
    render: (key, value) => `+ ${key}: ${value}`,
  },
];

const objRender = (node, tabsGroupEl) => Object.keys(node).map(key => `${tabsGroupEl}${key}: ${node[key]}`).join('\n');
const nodeObjRender = (tabsDiff, node, tabsGroupEl, tabsSpace) => {
  const sign = (node.type === 'deleted') ? '-' : '+';
  return `${tabsDiff}${sign} ${node.name}: {\n${objRender(node.value, tabsGroupEl)}\n${tabsSpace}}`;
};

const renderNested = (ast, tabs = 1) => {
  const tabsSpace = ' '.repeat(tabs * 4);
  const tabsDiff = ' '.repeat((tabs * 4) - 2);
  const tabsGroupEl = ' '.repeat((tabs + 1) * 4);
  const diffText = ast.map((node) => {
    if (node.type === 'nested') {
      return `${tabsSpace}${node.name}: {\n${renderNested(node.children, tabs + 1)}\n${tabsSpace}}`;
    }
    if (node.type === 'deleted' || node.type === 'inserted') {
      if (isObject(node.value)) {
        return nodeObjRender(tabsDiff, node, tabsGroupEl, tabsSpace);
      }
    }
    const { render } = simpleTypesRender.find(item => item.type === node.type);
    return `${tabsDiff}${render(node.name, node.value, tabsDiff)}`;
  });
  return diffText.join('\n');
};
const renderNestedDiff = ast => `{\n${renderNested(ast)}\n}`;

export default renderNestedDiff;

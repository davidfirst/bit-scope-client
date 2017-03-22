/* @flow */
import SSH from './ssh';

const defaultUrl = 'ssh://bit@hub-stg.bitsrc.io:';
const getRemote = (scope) => defaultUrl + scope; // TODO - write strategy for multiple remotes

const importFromScope = ({ scope, ids }: { scope: string, ids: string[] }):
Promise<{ component: any, dependencies: any }> => {
  return SSH.fromUrl(getRemote(scope)).connect()
  .then(client => client.fetch(ids));
};

const importComponents = (componentIds: string[]) => {
  const groupedByScope = [{
    scope: 'bit.utils',
    ids: componentIds
  }]; // TODO - a function that group ids by origin scopes

  return Promise.all(groupedByScope.map(importFromScope));
};

module.exports = importComponents;

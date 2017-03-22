/* @flow */
import SSH from './ssh';
import getRemote from './remote-getter';
import bit from 'bit-js';
import { ID_DELIMITER } from './constants';

const groupBy = bit('object/group-by');
const mapObject = bit('object/map');
const values = bit('object/values');
const flatMap = bit('array/flat-map');

function importFromScope (ids: string[], scope: string):
Promise<{ component: any, dependencies: any }> {
  const remote = getRemote(scope);
  return SSH.fromUrl(remote).connect()
  .then(client => client.fetch(ids));
};

const importComponents = (componentIds: string[]) => {
  const groupedByScope = groupBy(componentIds, (id) => {
    return id.split(ID_DELIMITER)[0];
  });

  return Promise.all(values(mapObject(groupedByScope, importFromScope)))
  .then((resultsByScope) => flatMap(resultsByScope, val => val));
};

module.exports = importComponents;

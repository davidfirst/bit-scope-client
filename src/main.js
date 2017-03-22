/* @flow */
import sshClient from './ssh-client';
import getRemote from './remote-getter/';
import bit from 'bit-js';
import { ID_DELIMITER } from './constants';

const groupBy = bit('object/group-by');
const mapObject = bit('object/map');
const values = bit('object/values');
const flatMap = bit('array/flat-map');
const isString = bit('is-string');

function importFromScope (ids: string[], scope: string):
Promise<{ component: any, dependencies: any }> {
  const remote = getRemote(scope);

  return sshClient.fromUrl(remote).connect()
  .then(client => client.fetch(ids));
};

function isValidId(id: string): bool {
  if (!isString(id)) return false;

  // TODO - validate a component id

  return true;
}

const isInvalidId = id => !isValidId(id);

const importComponents = (componentIds: string[]) => {
  const invalidIds = componentIds.filter(isInvalidId);
  if (invalidIds.length > 0) {
    throw Error(`the ids ${invalidIds.join(', ')} are invalid component ids`);
  };

  const groupedByScope = groupBy(componentIds, (id) => {
    return id.split(ID_DELIMITER)[0];
  });

  return Promise.all(values(mapObject(groupedByScope, importFromScope)))
  .then((resultsByScope) => flatMap(resultsByScope, val => val));
};

module.exports = importComponents;

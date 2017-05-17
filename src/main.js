/* @flow */
import R from 'ramda';
import path from 'path';
import sshClient from './ssh-client';
import getRemote from './remote-getter/';
import bit from 'bit-js';
import { ID_DELIMITER, COMPONENTS_DIRNAME } from './constants';
import modelOnFs from './importer/model-on-fs';
import projectBitJson from './importer/project-bit-json';
import Component from './component';
import { type Response } from './ssh-client';

const groupBy = bit('object/group-by');
const mapObject = bit('object/map');
const values = bit('object/values');
const flatMap = bit('array/flat-map');
const isString = bit('is-string');

function importFromScope (ids: string[], scope: string): Promise<Response> {
  const remote = getRemote(scope);

  return sshClient.fromUrl(remote).connect()
  .then(client => client.fetch(ids));
}

function isValidId(id: string): bool {
  if (!isString(id)) return false;

  // TODO - validate a component id

  return true;
}

const isInvalidId = id => !isValidId(id);

function fetchComponents(componentIds: string[]): Promise<Response[]> {
  const invalidIds = componentIds.filter(isInvalidId);
  if (invalidIds.length > 0) {
    throw Error(`the ids ${invalidIds.join(', ')} are invalid component ids`);
  }

  const groupedByScope = groupBy(componentIds, (id) => {
    return id.split(ID_DELIMITER)[0];
  });

  return Promise.all(values(mapObject(groupedByScope, importFromScope)))
    .then((resultsByScope) => flatMap(resultsByScope, val => val));
}

function writeComponents(responses: Response[], customDir: ?string):
Promise<{ component: Component, dependencies: Component[] }> {
  const componentDependencies = R.unnest(responses.map(R.prop('payload')));
  const projectRoot = process.cwd();
  const targetComponentsDir = customDir ? customDir : path.join(projectRoot, COMPONENTS_DIRNAME);
  return modelOnFs(componentDependencies, targetComponentsDir).then(() => componentDependencies);
}

const importComponents = (componentIds: string[], saveToBitJson: boolean = false):
Promise<{ component: Component, dependencies: Component[] }> => {
  const componentsP = fetchComponents(componentIds)
  .then(components => writeComponents(components));

  if (saveToBitJson) {
    return componentsP.then(components => projectBitJson.saveDependenciesIfNeeded(componentIds,
      components).then(() => components));
  }
  return componentsP;
};

module.exports = {
  fetchComponents,
  writeComponents,
  importComponents,
};

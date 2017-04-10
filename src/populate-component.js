/** @flow */
import Component from './models/component';
import Version from './models/version';
import Source from './models/source';
import bit from 'bit-js';

const values = bit('object/values');
const merge = bit('object/merge');
const compose = bit('function/compose');
const evolve = bit('object/evolve');

export default (
    { component, dependencies, objects }:
    { component: Component, dependencies: Component[] ,objects: { [any]: Component|Version|Source } }
  ) => {
  const populated = {
    component: populateComponent(component, objects),
    dependencies: dependencies.map(c => populateComponent(c, objects))
  };

  return populated;
}

function populateComponent(c, objects) {
  let versionObject;
  let versionNumber;

  for (let currentVersion in c.versions) {
    let hash = c.versions[parseInt(currentVersion)];

    if (objects[hash]) {
      versionObject = objects[hash];
      versionNumber = currentVersion;
    }
    break;
  }

  delete c.versions;
  const componentVersion = merge(c, versionObject, { version: versionNumber });

  function populateSource(source) {
    return evolve({ file: (hash) => objects[hash]}, source)
  }

  function populateImpl(c) {
    return evolve({ impl: populateSource }, c);
  }

  function populateSpec(c) {
    return evolve({ specs: populateSource }, c);
  }

  function populateDist(c) {
    return evolve({ dist: populateSource }, c);
  }

  return compose(
    populateImpl,
    populateSpec,
    populateDist
  )(componentVersion);
}

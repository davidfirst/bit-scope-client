/** @flow */
import { NULL_BYTE, SPACE_DELIMITER } from './constants';
import { inflateSync } from 'zlib';
import bit from 'bit-js';
import Component from './models/component';
import Version from './models/version';
import Source from './models/source';

const mergeAll = bit('object/merge-all');
const groupBy = bit('object/group-by');
const values = bit('object/values');
const value = obj => values(obj)[0];

export default function parseComponentObjects(str: string): {
  component: Component, dependencies: Component[], objects: Version| Source } {
  const { component, objects } = JSON.parse(str);
  const parsedObjectsArr = objects.map(obj => parseBitObject(obj, true));

  const grouped = groupBy(parsedObjectsArr, (obj) => {
    if (value(obj) instanceof Component) { return 'COMPONENTS'; }
    return 'PARTS';
  })

  const componentDependenciesObjects = {
    component: parseBitObject(component),
    dependencies: grouped.COMPONENTS ? values(mergeAll(grouped.COMPONENTS)) : [],
    objects: mergeAll(grouped.PARTS)
  };

  // $FlowFixMe
  return componentDependenciesObjects;
}

function parseByType(type, rawContents) {
  switch(type.toUpperCase()) {
    case 'SOURCE': return Source.parse(rawContents).toString();
    case 'COMPONENT': return Component.parse(rawContents);
    case 'VERSION': return Version.parse(rawContents);
    default: return rawContents;
  }
}

function parseBitObject(fileContents, withIndex): Component| Version | Source |
{ [any]: Component| Version | Source } {
  const buffer = inflateSync(new Buffer(fileContents));
  const [headers, contents] = buffer.toString().split(NULL_BYTE);
  const [type, hash,] = headers.split(SPACE_DELIMITER);
  const parsedObject = parseByType(type, contents);

  return withIndex ?  { [hash]: parsedObject } : parsedObject;
}

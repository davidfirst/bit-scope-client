import R from 'ramda';
import { componentDependencies } from './model-on-fs';
import BitJson from './bit-json';
import { ID_DELIMITER } from './constants';
import { parseBitFullId } from './bit-id';

const projectRoot = process.cwd();
const load = () => BitJson.load(projectRoot);

function saveDependenciesIfNeeded(componentIds: string[],
  components: componentDependencies[]): Promise<*> {
  return new Promise((resolve, reject) => {
    const projectBitJson = load();
    if (!componentIds || R.isEmpty(componentIds)) return resolve();
    let bitJsonHasChanged = false;
    componentIds.forEach((componentId) => {
      const objId = parseBitFullId({ id: componentId });
      const strId = objId.scope + ID_DELIMITER + objId.box + ID_DELIMITER + objId.name;
      if (projectBitJson.dependencies && !projectBitJson.dependencies[strId]) {
        const component = components.find(item => item.component.scope === objId.scope
        && item.component.box === objId.box && item.component.name === objId.name);
        projectBitJson.dependencies[strId] = component && component.component.version;
        bitJsonHasChanged = true;
      }
    });
    if (!bitJsonHasChanged) return resolve();
    try {
      projectBitJson.validateDependencies();
    } catch (e) {
      return reject(e);
    }

    return projectBitJson.write(projectRoot).then(resolve).catch(reject);
  });
}

module.exports = { saveDependenciesIfNeeded };

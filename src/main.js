/* @flow */
import SSH from './ssh';

const importComponents = (componentIds: String[]) => {
  const componentId = componentIds[0];
  const ssh = SSH.fromUrl();
  ssh.fetch(componentId)
}

export default importComponents;

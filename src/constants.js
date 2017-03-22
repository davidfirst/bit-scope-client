import userHome from 'user-home';
import path from 'path';

function getDirectory(): string {
  if (process.platform === 'win32' && process.env.LOCALAPPDATA) {
    return path.join(process.env.LOCALAPPDATA, 'Bit');
  }

  return path.join(userHome, '.bit');
}

function getCacheDirectory(): string {
  if (process.platform === 'darwin') {
    return path.join(userHome, 'Library', 'Caches', 'Bit');
  }

  return getDirectory();
}

export const CACHE_ROOT = getCacheDirectory();
export const GLOBAL_CONFIG = path.join(CACHE_ROOT, 'config');
export const GLOBAL_CONFIG_FILE = 'config.json';
export const NULL_BYTE = '\u0000';
export const SPACE_DELIMITER = ' ';
export const DEFAULT_SSH_KEY_FILE = `${userHome}/.ssh/id_rsa`;
export const CFG_SSH_KEY_FILE_KEY = 'ssh_key_file';
export const DEFAULT_HUB_DOMAIN = 'hub.bitsrc.io';
export const CFG_HUB_DOMAIN_KEY = 'hub_domain';
export const ID_DELIMITER = '/';

// @flow
import path from 'path';
import userHome from 'user-home';
import fs from 'fs';
import { CFG_SSH_KEY_FILE_KEY, DEFAULT_SSH_KEY_FILE } from '../constants';
import { globalConfigGet } from '../global-config';

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

const CACHE_ROOT = getCacheDirectory();
const GLOBAL_CONFIG = path.join(CACHE_ROOT, 'config');
const GLOBAL_CONFIG_FILE = 'config.json';

function getPath() {
  return path.join(GLOBAL_CONFIG, GLOBAL_CONFIG_FILE);
}

function getPathToIdentityFile() {
  const identityFile = globalConfigGet(CFG_SSH_KEY_FILE_KEY);
  return identityFile || DEFAULT_SSH_KEY_FILE;
}

export default function keyGetter(keyPath: ?string) {
  if (keyPath) return fs.readFileSync(keyPath);
  return fs.readFileSync(getPathToIdentityFile());
}


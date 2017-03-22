// @Flow
import fs from 'fs';
import path from 'path';
import { GLOBAL_CONFIG, GLOBAL_CONFIG_FILE } from '../constants';
import bit from 'bit-js';

const isString = bit('is-string');

function getPath() {
  return path.join(GLOBAL_CONFIG, GLOBAL_CONFIG_FILE);
}

class GlobalConfig {
  config: Object;

  constructor(config) {
    this.config = config;
  }

  get(key: string): ?string {
    if (this.config[key]) {
      return this.config[key];
    }

    return null;
  }

  toString() {
    return JSON.stringify(this.config);
  }

  static fromString(str: string): Object {
    if (!isString(str)) {
      throw new Error(`invalid type to from string function, type should be string instead it is ${typeof str}`)
    }

    return new GlobalConfig(JSON.parse(str));
  }

  static loadSync(): GlobalConfig {
    try {
      const contents = fs.readFileSync(getPath()).toString();
      return this.fromString(contents);
    } catch (err) {
      if (err.code !== 'ENOENT') return err;
      return new GlobalConfig({});
    }
  }
}

export function getSync(key: string): ?string {
  const config = GlobalConfig.loadSync();
  return config.get(key);
}

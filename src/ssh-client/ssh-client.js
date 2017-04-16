/** @flow */
import sequest from 'sequest';
import bit from 'bit-js';
import keyGetter from './ssh-key-getter';
import parseComponentObjects from '../parse-component-objects';
import populateComponent from '../populate-component';
import { BIT_VERSION } from '../constants';

import {
  RemoteScopeNotFound,
  NetworkError,
  UnexpectedNetworkError,
  PermissionDenied,
  ComponentNotFound } from '../exceptions';

type SSHUrl = {
  username: string,
  port: number,
  host: string,
  path: ?string
};

const toBase64 = bit('string/to-base64');
const fromBase64 = bit('string/from-base64');
const isString = bit('is-string');
const isNumber = bit('is-number');
const parseSSHUrl = bit('ssh/parse-url');
const removeNewLines = bit('string/remove-new-lines');

const unpackCommand = (str: any): any => JSON.parse(fromBase64(str));
const packCommand = (obj: Object) => toBase64(JSON.stringify(obj))

function absolutePath(path: string) {
  if (!path.startsWith('/')) return `~/${path}`;
  return path;
}

export type Response = {
  payload: any,
  headers: {
    version: string
  }
}

function buildCommandMessage(payload: any): Response {
  return {
    payload,
    headers: {
      version: BIT_VERSION
    }
  };
};

function errorHandler(err, optionalId) {
  switch (err.code) {
    default:
      return new UnexpectedNetworkError();
    case 127:
      return new ComponentNotFound(err.id || optionalId);
    case 128:
      return new PermissionDenied();
    case 129:
      return new RemoteScopeNotFound();
    case 130:
      return new PermissionDenied();
  }
}

type SSHProps = {
  path: ?string,
  username: string,
  port: number,
  host: string
};

/**
 * an ssh client for consuming bit components from a remote scope
 * @param {type} name
 * @returns {type}
 * @example
 */
module.exports = class ScopeSSHClient {
  connection: any;
  path: ?string;
  username: string;
  port: number;
  host: string;

  constructor({ path, username, port, host }: SSHProps) {
    this.path = path;
    this.username = username;
    this.port = port;
    this.host = host || '';
  }

  buildCmd(commandName: string, path: string, payload: any): string {
    return `bit ${commandName} ${toBase64(path)} ${packCommand(buildCommandMessage(payload))}`;
  }

  exec(commandName: string, payload: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const cmd = this.buildCmd(
        commandName,
        absolutePath(this.path || ''),
        payload
      );

      this.connection(cmd, function (err, res, o) {
        if (!o) return reject(UnexpectedNetworkError);
        if (err && o.code && o.code !== 0) return reject(errorHandler(err, res));
        return resolve(removeNewLines(res));
      });
    });
  }

  fetch(ids: string[], noDeps: bool = false): Promise<any> {
    let options = '';
    ids = ids.map(bitId => bitId.toString());
    if (noDeps) options = '-n';
    return this.exec(`_fetch ${options}`, ids)
      .then((str: string) => {
        const response = unpackCommand(str);
        return {
          headers: response.headers,
          payload: response.payload.map((objects) => {
            return populateComponent(parseComponentObjects(objects));
          })
        };
      });
  }

  close() {
    this.connection.end();
    return this;
  }

  composeConnectionUrl() {
    return `${this.username}@${this.host}:${this.port}`;
  }

  connect(key: ?string): Promise<ScopeSSHClient> {
    this.connection = sequest.connect(this.composeConnectionUrl(), {
      privateKey: keyGetter(key)
    });

    return Promise.resolve(this);
  }

  static fromUrl(url: string): ScopeSSHClient {
    return new ScopeSSHClient(parseSSHUrl(url));
  }
};

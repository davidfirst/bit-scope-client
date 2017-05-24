// @flow
import R from 'ramda';
import fs from 'fs-extra';
import path from 'path';
import { BIT_JSON_NAME, VERSION_DELIMITER, ID_DELIMITER, DEFAULT_LANGUAGE } from '../constants';
import DependencyMap from '../dependency-map';
import InvalidBitJsonException from '../exceptions/invalid-bit-json';
import DuplicateComponentException from '../exceptions/duplicate-component';

const composePath = p => path.join(p, BIT_JSON_NAME);
const readJson = p => JSON.parse(fs.readFileSync(p, 'utf8'));

class BitJson {
  impl: ?string;
  spec: ?string;
  misc: ?string[];
  compiler: ?string;
  tester: ?string;
  lang: ?string;
  dependencies: ?{[string]: string};
  packageDependencies: ?{[string]: string};
  dependencyMap: ?DependencyMap;

  constructor(bitJson: Object, defaultBitJson?: Object = {}) {
    this.impl = R.path(['sources', 'impl'], bitJson) || defaultBitJson.impl;
    this.spec = R.path(['sources', 'spec'], bitJson) || defaultBitJson.spec;
    this.misc = R.path(['sources', 'misc'], bitJson) || defaultBitJson.misc;
    this.compiler = R.path(['env', 'compiler'], bitJson) || defaultBitJson.compiler;
    this.tester = R.path(['env', 'tester'], bitJson) || defaultBitJson.tester;
    this.lang = R.prop('lang', bitJson) || DEFAULT_LANGUAGE;
    this.dependencies = R.prop('dependencies', bitJson) || defaultBitJson.dependencies;
    this.packageDependencies = R.prop('packageDependencies', bitJson);
    this.dependencyMap = null;
  }

  getFileExtension(): string {
    switch (this.lang) {
      case DEFAULT_LANGUAGE:
      default:
        return 'js';
    }
  }

  get distImplFileName(): string {
    const baseImplName = path.parse(this.impl).name;
    return `${baseImplName}.${this.getFileExtension()}`;
  }

  get distSpecFileName(): string {
    const baseSpecName = path.parse(this.spec).name;
    return `${baseSpecName}.${this.getFileExtension()}`;
  }

  getDependenciesArray(): string[] {
    return R.toPairs(this.dependencies)
    .map(([component, version]) => component + VERSION_DELIMITER + version.toString());
  }

  populateDependencyMap(consumerPath: string) {
    this.dependencyMap = DependencyMap.load(this.dependencies, consumerPath);
  }

  getDependencyMap(consumerPath: string) {
    if (!this.dependencyMap) {
      this.populateDependencyMap(consumerPath);
    }

    // $FlowFixMe
    return this.dependencyMap.getDependencies();
  }

  toObject() {
    return {
      sources: {
        impl: this.impl,
        spec: this.spec,
        misc: this.misc,
      },
      env: {
        compiler: this.compiler,
        tester: this.tester,
      },
      dependencies: this.dependencies,
      packageDependencies: this.packageDependencies,
    };
  }

  validateDependencies(): void {
    if (!this.dependencies || R.isEmpty(this.dependencies)) return;
    const dependenciesArr = Object.keys(this.dependencies);
    const boxesAndNames = dependenciesArr
      .map(dependency => dependency.substring(dependency.indexOf(ID_DELIMITER) + 1));
    if (R.uniq(boxesAndNames).length !== dependenciesArr.length) {
      throw new DuplicateComponentException();
    }
  }

  write(dir: string): Promise<?Error> {
    return new Promise((resolve, reject) =>
      fs.outputJson(
        composePath(dir),
        this.toObject(),
        (err) => {
          if (err) return reject(err);
          return resolve();
        }),
    );
  }

  static loadIfExists(bitPath: string): ?BitJson {
    const bitJsonPath = composePath(bitPath);

    try {
      return new BitJson(readJson(bitJsonPath));
    } catch (e) {
      if (e.code === 'ENOENT') throw e;
      throw new InvalidBitJsonException(e, bitJsonPath);
    }
  }

  static load(bitPath: string, defaultBitJson?: Object = {}): ?BitJson {
    const bitJsonPath = composePath(bitPath);

    try {
      return new BitJson(readJson(bitJsonPath));
    } catch (e) {
      if (e.code === 'ENOENT') return new BitJson({}, defaultBitJson);
      throw new InvalidBitJsonException(e, bitJsonPath);
    }
  }
}

module.exports = BitJson;

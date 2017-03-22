/** @flow */
import bit from 'bit-js';

const bufferFrom = bit('buffer/from');

export type VersionProps = {
  impl: {
    name: string,
    file: string
  };
  specs?: ?{
    name: string,
    file: string
  };
  dist?: ?{
    name: string,
    file: string
  };
  compiler?: ?string;
  tester?: ?string;
  log: {
    message: string,
    date: string,
    username: ?string,
    email: ?string,
  };
  ci?: Object;
  specsResults?: ?Object;
  docs?: Object[],
  dependencies?: Object;
  flattenedDependencies?: Object;
  packageDependencies?: {[string]: string};
}

export default class Version {
  impl: {
    name: string,
    file: string
  };
  specs: ?{
    name: string,
    file: string
  };
  dist: ?{
    name: string,
    file: string
  };
  compiler: ?string;
  tester: ?string;
  log: {
    message: string,
    date: string,
    username: ?string,
    email: ?string,
  };
  ci: Object;
  specsResults: ?Object;
  docs: Object[];
  dependencies: Object;
  flattenedDependencies: Object;
  packageDependencies: {[string]: string};

  constructor({
    impl,
    specs,
    dist,
    compiler,
    tester,
    log,
    dependencies,
    docs,
    ci,
    specsResults,
    flattenedDependencies,
    packageDependencies
  }: VersionProps) {
    this.impl = impl;
    this.specs = specs;
    this.dist = dist;
    this.compiler = compiler;
    this.tester = tester;
    this.log = log;
    this.dependencies = dependencies || {};
    this.docs = docs || [];
    this.ci = ci || {};
    this.specsResults = specsResults;
    this.flattenedDependencies = flattenedDependencies || {};
    this.packageDependencies = packageDependencies || {};
  }

  static parse(contents) {
    const {
      impl,
      specs,
      dist,
      compiler,
      tester,
      log,
      docs,
      ci,
      specsResults,
      dependencies,
      flattenedDependencies,
      packageDependencies
    } = JSON.parse(contents);

    return new Version({
      impl,
      specs: specs || null,
      dist: dist || null,
      compiler: compiler || null,
      tester: tester || null,
      log,
      ci,
      specsResults,
      docs,
      dependencies,
      flattenedDependencies,
      packageDependencies,
    });
  }
}

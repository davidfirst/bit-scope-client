/** @flow */
import bit from 'bit-js';

const bufferFrom = bit('buffer/from');
// const filterObject = bit('object/filter'); // TODO - write

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
    this.dependencies = dependencies;
    this.docs = docs;
    this.ci = ci;
    this.specsResults = specsResults;
    this.flattenedDependencies = flattenedDependencies;
    this.packageDependencies = packageDependencies;
  }

  id() {
    const obj = this.toObject();

    return JSON.stringify(filterObject({
      impl: obj.impl,
      specs: obj.specs,
      compiler: this.compiler ? this.compiler.toString(): null,
      tester: this.tester ? this.tester.toString(): null,
      log: obj.log,
      dependencies: this.dependencies.map(dep => dep.toString()),
      packageDependencies: this.packageDependencies
    }, val => !!val));
  }

  refs(): string[] {
    return [
      this.impl.file,
      // $FlowFixMe
      this.specs ? this.specs.file : null,
      // $FlowFixMe (after filtering the nulls there is no problem)
      this.dist ? this.dist.file : null,
    ].filter(ref => ref);
  }

  toObject() {
    return filterObject({
      impl: {
        file: this.impl.file,
        name: this.impl.name
      },
      specs: this.specs ? {
        file: this.specs.file,
        name: this.specs.name
      }: null,
      dist: this.dist ? {
        file: this.dist.file,
        name: this.dist.name
      }: null,
      compiler: this.compiler || null,
      tester: this.tester || null,
      log: {
        message: this.log.message,
        date: this.log.date,
        username: this.log.username,
        email: this.log.email,
      },
      ci: this.ci,
      specsResults: this.specsResults,
      docs: this.docs,
      dependencies: this.dependencies,
      flattenedDependencies: this.flattenedDependencies,
      packageDependencies: this.packageDependencies
    }, val => !!val);
  }

  toBuffer(): Buffer {
    const obj = this.toObject();
    const str = JSON.stringify(obj);
    return bufferFrom(str);
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

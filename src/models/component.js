/** @flow */
export type ComponentProps = {
  scope: string;
  box: string;
  name: string;
  versions: {[number]: string};
};

export default class Component {
  scope: string;
  name: string;
  box: string;
  versions: {[number]: string}; // { versionNumber: refId }

  constructor(props: ComponentProps) {
    this.scope = props.scope;
    this.name = props.name;
    this.box = props.box;
    this.versions = props.versions;
  }

  get id(): string {
    return [this.scope, this.box, this.name].join('/');
  }

  listVersions(): number[] {
    return Object.keys(this.versions).map(versionStr => parseInt(versionStr));
  }

  static parse(contents: string): Component {
    return new Component(JSON.parse(contents));
  }
}

export default class Source {
  contents: Buffer;

  constructor(contents: Buffer) {
    this.contents = contents;
  }

  get id() {
    return this.contents.toString();
  }

  toBuffer() {
    return this.contents;
  }

  toString() {
    return this.contents.toString();
  }

  static parse(contents: string): Source {
    return new Source(new Buffer(contents));
  }
}

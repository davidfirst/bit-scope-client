/** @flow */
export default class ComponentNotFound extends Error {
  id: string;

  constructor(id: string) {
    super();
    this.id = id;
    this.name = ComponentNotFound.name;
  }
}

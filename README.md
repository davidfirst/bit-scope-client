# bit-scope-client

![wip](https://img.shields.io/badge/state-work%20in%20progress-orange.svg)

The bit scope client has only one function in its api. it gets an array of component ids and returns an array of component and dependencies objects.

```js
const bitScopeClient = require('bit-scope-client');

const componentIds = ['bit.utils/array/flat-map', 'bit.promise/global/promisify', 'bit.utils/array/diff'];

bitScopeClient(componentIds)
.then((componentDependenciesArr) => {
  componentDependenciesArr.forEach((componentDependencies) => {
    console.log(componentDependencies) // { component: Component, dependencies: Component[] }
  });
});
```

The return value is a promise with an Array of objects contains the main Component and its dependencies.

## Component its an object with the following structure
```json
{
    "component": {
        "scope": "component scope",
        "name": "component name",
        "box": "component namespace",
        "impl": {
            "file": "file contents",
            "name": "impl.js"
        },
        "specs": {
            "file": "file contents",
            "name": "spec.js"
        },
        "dist": {
            "file": "file contents",
            "name": "dist.js"
        },
        "compiler": "component-id/none",
        "tester": "component-id/none",
        "log": {
            "message": "exmaple message",
            "date": "1487178184111",
            "username": "example username",
            "email": "exmaple@email.com"
        },
        "dependencies": ["an array of component ids"],
        "docs": [
            {
                "name": "function name",
                "description": "example description",
                "args": [
                    {
                        "description": "example description",
                        "type": "arg type",
                        "name": "arg name"
                    }
                ],
                "returns": {
                    "description": "example description",
                    "type": "return type"
                },
                "access": "public/private",
                "examples": [
                    {
                        "raw": "raw examples",
                        "code": "identified exampels"
                    }
                ],
                "static": true
            }
        ],
        "ci": { "ci object if the ci run": "example"},
        "specsResults": {
            "tests": [
                {
                    "title": "test description",
                    "pass": true,
                    "err": null,
                    "duration": 2
                }
            ],
            "stats": {
                "start": "2017-02-15T17:03:04.095Z",
                "end": "2017-02-15T17:03:04.104Z",
                "duration": 9
            },
            "pass": true
        },
        "flattenedDependencies": [],
        "packageDependencies": {},
        "version": "0"
    },
    "dependencies": []
}
```

## an example Component object

```json
{
    "component": {
        "scope": "bit.utils",
        "name": "flat-map",
        "box": "array",
        "impl": {
            "file": "/** @flow */\n\n/**\n * Builds a new collection by applying a function to all elements of \n * this array and using the elements of the resulting collections.\n * @name flatMap\n * @param {[*]} array\n * @param {Function} cb\n * @returns {[*]}\n * @example\n * ```js\n *  flatMap([[1, 2, 3], [4, 5, 6]], val => val) // => [1, 2, 3, 4, 5, 6]\n * ```\n */\nmodule.exports = function flatMap(array: any[], cb: (val: any, key: number) => any[]) {\n  return Array.prototype.concat.apply([], array.map(cb));\n};\n",
            "name": "impl.js"
        },
        "specs": {
            "file": "import { expect } from 'chai';\n\nconst flatMap = require(__impl__);\n\ndescribe('#flatMap()', () => {\n  it('should flatten the multi-dimensional array to a single-dimensional one ', () => {\n    const array = [[1, 2, 3], [4, 5, 6]];\n    expect(flatMap(array, val => val)).to.deep.equal([1, 2, 3, 4, 5, 6]);\n  });\n\n  it('should flatten to a single-dimensional array without odd numbers', () => {\n    const array = [[1, 2, 3], [4, 5, 6]];\n    expect(flatMap(array, nums => nums.filter(n => n % 2 === 0)))\n      .to.deep.equal([2, 4, 6]);\n  });\n\n  it('should throw a type error in case the first argument is not an array', () => {\n    expect(() => {\n      flatMap();\n    }).to.throw();\n  });\n\n  it('should throw a type error in case the second argument is not a function', () => {\n    expect(() => {\n      flatMap([]);\n    }).to.throw();\n  });\n});\n",
            "name": "spec.js"
        },
        "dist": {
            "file": "\"use strict\";\n\n/**\n * Builds a new collection by applying a function to all elements of \n * this array and using the elements of the resulting collections.\n * @name flatMap\n * @param {[*]} array\n * @param {Function} cb\n * @returns {[*]}\n * @example\n * ```js\n *  flatMap([[1, 2, 3], [4, 5, 6]], val => val) // => [1, 2, 3, 4, 5, 6]\n * ```\n */\nmodule.exports = function flatMap(array, cb) {\n  return Array.prototype.concat.apply([], array.map(cb));\n};",
            "name": "dist.js"
        },
        "compiler": "bit.envs/compilers/flow::latest",
        "tester": "bit.envs/testers/mocha-chai::latest",
        "log": {
            "message": "initial commit",
            "date": "1487178184111",
            "username": "USERNAME",
            "email": "USERNAME@gmail.com"
        },
        "dependencies": [],
        "docs": [
            {
                "name": "flatMap",
                "description": "Builds a new collection by applying a function to all elements of \nthis array and using the elements of the resulting collections.",
                "args": [
                    {
                        "description": null,
                        "type": "[*]",
                        "name": "array"
                    },
                    {
                        "description": null,
                        "type": "Function",
                        "name": "cb"
                    }
                ],
                "returns": {
                    "description": null,
                    "type": "[*]"
                },
                "access": "public",
                "examples": [
                    {
                        "raw": "```js\n flatMap([[1, 2, 3], [4, 5, 6]], val => val) // => [1, 2, 3, 4, 5, 6]\n```",
                        "code": "```js\nflatMap([[1, 2, 3], [4, 5, 6]], val => val) // => [1, 2, 3, 4, 5, 6]\n```"
                    }
                ],
                "static": false
            }
        ],
        "ci": {},
        "specsResults": {
            "tests": [
                {
                    "title": "#flatMap() should flatten the multi-dimensional array to a single-dimensional one ",
                    "pass": true,
                    "err": null,
                    "duration": 2
                },
                {
                    "title": "#flatMap() should flatten to a single-dimensional array without odd numbers",
                    "pass": true,
                    "err": null,
                    "duration": 0
                },
                {
                    "title": "#flatMap() should throw a type error in case the first argument is not an array",
                    "pass": true,
                    "err": null,
                    "duration": 2
                },
                {
                    "title": "#flatMap() should throw a type error in case the second argument is not a function",
                    "pass": true,
                    "err": null,
                    "duration": 0
                }
            ],
            "stats": {
                "start": "2017-02-15T17:03:04.095Z",
                "end": "2017-02-15T17:03:04.104Z",
                "duration": 9
            },
            "pass": true
        },
        "flattenedDependencies": [],
        "packageDependencies": {},
        "version": "0"
    },
    "dependencies": []
}
```

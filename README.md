# Neo4j-Stream

[![Build Status](https://travis-ci.org/tether/neo4j-stream.svg?branch=master)](https://travis-ci.org/tether/neo4j-stream)
[![NPM](https://img.shields.io/npm/v/neo4j-stream.svg)](https://www.npmjs.com/package/neo4j-stream)
[![Downloads](https://img.shields.io/npm/dm/neo4j-stream.svg)](http://npm-stat.com/charts.html?package=neo4j-stream)
[![guidelines](https://tether.github.io/contribution-guide/badge-guidelines.svg)](https://github.com/tether/contribution-guide)

Create a json [line delimited](https://en.wikipedia.org/wiki/JSON_Streaming#Line_delimited_JSON) stream from records returned by cypher query.

## Usage

```js
// initialize cypher with a driver session
const cypher = require('neo4j-stream')(session)

cypher`
  MATCH (people:PEOPLE)
  RETURN people
`.pipe(dest)
```

A session should be created from the official [neo4j javascript driver](https://github.com/neo4j/neo4j-javascript-driver).

Using [json-to-cypher](https://github.com/bredele/json-to-cypher), this module also allows you to quickly create cypher properties from JavaScript objects or primitives.

```js
const name = 'John'
const john = {
  name: name,
  age: 30
}

// create properties from object
cypher`
  CREATE (people:PEOPLE ${john})
`

// create properties from primitives
cypher`
  CREATE (people:PEOPLE {name: ${name}})
`
```

## Installation

```shell
npm install neo4j-stream --save
```

[![NPM](https://nodei.co/npm/neo4j-stream.png)](https://nodei.co/npm/neo4j-stream/)


## Question

For support, bug reports and or feature requests please make sure to read our
<a href="https://github.com/tether/contribution-guide/blob/master/community.md" target="_blank">community guidelines</a> and use the issue list of this repo and make sure it's not present yet in our reporting checklist.

## Contribution

The open source community is very important to us. If you want to participate to this repository, please make sure to read our <a href="https://github.com/tether/contribution-guide" target="_blank">guidelines</a> before making any pull request. If you have any related project, please let everyone know in our wiki.

## License

The MIT License (MIT)

Copyright (c) 2017 Tether Inc

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


/**
 * Test dependencies.
 */

const test = require('tape')
const stream = require('..')
const concat = require('concat-stream')


test('should create a session to run statement', assert => {
  assert.plan(1)
  const cypher = stream({
    session () {
      assert.ok(true, 'session created')
      return {
        run() {
          return {
            subscribe() {

            }
          }
        },
        close() {

        }
      }
    }
  })
  cypher`MATCH (n) RETURN n`
})

test('should run a session statement', assert => {
  assert.plan(1)
  const statement = `MATCH (n) RETURN n`
  const cypher = stream({
    session () {
      return {
        run(str) {
          assert.ok(str === statement, 'run statement')
          return {
            subscribe() {

            }
          }
        }
      }
    }
  })
  cypher`${statement}`
})


test('should close session once statement is completed', assert => {
  assert.plan(1)
  const cypher = stream({
    session () {
      return {
        run() {
          return {
            subscribe(obj) {
              setTimeout(() => {
                obj.onCompleted()
              }, 500)
            }
          }
        },

        close() {
          assert.ok(true, 'session closed')
        }
      }
    }
  })
  cypher`MATCH (n) RETURN n`
})

test('should return a readable stream', assert => {
  assert.plan(3)
  const cypher = stream({
    session () {
      return {
        run() {
          return {
            subscribe() {}
          }
        },
        close() {}
      }
    }
  })
  const result = cypher`MATCH (n) RETURN n`
  assert.equal(typeof result.on, 'function')
  assert.equal(typeof result.pipe, 'function')
  assert.equal(result.readable, true)
})

test('should stream statement results', assert => {
  assert.plan(1)
  const cypher = stream({
    session () {
      return {
        run() {
          return {
            subscribe(obj) {
              setTimeout(() => {
                obj.onNext(record('hello '))
                setTimeout(() => {
                  obj.onNext(record('world'))
                  obj.onCompleted()
                }, 500)
              }, 500)
            }
          }
        },

        close() {}
      }
    }
  })
  cypher`MATCH (n) RETURN n`
    .pipe(concat(data => {
      assert.equal(data.toString(), '"hello "\n"world"\n')
    }))
})

function record (str) {
  return {
    identity: 1,
    get() {
      return str
    }
  }
}

// test('should emit error on session error', assert => {
//   assert.plan(1)
//   const cypher = stream({
//     session () {
//       return {
//         run() {
//           return {
//             subscribe(obj) {
//               obj.onError('fail!')
//             }
//           }
//         },
//
//         close() {}
//       }
//     }
//   })
//   cypher`MATCH (n) RETURN n`.on('error', (error) => {
//     assert.equal(error, 'fail!')
//   })
// })


test('should serialize cypher properties automatically', assert => {
  assert.plan(1)
  const properties = {
    name: 'foo'
  }
  const cypher = stream({
    session () {
      return {
        run(str) {
          assert.equal(str, 'MATCH (n:PEOPLE {name:"foo"}) RETURN n')
          return {
            subscribe() {

            }
          }
        }
      }
    }
  })
  cypher`MATCH (n:PEOPLE ${properties}) RETURN n`
})


test('should serialize primitives', assert => {
  assert.plan(1)
  const name = 'Olivier'
  const age = 30
  const cypher = stream({
    session () {
      return {
        run(str) {
          assert.equal(str, 'MATCH (n:PEOPLE {name:"Olivier", age: 30}) RETURN n')
          return {
            subscribe() {

            }
          }
        }
      }
    }
  })
  cypher`MATCH (n:PEOPLE {name: ${name}, age: ${age}}) RETURN n`
})

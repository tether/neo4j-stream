
/**
 * Test dependencies.
 */

const test = require('tape')
const stream = require('..')


test('should create a session to run statatement', assert => {
  assert.plan(1)
  const cypher = stream({
    session () {
      assert.ok(true, 'session created')
    }
  })
  cypher`MATCH (n) RETURN n`
})

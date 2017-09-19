/**
 * Dependencies.
 */

const Readable = require('readable-stream').Readable
const serialize = require('json-to-cypher')


/**
 * Stream neo4j records for a given statement.
 *
 * A record identity is removed for security reason. records
 * are streamed as JSON object with a line break as separator.
 *
 * @param {Object} driver
 * @param {Boolean} objectMode (false by default)
 * @return {Stream}
 *
 * @see http://neo4j.com/docs/api/javascript-driver/current/class/src/v1/driver.js~Driver.html
 * @api public
 */

module.exports = function (driver, objectMode) {
  const session = driver.session()
  return (chunks, ...data) => {
    const stream = Readable()
    stream._read = () => {}
    session
      .run(compose(chunks, data))
      .subscribe({
        onNext(data) {
          data.keys.map((key, idx) => {
            const record = data.get(idx)
            delete record['identity']
            stream.push(objectMode
              ? record
              : JSON.stringify(record) + '\n'
            )
          })
        },
        onCompleted() {
          stream.push(null)
          session.close()
        },
        onError(error) {
          stream.emit('error', new Error(error))
        }
      })
    return stream
  }
}

/**
 * Cypher queries are passed using tagged template.
 * This methods allows to compose back a statement and automatically
 * serialize properties.
 *
 * @param {Array} chunks
 * @return {String}
 * @api private
 */

function compose (chunks, data) {
  let result = ''
  data.map((item, idx) => {
    result += chunks[idx]
    const value = result ? primitives(item) : item
    result += typeof item === 'object'
      ? serialize(item)
      : value
  })
  result += chunks.slice(-1)
  return result
}


function primitives (arg) {
  return typeof arg === 'string'
   ? `"${arg}"`
   : arg
}

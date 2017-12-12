/**
 * Dependencies.
 */

const Readable = require('readable-stream').Readable


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
      .run(compose([].concat(chunks), data))
      .subscribe({
        onNext(data) {
          stream.push(JSON.stringify(data))
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
  chunks.map((chunk, idx) => {
    result += chunk + (data[idx] || '')
  })
  return result
}

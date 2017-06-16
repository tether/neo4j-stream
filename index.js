/**
 * Dependencies.
 */

const Readable = require('readable-stream').Readable
const serialize = require('json-to-cypher')


/**
 * This is a simple description.
 *
 * @api public
 */

module.exports = function (driver) {
  const session = driver.session()
  return (chunks, ...data) => {
    const stream = Readable({
      objectMode: true
    })
    stream._read = () => {}
    session
      .run(compose(chunks, data))
      .subscribe({
        onNext(record) {
          stream.push(record)
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


function compose (chunks, data) {
  let result = ''
  data.map((item, idx) => {
    result += chunks[idx]
    result += typeof item === 'object'
      ? serialize(item)
      : item
  })
  result += chunks.slice(-1)
  return result
}

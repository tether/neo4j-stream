/**
 * Dependencies.
 */

const Readable = require('readable-stream').Readable

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
    session
      .run(compose(chunks, data))
      .subscribe({
        onCompleted() {
          session.close()
        }
      })
    return stream
  }
}


function compose (chunks, data) {
  let result = ''
  data.map((item, idx) => {
    result += chunks[idx]
    result += item
  })
  result += chunks.slice(-1)
  return result
}

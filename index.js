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

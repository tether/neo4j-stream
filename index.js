
/**
 * This is a simple description.
 *
 * @api public
 */

module.exports = function (driver) {
  const session = driver.session()
  return (chunks, ...data) => {
    session.run(compose(chunks, data))
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

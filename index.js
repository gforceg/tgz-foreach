const zlib = require('zlib')
const path = require('path')
const fs = require('fs')
const tar = require('tar-stream')

module.exports = function (in_file, callback) {

  if (!in_file) { throw 'no input file specified' }
  if (!callback) { throw 'no callback was specified' }

  let input = fs.createReadStream(in_file)

  const gunzip = zlib.createGunzip()
  const extract = tar.extract()

  input.pipe(gunzip) // unzip the tar
    .pipe(extract) // parse the tar
    .on('entry', (header, stream, next) => {
      let file = header.name
      let data = ''
      stream.on('data', (d) => data += new Buffer(d, 'utf8').toString())
      stream.on('end', () => {
        callback(header, data)
        next()
      })
    })

  input.on('finish', () => {
    input.close()
  })
}

// sample usage: print each file in the package and change nothing (modify data to make changes, return null to omit a file in the new .tgz)
// modify('files/package.tgz', 'output/package.tgz', (header, data) => { console.log(header.name) ; return data })
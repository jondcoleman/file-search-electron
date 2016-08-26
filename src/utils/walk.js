import getConfig from './getConfig'
const walker = require('walker')
const path = require('path')

export default function(fnEntry, fnErr, fnEnd) {
  getConfig((config) => {

    const indexPaths = config.indexPaths
    const filterPaths = config.ignoredPaths.map(str => path.normalize(str))

    const files = []
    const start = new Date()
    let count = 0
    let pathCounter = 0

    function handlePathDone() {
      pathCounter++
      if (pathCounter === indexPaths.length) {
          const elapsedTime = ((new Date()) - start) / 1000 / 60
          if (fnEnd) fnEnd(count, elapsedTime, files)
      }
    }

    indexPaths.forEach((path) => {
      walker(path)
        .filterDir((dir, stat) => {
          if (filterPaths.indexOf(dir) >= 0) {
            console.log('skipping', dir, stat)
            return false
          }
          return true
        })
        .on('entry', (entry, stat) => {
          count++
          if (fnEntry) fnEntry(entry, stat, count)
          files.push({
            file: entry,
            stats: JSON.stringify(stat)
          })
        })
        .on('error', (err, entry, stat) => {
          if (fnErr) fnErr(err, entry, stat)
          console.log('Got error ' + err + ' on entry ' + entry)
        })
        .on('end', () => {
          handlePathDone()
        })
    })
  })
}
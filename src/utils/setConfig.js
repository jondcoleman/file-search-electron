const jsonfile = require('jsonfile')
const configFile = './config/config.json'
import remove from './remove'
import getConfig from './getConfig'

function setConfig(obj, cb) {
  jsonfile.writeFile(configFile, obj, { spaces: 2 }, (err) => {
    if (err) {
      console.log(err)
      return
    }
    if (cb) cb()
  })
}

export default {
  addIgnoredPath(path, cb) {
    getConfig((obj) => {
      obj.ignoredPaths.push(path)
      setConfig(obj, cb)
    })
  },
  addIndexPath(path, cb) {
    // debugger
    getConfig((obj) => {
      // debugger
      obj.indexPaths.push(path)
      setConfig(obj, cb)
    })
  },
  removeIgnoredrPath(path, cb) {
    getConfig((obj) => {
      remove(obj.ignoredPaths, path)
      setConfig(obj, cb)
    })
  },
  removeIndexPath(path, cb) {
    getConfig((obj) => {
      remove(obj.indexPaths, path)
      setConfig(obj, cb)
    })
  }
}
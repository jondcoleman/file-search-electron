import db from '../db'
import remove from './remove'
import getConfig from './getConfig'

export default {
  addIgnoredPath(path, cb) {
    db.ignoredPaths.add({ path })
      .then(cb)
  },
  addIndexPath(path, cb) {
    db.indexPaths.add({ path })
      .then(cb)
  },
  removeIgnoredPath(key, cb) {
    db.ignoredPaths.delete(key)
      .then(cb)
  },
  removeIndexPath(key, cb) {
    db.indexPaths.delete(key)
      .then(cb)
  }
}
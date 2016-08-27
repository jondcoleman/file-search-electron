import db from '../db'

export default function getConfig(cb) {
  const config = {}
  Promise.all([db.indexPaths.toArray(), db.ignoredPaths.toArray()])
    .then((data) => {
      config.indexPaths = data[0]  //.map(x => x.path)
      config.ignoredPaths = data[1]  //.map(x => x.path)
      cb(config)
    })
}
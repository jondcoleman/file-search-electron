import Dexie from 'dexie'

function getUserDir() {
  if (process.platform == 'win32') return process.env['USERPROFILE'] + '\\Documents'
  return process.env['HOME']
}
var db = new Dexie("file_search_database")

db.version(1).stores({
  updated: 'date',
  files: '++id, file, filename, path, stats',
  indexPaths: '++id, path',
  ignoredPaths: '++id, path'
})

db.on('ready', () => {
  return db.indexPaths.count(count => {
    if (count < 1) {
      return db.indexPaths.add({path: getUserDir()})
    }
  })
})

db.open().catch((e) => {
  console.error("Open failed: " + e)
})

export default db
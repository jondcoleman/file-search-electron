import Dexie from 'dexie'

var db = new Dexie("file_search_database")

db.version(1).stores({
  updated: 'date',
  files: '++id, file, filename, path, stats'
})

//
// Open it
//
db.open().catch((e) => {
  console.error("Open failed: " + e)
})

export default db
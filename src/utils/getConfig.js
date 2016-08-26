const jsonfile = require('jsonfile')
const configFile = './config/config.json'

export default function getConfig(cb) {
  jsonfile.readFile(configFile, (err, obj) => {
    if (err) {
      console.log(err)
      return
    }
    if (cb) cb(obj)
  })
}
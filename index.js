require('dotenv').config()
const AnimusHeart = require('jons-animusheart')

const apiKey = process.env.ANIMUS_APIKEY
const wsProtocol = 'AHauth'

class Logger {
  constructor(level) {
    this.level = typeof level === 'undefined' ? 1 : level
  }
  _ts() {
    const d = new Date()
    return [
      d.getHours().toString().padStart(2,'0'),
      d.getMinutes().toString().padStart(2,'0'),
      d.getSeconds().toString().padStart(2,'0')
    ].join(':')
  }
  format() {
    return [...arguments].map(item => {
      if (item instanceof Object) {
        return JSON.stringify(item)
      } else {
        return item
      }
    }).join(' ')
  }
  debug() {
    if (this.level > Logger.Level.debug) { return; }
    console.debug(this._ts(), '[DEBUG]', this.format(...arguments))
  }
  info() {
    if (this.level > Logger.Level.info) { return; }
    console.info(this._ts(), '[INFO]', this.format(...arguments))
  }
  warn() {
    if (this.level > Logger.Level.warn) { return; }
    console.warn(this._ts(), '[WARN]', this.format(...arguments))
  }
  error() {
    console.error(this._ts(), '[ERROR]', this.format(...arguments))
  }
}
Logger.Level = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}

const logger = new Logger(Logger.Level.debug)
const cache = new AnimusHeart.Cache.FileCache('./cache', { ttl: 0, logger })
const heartOpts = { cache, logger }

const heart = new AnimusHeart(process.env.ANIMUS_IP,
                              process.env.ANIMUS_APIKEY,
                              heartOpts)

let devices = {}

let init = async () => {
  try {
//    devices = await heart.devices
//    for (let d in devices) {
//      console.log(await devices[d])
//    }
//    console.log(devices)
//    const k = Object.keys(devices)[0]
//    const f = await devices[k].functions
    heart.events.subscribe(d => logger.debug("[DATA]", d.data))
  } catch (ex) {
    logger.error('Error init', ex)
  }
}

init()

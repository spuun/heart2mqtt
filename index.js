require('dotenv').config()
const WebSocket = require('ws')
const AnimusHeart = require('jons-animusheart')

const apiKey = process.env.ANIMUS_APIKEY
const wsProtocol = 'AHauth'

class Logger {
  constructor(level) {
    this.level = typeof level === 'undefined' ? 1 : level
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
    console.debug('[DEBUG]', this.format(...arguments))
  }
  info() {
    if (this.level > Logger.Level.info) { return; }
    console.info('[INFO]', this.format(...arguments))
  }
  warn() {
    if (this.level > Logger.Level.warn) { return; }
    console.warn('[WARN]', this.format(...arguments))
  }
  error() {
    console.error('[ERROR]', this.format(...arguments))
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
    devices = await heart.devices
    const k = Object.keys(devices)[0]
    logger.info('k', k)
    const f = await devices[k].functions
    logger.info('funcs', f)
  } catch (ex) {
    logger.error('Error init', ex)
  }
}

init()

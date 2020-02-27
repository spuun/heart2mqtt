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
    return [arguments].join(' ')
  }
  debug() {
    if (this.level > Logger.level.debug) { return; }
    console.debug('[DEBUG]', this.format(...arguments))
  }
  info() {
    if (this.level > Logger.level.info) { return; }
    console.info('[INFO]', this.format(...arguments))
  }
  warn() {
    if (this.level > Logger.level.warn) { return; }
    console.warn('[WARN]', this.format(...arguments))
  }
  error() {
    console.error('[ERROR]', this.format(...arguments))
  }
}
Logger.level = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
}

const logger = new Logger(Logger.level.debug)
const heartOpts = {
  cache: new AnimusHeart.cache.FileCache('./cache', { "ttl": 0, logger }),
  logger
}
const heart = new AnimusHeart(process.env.ANIMUS_IP,
                              process.env.ANIMUS_APIKEY,
                              heartOpts)

let devices = {}

let init = async () => {
  try {
    devices = await heart.devices
    const k = Object.keys(devices)[0]
    console.log('k', k)
    const f = await devices[k].functions
    console.log('funcs', f)
  } catch (ex) {
    logger.error('Error init', ex)
  }
}

init()
require('dotenv').config()
const AnimusHeart = require('jons-animusheart')

const Logger = require('./logger')

const apiKey = process.env.ANIMUS_APIKEY
const wsProtocol = 'AHauth'


const logger = new Logger(Logger.Level.Info)
const cache = new AnimusHeart.Cache.FileCache('./cache', { ttl: 0, logger })
const heartOpts = { cache, logger }

const heart = new AnimusHeart(process.env.ANIMUS_IP,
                              process.env.ANIMUS_APIKEY,
                              heartOpts)
logger.info('Heart', heart)


const init = async () => {
  try {
   heart.events.subscribe(d => logger.debug("[DATA]", d))
  } catch (ex) {
    logger.error('Error init', ex)
  }
}

init()

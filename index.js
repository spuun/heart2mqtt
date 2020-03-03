require('dotenv').config()
const mqtt = require('mqtt')

const AnimusHeart = require('jons-animusheart')
const Logger = require('./logger')

const apiKey = process.env.ANIMUS_APIKEY
const wsProtocol = 'AHauth'


const logger = new Logger(Logger.Level.info)
const cacheOpts = { ttl: 0, logger }
const cache = new AnimusHeart.Cache.FileCache('./cache', cacheOpts)
const heartOpts = { cache, logger }
const heart = new AnimusHeart(process.env.ANIMUS_IP,
                              process.env.ANIMUS_APIKEY,
                              heartOpts)
logger.info('Heart', heart)

function heartEvent2MqttTopic(d) {
  const [deviceId, funcId] = d.functionId.split(':')
  return `heart/${deviceId}/${funcId}/${d.propertyName}`
}

const init = async () => {
  try {
    const client = mqtt.connect(process.env.MQTT_URL, {
      clientid: 'heart2mqtt',
      reconnectPeriod: 3*1000,
      connectTimeout: 10*1000
    })
    client.on('connect', _ => logger.info("[MQTT] Connected"))
    client.on('error', e => logger.error('[MQTT]', e))
    client.on('disconnect', _ => logger.info('[MQTT] Disconnected'))
    client.on('reconnect', _ => logger.info('[MQTT] Reconnecting'))
    heart.events.subscribe(d => {
      logger.info("[DATA]", d)
      client.publish(heartEvent2MqttTopic(d), d.data)
    })
  } catch (ex) {
    logger.error('Error init', ex)
  }
}

init()

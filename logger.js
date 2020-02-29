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
      if (typeof item == 'object') {
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

module.exports = Logger

'use strict';

const Config = require('config')
const nats = require('nats')
const _ = require('lodash')

module.exports = {

  /**
   * Start new nats listeger
   * @return {Promise}
   */
  connect(fn) {

    if (!_.isFunction(fn)) {
      return Promise.reject(new Error('Wrong nats connection function'))
    }

    return new Promise((resolve, reject) => {
      const nc = nats.connect({
        servers: [Config.get('nats')],
        json: true
      })

      nc.on('connect', () => {
        const stack_id = Config.get('stackId')

        console.log('Connected to NATS. Subscribing to ' + stack_id)
        console.log(`chain.${stack_id}`)
        nc.subscribe(`chain.${stack_id}`, fn)
        resolve(nc)
      })
      nc.on('disconnect', (some) => {
        console.error('NATS disconnected')
        console.error(some)
      })
      nc.on('error', (err) => reject(err))
    })
  }
}

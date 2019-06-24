'use strict';

const nats = require('./nats')
const web_api = require('./web_api')
const docker = require('./docker')
const _ = require('lodash')

const Service = {

  /**
   * Blockchain details that will be loaded from qa_dashboard
   * @type {Object}
   */
  details: null,

  /**
   * Nats.io connection
   * @type {Object}
   */
  nc: null,

  /**
   * Initialization for service
   */
  init: async function() {
    this.details = await web_api.get_chain_info()
    if (this.details.status != 'ready' && this.details.status != 'initializing') {
      throw new Error('Wrong chain status')
    }

    // Connect to nats
    this.nc = await nats.connect(this.onMessage.bind(this))
    console.log('==========================') // eslint-disable-line
    console.log(this.details) // eslint-disable-line
    console.log('==========================') // eslint-disable-line

    /**
     * Why it's added here ?
     * For example: we might have blockchain with all deployed contracts and all details
     * already ready to be used (if service started after `deployed` event sent).
     * In that case we are able to start required image and not to wait for `deployed` event again
     */
    if (this.details.status == 'ready' && _.isObject(this.details.deploy_data)) {
      setTimeout(this.startDisplay.bind(this, this.details.deploy_data), 5000)
    }
  },

  /**
   * Default nats masse handler
   * @param  {Object} msg {id: 'some-id', event: 'deployed', data: {CONTRACT: 'address'}}
   */
  onMessage: async function(msg) {
    if (!_.isObject(msg) || !msg.event) {
      console.error('Wrong msg received')
      return
    }
    switch(msg.event) {
      case 'deployed':
        console.log('==============================') // eslint-disable-line
        console.log(msg.data) // eslint-disable-line
        console.log('==============================') // eslint-disable-line
        // start required image
        this.startDisplay(msg.data)
        break;
    }
  },

  /**
   * Run Vulcanize DB image and send vdb stack ready event
   * @param  {Object} contracts
   * @return {Promise}
   */
  startDisplay: async function(contracts) {
    // Have to reload details because we might have situation when
    // we have service started but chain - not. and we don't have chain rpc url
    this.details = await web_api.get_chain_info()
    console.log("Reloaded chain details")

    const res = await docker.display(contracts)
    console.log('==========================') // eslint-disable-line
    console.log(res) // eslint-disable-line
    console.log('==========================') // eslint-disable-line
    await web_api.notify_ready()
  }
}

/**
 * Running logic
 */
Service.init()

/**
 * Adding exception/promise rejection handling
 */
process.on('uncaughtException', async (err) => {
  console.error(err)
  await web_api
    .notify_failed("Something is wrong")
    .catch(console.error)
})

process.on('unhandledRejection', async (reason) => {
  console.error(reason)
  await web_api
    .notify_failed("Something is wrong for promise")
    .catch(console.error)

  // Shutting down
  setTimeout(() => { process.exit(1) }, 1000)
})

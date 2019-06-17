'use strict';

const Config = require('config')
const webApi = require('./web_api')
const _ = require('lodash')

module.exports = {
  /**
   * Start new Display instance
   * Image is used: makerdao/testchain-stack-helloworld-display
   * @param  {Object} contracts
   * @return {Promise}
   */
  display(contracts) {
    const details = {
      stack_id: Config.get('stackId'),
      stack_name: Config.get('stackName'),
      network: Config.get('stackId'),
      image: 'makerdao/testchain-stack-helloworld-display',
      ports: [3000],
      env: {
        CONTRACT_ADDRESS_CAT: contracts['MCD_CAT'],
        CONTRACT_ADDRESS_DRIP: contracts['MCD_JUG'],
        CONTRACT_ADDRESS_PEP: contracts['PIP_REP'],
        CONTRACT_ADDRESS_PIP: contracts['PIP_ETH'],
        CONTRACT_ADDRESS_PIT: contracts['MCD_PIT'],
        CONTRACT_ADDRESS_REP: contracts['REP'],
        CONTRACT_ADDRESS_VAT: contracts['MCD_VAT'],
        CONTRACT_ADDRESS_VOW: contracts['MCD_VOW'],
        CONTRACT_ADDRESS_MCD_FLAP: contracts['MCD_FLAP'],
        CONTRACT_ADDRESS_MCD_FLOP: contracts['MCD_FLOP'],
        CONTRACT_ADDRESS_ETH_FLIP: contracts['MCD_FLIP_ETH']
      }
    }

    return webApi
      .start_container(details)
  }
}

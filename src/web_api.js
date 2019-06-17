'use strict';

const Config = require('config')
const request = require('superagent')
const _ = require('lodash')

module.exports = {

  /**
   * Start new docker container
   * @param  {Object} details
   * @return {Promise}
   */
  start_container(details) {
    return request
      .post(`${Config.get('webApi')}/docker/start`)
      .send(details)
      .type('json')
      .then((data) => {

        if (!_.isObject(data.body) || data.body.status != 0 || !data.body.data) {
          console.error('Wrong docker start event', data.body)
          return Promise.reject(new Error('Wrong docker start response'))
        }
        return data.body.data
      })
  },

  /**
   * Load chain details form web api
   */
  get_chain_info() {
    return request
      .get(`${Config.get('webApi')}/chain/${Config.get('stackId')}`)
      .type('json')
      .then((data) => {

        if (!_.isObject(data.body) || data.body.status != 0 || !_.isObject(data.body.details)) {
          return Promise.reject(new Error('Failed to load chain details'))
        }
        return data.body.details
      })
  },

  /**
   * Send notification to stack
   * @param  {String} event
   * @param  {Object} [data={}]
   * @return {Promise}
   */
  notify(event, data = {}) {
    return request
      .post(`${Config.get('webApi')}/stack/notify`)
      .send({
        id: Config.get('stackId'),
        event,
        data
      })
      .type('json')
      .then((data) => {

        if (!_.isObject(data.body) || data.body.status != 0) {
          return Promise.reject(new Error('Failed to get WEB API response'))
        }
        return data.body.details
      })
  },

  /**
   * Notify stack ready
   * @return {Promise}
   */
  notify_ready() {
    return request
      .post(`${Config.get('webApi')}/stack/notify/ready`)
      .send({
        id: Config.get('stackId'),
        stack_name: Config.get('stackName')
      })
      .type('json')
      .then((data) => {

        if (!_.isObject(data.body) || data.body.status != 0) {
          return Promise.reject(new Error('Failed to get WEB API response'))
        }
        return data.body.details
      })
  },

  /**
   * notify stack failed
   * @param  {Object} [data={}]
   * @return {Promise}
   */
  notify_failed(data = {}) {
    return request
      .post(`${Config.get('webApi')}/stack/notify/ready`)
      .send({
        id: Config.get('stackId'),
        stack_name: Config.get('stackName'),
        data
      })
      .type('json')
      .then((data) => {

        if (!_.isObject(data.body) || data.body.status != 0) {
          return Promise.reject(new Error('Failed to get WEB API response'))
        }
        return data.body.details
      })
  }

}

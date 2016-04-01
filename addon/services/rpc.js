import Ember from 'ember';

/**
 * This is a service to allow you to make
 * JSON-RPC 2.0 spec'd calls
 */
export default Ember.Service.extend({

  /**
   * The rpc endpoint to hit
   * @type {String}
   */
  rpcEndpoint: '/api/JsonRPC',

  /**
   * The request type for the rpc call
   * @type {String}
   */
  type: 'POST',

  /**
   * The data type to send along with the request
   * @type {String}
   */
  dataType: 'JSON',

  /**
   * The content type for the request
   * @type {String}
   */
  contentType: 'application/json; charset=utf-8',

  /**
   * The JSON-RPC version default: 2.0
   * @type {String}
   */
  jsonRpcVersion: '2.0',

  /**
   * This function always for easy RPC function calls within the codebase. To
   * use, import the class and just call `RPC.call('Class', 'method', ...params)`.
   *
   * If you wanted to call the function fizzBuzz within the FooBarRemoteAPI
   * class that needs 3 parameters, you would call
   * `RPC.call('FooBar', 'fizzBuzz', param1, param2, param3)`.
   *
   * By default, this method accepts Rest parameters so you don't have to worry
   * about creating an array of parameters before calling the method.
   *
   * @method call
   * @param  {String} name
   * @param  {String} method
   * @param  {Array} params
   * @return {Promise}
   */
  call(name, method, ...params) {
   let payload = this.createPayload(name, method, params);
   return this.makeRequest(payload);
  },

  /**
   * Makes a request and returns it
   *
   * @method makeRequest
   * @param  {Object} payload
   * @return {Ember.RSVP.Promise}
   */
  makeRequest(payload) {
    let strPayload = JSON.stringify(payload);
    let url = this.rpcEndpoint;

    let options = {
      type: this.type,
      url: url,
      dataType: this.dataType,
      contentType: this.contentType,
      data: strPayload
    };

    return new Ember.RSVP.Promise((resolve, reject) => {
      Ember.$.ajax(options)
        .then((response) => {
          return Ember.run(null, resolve, response.result);
        }, (jqXHR) => {
          jqXHR.then = null; // tame jQuery's ill mannered promises
          return Ember.run(null, reject, jqXHR);
        });
    });
  },

  /**
   * Create the payload neded for RPC calls
   *
   * @method createPayload
   * @param  {String} name
   * @param  {String} method
   * @param  {Array} params
   * @return {Object}
   */
  createPayload(name, method, params = []) {
    let payload = {
      id: 0,
      jsonrpc: this.jsonRpcVersion,
      method: `${name}::${method}`,
      params: params
    };

    return payload;
  }
});

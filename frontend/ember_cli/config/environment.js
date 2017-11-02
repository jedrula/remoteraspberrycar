/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'ember-remoteraspberrycar',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      API_SERVER_PROTOCOL: 'http',
      API_WEBSOCKET_PROTOCOL: 'ws',
      API_DOMAIN: 'localhost',
      API_PORT: '3000'
    }
  };

  if (environment === 'development') {
    ENV['ember-cli-mirage'] = {
      enabled: false
    }
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'lan') {
    // TODO make this smarter! read qr code and determine dynamicaly ?
    ENV.APP.API_DOMAIN = 'raspberrypi.local';
    ENV.APP.API_PORT = '3001';
  }

  if (environment === 'production') {
    // ENV.APP.API_HOST = 'http://c88e016b1ddda096c9545e62c8a0a520.resindevice.io';
    ENV.APP.API_DOMAIN = 'jedrula.ddns.net';
    ENV.APP.API_PORT = '7002'; // 7002 goes to my NAS and is reversed proxied to .202 pi
  }


  ENV.APP.API_HOST = `${ENV.APP.API_SERVER_PROTOCOL}://${ENV.APP.API_DOMAIN}:${ENV.APP.API_PORT}`;
  ENV.APP.API_WS_HOST = `${ENV.APP.API_WEBSOCKET_PROTOCOL}://${ENV.APP.API_DOMAIN}:${ENV.APP.API_PORT}`;

  return ENV;
};

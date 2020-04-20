'use strict'

const fs = require('fs')

module.exports = (config) => {
  config.set({
    protocol: 'https:',

    httpsServerOptions: {
      key: fs.readFileSync('server.key'),
      cert: fs.readFileSync('server.cert')
    },

    frameworks: [
      'mocha',
      'should'
    ],

    files: [
      { pattern: 'test/*.spec.js', type: 'module' },
      { pattern: 'lib/*.js', type: 'module', included: false }
    ],

    reporters: ['progress'],

    browsers: [],
    
    singleRun: false
  })
}

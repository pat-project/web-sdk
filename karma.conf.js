'use strict'

const fs = require('fs')

module.exports = (config) => {
  config.set({
    frameworks: [
      'mocha',
      'should'
    ],

    files: [
      { pattern: 'test/*.spec.js', type: 'module' },
      { pattern: 'lib/*.js', type: 'module', included: false }
    ],

    reporters: [ 'coverage-istanbul' ],

    preprocessors: {
      'lib/*.js': [ 'karma-coverage-istanbul-instrumenter' ]
    },

    coverageIstanbulInstrumenter: {
      esModules: true
    },

    coverageIstanbulReporter: {
      reports: [ 'text' ]
    }
  })

  if (process.env.CI) {
    process.env.CHROME_BIN = require('puppeteer').executablePath()

    /**
     * Additional CI config
     */
    config.set({
      browsers: [ 'ChromeHeadless' ],
    
      flags: [
        '--disable-web-security',
        '--disable-gpu',
        '--no-sandbox'
      ],

      singleRun: true
    })
  } else {
    /**
     * Additional local config
     */
    config.set({
      protocol: 'https:',

      httpsServerOptions: {
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.cert')
      },

      singleRun: false
    })
  }
}

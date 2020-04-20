'use strict'

import * as PatSDK from '../lib/sdk.js'

describe('generateKey', () => {
  it('should return a CryptoKey', () => {
    PatSDK.generateKey().should.be.finally.instanceof(CryptoKey)
  })
})


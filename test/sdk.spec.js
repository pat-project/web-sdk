'use strict'

import * as PatSDK from '../lib/sdk.js'

describe('generateKey', () => {
  it('should return a CryptoKey', () => {
    PatSDK.generateKey().should.be.finally.instanceof(CryptoKey)
  })
})

describe('importKey', () => {
  const key = 'N1bkOdncNWI68wZkuc9O21p+RVkaDb3CbmuidicHOKyY4Atd09/50qtkaX0bllzGJj9ZU6XaeAfewXMILeZJcw=='

  it('should return a CryptoKey', () => {
    PatSDK.importKey(key).should.be.finally.instanceof(CryptoKey)
  })
})

describe('exportKey', () => {
  it('should return a String', () => {
    PatSDK.generateKey().then(PatSDK.exportKey).should.be.finally.instanceof(String)
  })
})


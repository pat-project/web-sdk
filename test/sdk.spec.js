'use strict'

import * as PatSDK from '../lib/sdk.js'

let key, sdk

before(() => {
  key = 'N1bkOdncNWI68wZkuc9O21p+RVkaDb3CbmuidicHOKyY4Atd09/50qtkaX0bllzGJj9ZU6XaeAfewXMILeZJcw=='

  return PatSDK.importKey(key).then((_key) => {
    sdk = new PatSDK.PatSDK(_key)
  })
})

describe('generateKey', () => {
  it('should return a CryptoKey', () => {
    PatSDK.generateKey().should.be.finally.instanceof(CryptoKey)
  })
})

describe('importKey', () => {
  it('should return a CryptoKey', () => {
    PatSDK.importKey(key).should.be.finally.instanceof(CryptoKey)
  })
})

describe('exportKey', () => {
  it('should return a String', () => {
    PatSDK.generateKey().then(PatSDK.exportKey).should.be.finally.instanceof(String)
  })
})

describe('PatSDK#createTicket', () => {
  const checks = [
    [1, 324], [2, 748], [3, 127], [4, 946]
  ]

  checks.forEach((check, i) => {
    it(`should return a Number (${i})`, () => {
      return sdk.createTicket(check[0]).should.finally.equal(check[1])
    })
  })
})

describe('PatSDK#recordTicket', () => {
  const checks = [
    [523, '(524)1(499)'           ], [472, '(479)1(44)1(499)'            ],
    [107, '(108)1(370)1(44)1(499)'], [896, '(108)1(370)1(44)1(378)1(120)']
  ]

  checks.forEach((check, i) => {
    it(`should update the filters correctly (${i})`, () => {
      sdk.recordTicket(check[0])
      squashArrayBuffer(sdk.filters[0][1]).should.equal(check[1])
    })
  })
})

/**
 * Squash an `ArrayBuffer` into a RLE (run-length encoded) sort of format.
 * 
 * @param {ArrayBuffer} buf
 *
 * @returns {String}
 */
function squashArrayBuffer(buf) {
  return buf 
    .reduce((a, n) => a + n.toString(2).padStart(8, 0), '')
    .replace(/([0])+/g, (run, char) => `(${run.length})`)
}


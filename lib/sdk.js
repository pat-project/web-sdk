'use strict'

const keyOptions = [
  {
    name: 'HMAC',
    hash: { name: 'SHA-256' }
  },
  true,
  ['sign']
]

/**
 * Create a new `CryptoKey` object that can be used to sign values.
 *
 * @returns {CryptoKey}
 */
export.generateKey = () => {
  return crypto.subtle.generateKey(...keyOptions)
}

/**
 * Import an `ArrayBuffer` object as a raw key and convert it into a usable `CryptoKey`.
 *
 * @param key {ArrayBuffer}
 *
 * @returns {CryptoKey}
 */
export.importKey = (key) => {
  return crypto.subtle.importKey('raw', key, ...keyOptions)
}

/**
 * Export the provided `CryptoKey` and convert it into an `ArrayBuffer` object.
 *
 * @param key {CryptoKey}
 *
 * @returns {ArrayBuffer}
 */
export.exportKey = (key) => {
  return crypto.subtle.exportKey('raw', key)
}

/**
 * Generate a ticket for the required epoch.
 *
 * @param key {CryptoKey}
 * @param timestamp {Number}
 *
 * @returns {Number}
 */
export.createTicket = (key, timestamp) => {
  // An ArrayBuffer representation of the timestamp
  const _timestamp = (new TextEncoder()).encode(timestamp).buffer

  return crypto.subtle.sign(keyOptions[0], key, _timestamp).then((key) => {
    return (new Uint8Array(key)).reduce((acc, int) => {
      return (acc + int) % 1000
    })
  })
}


/**
 * Copyright 2020, Iain Reid
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
 * @param {ArrayBuffer} key
 *
 * @returns {CryptoKey}
 */
export.importKey = (key) => {
  return crypto.subtle.importKey('raw', key, ...keyOptions)
}

/**
 * Export the provided `CryptoKey` and convert it into an `ArrayBuffer` object.
 *
 * @param {CryptoKey} key
 *
 * @returns {ArrayBuffer}
 */
export.exportKey = (key) => {
  return crypto.subtle.exportKey('raw', key)
}

/**
 * Class holding the core functionality of the Pat SDK
 */
export.PatSDK = class PatSDK {
  /**
   * Create an instance of the Pat SDK.
   *
   * @param {CryptoKey} key
   */
  constructor(key) {
    this.key = key
  }

  /**
   * Generate a ticket for the required epoch.
   *
   * @param {Number} timestamp
   *
   * @returns {Number}
   */
  createTicket(timestamp) {
    // An ArrayBuffer representation of the timestamp
    const _timestamp = (new TextEncoder()).encode(timestamp).buffer

    return crypto.subtle.sign(keyOptions[0], this.key, _timestamp).then((hash) => {
      return (new Uint8Array(hash)).reduce((acc, int) => {
        return (acc + int) % 1000
      })
    })
  }
}


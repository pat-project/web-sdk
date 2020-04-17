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


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
 * @returns {Promise<CryptoKey>}
 */
export function generateKey() {
  return crypto.subtle.generateKey(...keyOptions)
}

/**
 * Import an `ArrayBuffer` object as a raw key and convert it into a usable `CryptoKey`.
 *
 * @param {String} key
 *
 * @returns {Promise<CryptoKey>}
 */
export function importKey(key) {
  return crypto.subtle.importKey('raw', decodeArrayBuffer(key), ...keyOptions)
}

/**
 * Export the provided `CryptoKey` and convert it into an `ArrayBuffer` object.
 *
 * @param {CryptoKey} key
 *
 * @returns {Promise<String>}
 */
export function exportKey(key) {
  return crypto.subtle.exportKey('raw', key).then(encodeArrayBuffer)
}

/**
 * Class holding the core functionality of the Pat SDK
 */
export class PatSDK {
  /**
   * Create an instance of the Pat SDK.
   *
   * @param {CryptoKey} key
   * @param {DataStore} store
   */
  constructor(key, store) {
    this.key = key
    this.store = store

    // Initialise the filters array
    this.filters = [createFilter()]
  }

  /**
   * Generate a ticket for the required epoch.
   *
   * @param {Number} timestamp
   *
   * @returns {Promise<Number>}
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

  /**
   * Record a ticket in the currently active filter.
   *
   * @param {Number} ticket
   *
   * @returns {None}
   */
  recordTicket(ticket) {
    // Retrieve the currently active filter
    const filter = this.filters[0]

    // Calculate the index that this ticket should reside in
    const index = Math.floor(ticket / 8)

    // Calculate the remaining ticket offset
    const offset = ticket % 8

    // Set the offest bit at the correct index
    filter[1][index] |= 1 << offset

    // Bump the current filter size
    filter[2]++

    // If the current filter size has reached it's limit, make a new one
    if (filter[2] === 10) {
      this.filters.unshift(createFilter())
    }
  }

  /**
   * Save any saturated filters and purge them from memory.
   *
   * @returns {Promise<None>}
   */
  pruneFilters() {
    return Promise.all(this.filters.slice(1).map(([timestamp, filter, size]) => {
      // If the filter contains no tickets, skip it
      if (size === 0) {
        return Promise.resolve()
      }

      return this.store.setItem(timestamp, filter)
    })).then(() => {
      this.filters.splice(1)
    })
  }

  /**
   * Save any open filters and purge them from memory.
   *
   * @returns {Promise<None>}
   */
  closeFilters() {
    return Promise.all(this.filters.map(([timestamp, filter, size]) => {
      // If the filter contains no tickets, skip it
      if (size === 0) {
        return Promise.resolve()
      }

      return this.store.setItem(timestamp, filter)
    })).then(() => {
      this.filters = []
    })
  }
}

/**
 * An abstract implementation of the required data storage API.
 *
 * @abstract
 */
export class DataStore {
  constructor() {
    if (new.target === DataStore) {
      throw new TypeError('DataStore is abstract and must be extended')
    }
  }

  /**
   * List all of the keys currently in the delegate storage provider.
   *
   * @returns {Promise<String>}
   */
  getKeys() {
    throw new TypeError('"getKeys" must be implemented by the extending class')
  }

  /**
   * Store the `value` alongside the given `key` inside the delegate storage provider.
   *
   * @param {String} key
   * @param {String} value
   *
   * @returns {Promise<None>}
   */
  setItem(key, value) {
    throw new TypeError('"setItem" must be implemented by the extending class')
  }

  /**
   * Retrieve the data assigned to the given `key` from the delegate storage provider.
   *
   * @param {String} key
   *
   * @returns {Promise<String>}
   */
  getItem(key) {
    throw new TypeError('"getItem" must be implemented by the extending class')
  }

  /**
   * Remove the data at the `key` provided from the delegate storage provider.
   *
   * @param {String} key
   *
   * @returns {Promise<None>}
   */
  removeItem(key) {
    throw new TypeError('"removeItem" must be implemented by the extending class')
  }
}

/**
 * Encode an `ArrayBuffer` as a `String`.
 *
 * @param {ArrayBuffer} key
 *
 * @returns {String}
 */
function encodeArrayBuffer(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
}

/**
 * Decode an `ArrayBuffer` from a `String`.
 *
 * @param {String} str
 *
 * @returns {ArrayBuffer}
 */
function decodeArrayBuffer(str) {
  return Uint8Array.from(atob(str), _ => _.charCodeAt(0))
}

/**
 * Create a new empty filter.
 *
 * @private
 *
 * @returns {Array}
 */
function createFilter() {
  return [ Date.now().toString(), new Uint8Array(128), 0 ]
}

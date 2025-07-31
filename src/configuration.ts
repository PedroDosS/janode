/**
 * This module contains the Configuration class definition.
 * @module configuration
 * @private
 */

import type { ClientOptions } from "ws";
import type { RawConfiguration, ServerObjectConf } from "./janode.ts";

const DEF_RETRY_TIME = 10;
const DEF_MAX_RETRIES = 5;

/**
 * Class representing a Janode configuration.
 * The purpose of the class is basically filtering the input config and distinguish Janus API and Admin API connections.
 */
class Configuration {
  private address: ServerObjectConf[]
  private retry_time_secs: number;
  private max_retries: number;
  private is_admin: boolean;
  private ws_options: ClientOptions | null;

  /**
   * Create a configuration.
   *
   * @private
   * @param {RawConfiguration} config
   */
  constructor({ address, retry_time_secs, max_retries, is_admin, ws_options }: RawConfiguration) {
    if (!address)
      throw new Error('invalid configuration, missing parameter "address"');
    if (Array.isArray(address) && address.length === 0)
      throw new Error('invalid configuration, empty parameter "address"');
    this.address = Array.isArray(address) ? address : [address];
    for (const server of this.address) {
      if (typeof server !== 'object' || !server)
        throw new Error('invalid configuration, every element of address attribute must be an object');
      if (typeof server.url !== 'string' || !server.url)
        throw new Error('invalid configuration, missing server url attribute ');
    }

    this.retry_time_secs = (typeof retry_time_secs === 'number') ? retry_time_secs : DEF_RETRY_TIME;
    this.max_retries = (typeof max_retries === 'number') ? max_retries : DEF_MAX_RETRIES;
    this.is_admin = (typeof is_admin === 'boolean') ? is_admin : false;
    this.ws_options = (typeof ws_options === 'object') ? ws_options : null;
  }

  /**
   * Get the server list of this configuration.
   *
   * @returns The address array
   */
  getAddress(): ServerObjectConf[] {
    return this.address;
  }

  /**
   * Get the number of seconds between any attempt.
   *
   * @returns The value of the property
   */
  getRetryTimeSeconds(): number {
    return this.retry_time_secs;
  }

  /**
   * Get the max number of retries.
   *
   * @returns The value of the property
   */
  getMaxRetries(): number {
    return this.max_retries;
  }

  /**
   * Check if the configuration is for an admin connection.
   *
   * @returns True if the configuration will be used for an admin connection
   */
  isAdmin(): boolean {
    return this.is_admin;
  }

  /**
   * Return the specific WebSocket transport options.
   */
  wsOptions(): ClientOptions | null {
    return this.ws_options;
  }
}

export default Configuration;

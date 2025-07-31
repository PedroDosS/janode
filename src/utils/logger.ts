/**
 * The logging module used in janode.<br>
 *
 * The level of logging on the stdout can be set through the CLI argument "--janode-log={debug|verb|info|warn|error|none}"".<br>
 *
 * Default logging level is "info".
 * @module logger
 * @private
 */

import { getCliArgument } from './utils.ts';

type LoggerLevel = 'none' | 'error' | 'warning' | 'info' | 'verbose' | 'debug'
const LEVELS: LoggerLevel[] = ['none', 'error', 'warning', 'info', 'verbose', 'debug'];
const LEVELS_IDX = Object.fromEntries(LEVELS.map((lvl, index) => [lvl, index]))

const DEFAULT_LEVEL = 'info';

/**
 * Class representing a Janode logger.<br>
 *
 * Users are not expected to create Logger instances, but insted use the Janode.Logger instance.<br>
 *
 * @hideconstructor
 */
class Logger {
  _log_verbosity: LoggerLevel;
  constructor(lvl: string = DEFAULT_LEVEL) {
    /**
     * The current verbosity level of the logger.
     * @type {LoggerLevel}
     * @private
     */
    this._log_verbosity = this.setLevel(lvl);
  }

  /**
   * @private
   */
  _printout(msg_verbosity: string, console_fn: (...data: any[]) => void, ...args: any[]): void {
    if (LEVELS_IDX[msg_verbosity] > LEVELS_IDX[this._log_verbosity]) return;
    const ts = (new Date()).toISOString();
    const prefix = `${ts} - ${msg_verbosity.toUpperCase().padEnd(8, ' ')}:`;
    if (args.length === 1 && typeof args[0] === 'function') {
      const msg = (args[0])();
      console_fn(prefix, msg);
    }
    else
      console_fn(prefix, ...args);
  }

  /**
   * Debug logging.
   * It is a wrapper for `console.debug()`.
   *
   * @function
   * @param args
   */
  debug(...args: any[]): void {
    this._printout('debug', console.debug, ...args);
  }

  /**
   * Verbose logging.
   * It is a wrapper for `console.debug()`.
   *
   * @function
   * @param args
   */
  verbose(...args: any[]): void {
    this._printout('verbose', console.debug, ...args);
  }

  /**
   * Alias for verbose.
   *
   * @function
   * @param args
   */
  verb(...args: any[]): void {
    this.verbose(...args);
  }

  /**
   * Info logging (default).
   * It is a wrapper for `console.info()`.
   *
   * @function
   * @param args
   */
  info(...args: any[]): void {
    this._printout('info', console.info, ...args);
  }

  /**
   * Warning logging.
   * It is a wrapper for `console.warn()`.
   *
   * @function
   * @param args
   */
  warning(...args: any[]) {
    this._printout('warning', console.warn, ...args);
  }

  /**
   * Alias for warning.
   *
   * @function
   * @param args
   */
  warn(...args: any[]) {
    this.warning(...args);
  }

  /**
   * Error logging.
   * It is a wrapper for `console.error()`.
   *
   * @function
   * @param args
   */
  error(...args: any[]) {
    this._printout('error', console.error, ...args);
  }

  /**
   * Set level of logger.
   *
   * @function
   * @param lvl
   * @returns The current level
   */
  setLevel(lvl: string = ''): LoggerLevel {
    lvl = lvl.toLowerCase() as LoggerLevel | 'verb' | 'warn';
    if (lvl === 'verb') lvl = 'verbose';
    if (lvl === 'warn') lvl = 'warning';
    if (typeof LEVELS_IDX[lvl] === 'number') {
      this._log_verbosity = (lvl as LoggerLevel);
    }
    else {
      this._log_verbosity = DEFAULT_LEVEL;
    }
    return this._log_verbosity;
  }

  /**
   * Alias for setLevel.
   *
   * @function
   * @param lvl
   * @returns The current level
   */
  setLogLevel(lvl: string = ''): LoggerLevel {
    return this.setLevel(lvl);
  }
}

const cli_log_verbosity = getCliArgument<string>('janode-log', 'string', DEFAULT_LEVEL);
const loggerInstance = new Logger(cli_log_verbosity);

export default loggerInstance;
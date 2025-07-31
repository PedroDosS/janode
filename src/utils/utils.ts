/**
 * An utility module containing helper methods.
 * @module utils
 * @private
 */

/**
 * Generate a random alpha-numeric string with a given length.
 *
 * @param [len=12] - The length of the string
 * @returns A random alpha-numeric string
 *
 */
export const randomString = (len: number = 12) => {
  const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';
  for (let i = 0; i < len; i++) {
    let randomPoz = Math.floor(Math.random() * charSet.length);
    randomString += charSet.substring(randomPoz, randomPoz + 1);
  }
  return randomString;
};

/**
 * Return (and increment) the value of a counter, starting from a random seed.
 * The counter starts from 0 after reaching Number.MAX_SAFE_INTEGER.
 *
 * @returns {string} A numeric string
 */
export const getNumericID = (() => {
  let now;
  let next = Math.floor(Number.MAX_SAFE_INTEGER * Math.random());

  return () => {
    now = next;
    next = next + 1;
    if (next >= Number.MAX_SAFE_INTEGER) next = 0;
    return '' + now;
  };
})();

/**
 * @property nextElem - Advance the iterator and get the new element
 * @property currElem - Get the current element without advancing
 */
export type CircularIterator<T> = {
  nextElem: () => T,
  currElem: () => T
}

/**
 * Generate a circular iterator from an array.
 *
 * @param list - The array that must be iterated
 * @returns The generated iterator
 */
export const newIterator = <T>(list: T[]) => {
  const l = Array.from(list);
  const len = l.length;
  var i = 0;

  const iterator: CircularIterator<T> = {
    nextElem: () => l[i++ % len],
    currElem: () => l[i % len],
  };

  return iterator;
};

/**
 * Return a promise that will resolve after a given amount of milliseconds.
 *
 * @param ms - The amount of millis to wait before resolving
 * @returns A promise that will resolve after a certain time
 */
export const delayOp = (ms: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
};

/**
 * Check if a url string contains one of the protocols in a white list.
 *
 * @param url_string - The url string to be checked
 * @param admitted - The admitted protocols
 * @returns True if the check succeeds
 */
export const checkUrl = (url_string: string, admitted: string[]) => {
  try {
    /* 'slice(0, -1)' removes the colon at the last position */
    const protocol = (new URL(url_string)).protocol.slice(0, -1);
    return admitted.includes(protocol);
  } catch (_error) { }
  return false;
};

type CLIArgType = string | number | boolean
/**
 * Get a CLI argument.
 *
 * @param arg_name - The argument name
 * @param arg_type - The argument type
 * @param arg_default - An optional default value if missing
 * @returns
 */
export const getCliArgument = <T extends CLIArgType>(arg_name: string, arg_type: "string" | "number" | "boolean", arg_default?: T): T | undefined => {
  if (typeof process === 'undefined' || !Array.isArray(process.argv) || process.argv.length < 2) return arg_default;
  const args = process.argv.slice(2);
  let arg_val = undefined;
  for (const param of args) {
    /* --arg */
    if (param === `--${arg_name}`) {
      if (arg_type === 'boolean') arg_val = true;
    }
    /* --arg=value */
    else if (param.startsWith(`--${arg_name}=`)) {
      arg_val = param.split('=').length > 1 ? param.split('=')[1] : arg_val;
      if (arg_val) {
        if (arg_type === 'boolean') {
          if ((arg_val as string).toLowerCase() === 'false') arg_val = false;
          else if ((arg_val as string).toLowerCase() === 'true') arg_val = true;
          if (typeof arg_val !== 'boolean') arg_val = undefined;
        }
        if (arg_type === 'number') {
          arg_val = parseInt((arg_val as string));
          if (!Number.isInteger(arg_val)) arg_val = undefined;
        }
      }
    }
  }
  arg_val = typeof arg_val !== 'undefined' ? arg_val : arg_default;
  return (arg_val as T);
};
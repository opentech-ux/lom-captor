/**
 * @description Function to obtain the value of a specific parameter in query of a given url.
 * @param {string} name Name of the parameter to search in the query of the given url.
 * @param {string} url URL containing the query where to look for the parameter.
 * @returns {string | null} If found, the value of the specified parameter is returned. Otherwise null is returned.
 */
export const getParameterByName = (name, url) => {
   const realUrl = url ?? window.location.href;
   const realName = name.replace(/[\\[\]]/g, '\\$&');
   const regex = new RegExp(`[?&]${realName}(=([^&#]*)|&|#|$)`);
   const results = regex.exec(realUrl);
   if (!results) return null;
   if (!results[2]) return '';
   return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

/**
 * @description Function to check if a string contains any numerical value.
 * @param {string} string The string of characters to be checked.
 * @returns {boolean} A confirmation of the result is returned.
 */
export const hasNumber = (string) => /\d/.test(string);

/**
 * @description Instance of the console.
 */
export const uxkeyConsole = window.console;

/**
 * @description Function to verify if a given number is within the range of two other numbers.
 * @param {*} number Number to compare.
 * @param {*} limitA First limit.
 * @param {*} limitB Last limit.
 */
export const isBetween = (number, limitA, limitB) => (number - limitA) * (number - limitB) <= 0;

/**
 * @description Each section (delimited by a slash "/") of the hash or path is checked for any alphanumeric character.
 * If found, it is replaced by the text: "{paremeter}".
 * @param {string} urlExtension Extension of the URL where the page is identified.
 * @returns {string} The same extension of the URL but with the identification parameters replaced by the text: "{parameter}".
 *
 * @see {@link https://cutt.ly/case-001} for further information.
 */

export const checkUrlParameters = (urlExtension) =>
   urlExtension
      .split('/')
      .map((part) => (hasNumber(part) ? '{parameter}' : part))
      .join('/');

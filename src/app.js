/* eslint-disable import/prefer-default-export */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import initScript from './modules/init';
import { getParameterByName } from './modules/tools';

/**
 * @description Object to specify the time of the page states.
 * @type {Record<string, number>}
 */
const loadingTime = { loading: 0 };
/**
 * @description Chronological value of the time when the script is executed.
 */
const startTime = Date.now();
/**
 * @description List of the "script" tags in the HTML document.
 */
const scripts = document.getElementsByTagName('script');
/**
 * @description Finds the current script tag.
 * @param {HTMLScriptElement} el
 */
const findCurrentScript = (el) => el.src.indexOf('ux-key-lib.js') >= 0;
/**
 * @description Value of the "src" attribute of the last script (usually the execution script) in the list of scripts
 * @type {HTMLScriptElement}
 */
const currentScript = Array.prototype.filter.call(scripts, findCurrentScript)[0];
/**
 * @description UX-Key user API key obtained through the script url.
 * @type {string | null}
 */
const urlApiKey = getParameterByName('apiKey', currentScript.src);
/**
 * @description Function to manually start UX-Key script monitoring operation.
 * @param {string | null} apiKey UX-Key User API Key.
 */
export const start = (apiKey = null) => initScript(apiKey, loadingTime);

document.onreadystatechange = async () => {
   loadingTime[document.readyState] = Date.now() - startTime;
   if (document.readyState === 'complete' && urlApiKey) initScript(urlApiKey, loadingTime);
};

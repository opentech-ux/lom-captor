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
 * @description URL where to send the JSON result
 * @type {string | null}
 */
const urlEndpoint = getParameterByName('endpoint', currentScript.src);

/**
 * @description Configuration object
 * @type {import('../types/ScriptConfig').ScriptConfig}
 */
const urlConfig = { apiKey: urlApiKey, endpoint: urlEndpoint };

/**
 * @description Function to manually start UX-Key script monitoring operation.
 * @param {import('../../types/ScriptConfig').ScriptConfig} config Configuration for the script init.
 */
export const start = (config) => initScript(config, loadingTime);

document.onreadystatechange = async () => {
   loadingTime[document.readyState] = Date.now() - startTime;
   if (document.readyState === 'complete' && urlApiKey) initScript(urlConfig, loadingTime);
};

/* eslint-disable import/prefer-default-export */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import initScript from './modules/init';

/**
 * @description List of the "script" tags in the HTML document.
 */
const scripts = document.getElementsByTagName('script');

/**
 * @description Value of the "src" attribute of the last script (usually the execution script) in the list of scripts
 * @type {HTMLScriptElement}
 */
const currentScript = document.currentScript;

/**
 * @description URL where to send the JSON result
 * @type {string | null}
 */
const urlEndpoint = currentScript.dataset.endpoint;

/**
 * @description Configuration object
 * @type {ScriptConfiguration}
 */
const urlConfig = { endpoint: urlEndpoint };

/**
 * @description Function to manually start UX-Key script monitoring operation.
 * @param {ScriptConfiguration} config Configuration for the script init.
 */
export const start = (config) => initScript(config);

document.onreadystatechange = async () => {
   if (document.readyState === 'complete') initScript(urlConfig);
};

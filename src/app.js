/* eslint-disable prefer-destructuring */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { initScript } from './modules/init';

/**
 * @description Script where this code is being executed.
 * @type {HTMLOrSVGScriptElement}
 */
const currentScript = document.currentScript;

/**
 * @description Configuration for the script init.
 * @type {import('../types/ScriptConfiguration').ScriptConfiguration}
 */
const urlConfig = {
   customAttribute: currentScript.dataset.customAttribute,
   endpoint: currentScript.dataset.endpoint,
};

/**
 * @description Function to manually start UX-Key script monitoring operation.
 *
 * @param {import('../types/ScriptConfiguration').ScriptConfiguration} config Configuration for the script init.
 */
export const start = (config) => initScript(config);

document.onreadystatechange = async () => {
   if (document.readyState === 'complete') initScript(urlConfig);
};

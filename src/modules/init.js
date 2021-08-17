import consola from 'consola';
import { setSession } from './api';
import setEventHandlers, { setLoms } from './events';
import { identifyElements } from './tools';

/**
 * @description Initialises the script to start the data obtention.
 *
 * @param {ScriptConfiguration} config Configuration for the script init.
 */
const initScript = (config) => {
   consola.log(config.endpoint);
   identifyElements(document.body);
   setSession();
   setLoms();
   setEventHandlers();
   consola.ready('Ready');
};

export default initScript;

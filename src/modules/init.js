/* eslint-disable import/prefer-default-export */
import consola from 'consola';
import { setSession } from './api';
import { setEventHandlers, setLoms } from './events';
import { identifyElements } from './tools';

/**
 * @description Initialises the script to start the data obtention.
 *
 * @param {import('../../types/ScriptConfiguration').ScriptConfiguration} scriptConfig Configuration for the script init.
 */
export const initScript = (scriptConfig) => {
   if (scriptConfig.endpoint) {
      identifyElements(document.body);
      setSession();
      setLoms(scriptConfig);
      setEventHandlers();
      consola.ready('Ready');
   }
};

import consola from 'consola';
import { isBetween, secureLocalStorage } from './tools';

/**
 * @description Common configuration of the fetch function.
 *
 * @type {RequestInit}
 */
const commonConfig = {
   mode: 'cors',
   cache: 'no-cache',
   credentials: 'same-origin',
   headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
   },
   redirect: 'follow',
   referrerPolicy: 'no-referrer',
};

/**
 * @description Performs an HTTP POST method and create a new record in the database.
 *
 * @param {string} endpoint API endpoint to perform the HTTP method.
 * @param {Record<string, unknown>} body Information related to the method to be performed.
 *
 * @returns {Promise<Record<string, unknown>>} The result of the action requested.
 */
const POST = (endpoint, body) =>
   new Promise((resolve, reject) => {
      fetch(`${endpoint}`, {
         ...commonConfig,
         method: 'POST',
         body: JSON.stringify(body),
      })
         .then(async (response) => {
            const data = await response.json().then((responseData) => responseData);
            if (isBetween(response.status, 199, 300) && response.ok) resolve(data);
            else reject(data);
         })
         .catch((error) => reject(Error(`Fetch Error :-S ${error}`)));
   });

/**
 * @description Sends the session data to the user-defined endpoint.
 *
 * @param {import('../../types/ScriptConfiguration').ScriptConfiguration} scriptConfig
 */
export const sendData = async (scriptConfig) => {
   // const sessionData = JSON.parse(localStorage.getItem('sessionData'));
   const sessionData = secureLocalStorage.get('sessionData');
   let dataToSend = sessionData;

   if (scriptConfig.customAttribute) dataToSend = { [scriptConfig.customAttribute]: sessionData };

   await POST(scriptConfig.endpoint, dataToSend).catch((e) => consola.error(e));
};

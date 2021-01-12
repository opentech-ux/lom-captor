import { isBetween } from './tools';
/**
 * @description Base API URL for performing HTTP actions.
 * @type {string}
 */
const baseURL = 'https://api.ux-key.com/';
/**
 * @description Common configuration of the fetch function.
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
 * @description Function to perform an HTTP GET method and obtain information from the API.
 * @param {string} endpoint API endpoint to perform the HTTP method.
 * @returns {Promise<Record<string, unknown>>} The information requested.
 */
export const GET = (endpoint) =>
   new Promise((resolve, reject) => {
      fetch(`${baseURL}${endpoint}`, { ...commonConfig, method: 'GET' })
         .then(async (response) => {
            const data = await response.json().then((responseData) => responseData);
            if (isBetween(response.status, 199, 300) && response.ok) resolve(data);
            else reject(data);
         })
         .catch((error) => reject(Error(`Fetch Error :-S ${error}`)));
   });
/**
 * @description Function to perform an HTTP POST method and create a new record in the database.
 * @param {string} endpoint API endpoint to perform the HTTP method.
 * @param {Record<string, unknown>} body Information related to the method to be performed.
 * @returns {Promise<Record<string, unknown>>} The result of the action requested.
 */
export const POST = (endpoint, body) =>
   new Promise((resolve, reject) => {
      fetch(`${baseURL}${endpoint}`, {
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
 * @description Function to perform an HTTP PATCH method and update a record in the database.
 * @param {string} endpoint API endpoint to perform the HTTP method.
 * @param {Record<string, unknown>} body Information related to the method to be performed.
 * @returns {Promise<Record<string, unknown>>} The result of the action requested.
 */
export const PATCH = (endpoint, body) =>
   new Promise((resolve, reject) => {
      fetch(`${baseURL}${endpoint}`, {
         ...commonConfig,
         method: 'PATCH',
         body: JSON.stringify(body),
      })
         .then(async (response) => {
            const data = await response.json().then((responseData) => responseData);
            if (isBetween(response.status, 199, 300) && response.ok) resolve(data);
            else reject(data);
         })
         .catch((error) => reject(Error(`Fetch Error :-S ${error}`)));
   });

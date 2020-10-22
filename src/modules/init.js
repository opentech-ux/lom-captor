import { getUser, setPage, setSite } from './api';
import { uxkeyConsole } from './tools';
/**
 * @description Function that initiates the operation of the script by setting the information obtained.
 * @param {string} apiKey UX-Key User API Key.
 */
const initScript = async (apiKey) => {
   const userInfo = await getUser(apiKey);
   const siteInfo = await setSite(userInfo);
   const pageInfo = await setPage(siteInfo);
   uxkeyConsole.log(pageInfo);
};

export default initScript;

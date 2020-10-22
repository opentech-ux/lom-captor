import { getUser, setSite } from './api';
/**
 * @description Function that initiates the operation of the script by setting the information obtained.
 * @param {string} apiKey UX-Key User API Key.
 */
const initScript = async (apiKey) => {
   const userInfo = await getUser(apiKey);
   const siteInfo = await setSite(userInfo);
   console.log(siteInfo);
};

export default initScript;

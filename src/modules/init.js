import { getUser, setPage, setSite, setVisitor } from './api';
import { uxkeyConsole } from './tools';
/**
 * @description Function that initiates the operation of the script by setting the information obtained.
 * @param {string} apiKey UX-Key User API Key.
 * @param {Record<string, number>} loadingTimeObject UX-Key User API Key.
 */
const initScript = async (apiKey, loadingTimeObject) => {
   const userInfo = await getUser(apiKey);
   const siteInfo = await setSite(userInfo);
   const pageInfo = await setPage(siteInfo);
   const visitorId = await setVisitor(pageInfo._id, siteInfo._id);
   uxkeyConsole.log(visitorId);
   uxkeyConsole.log(loadingTimeObject);
};

export default initScript;

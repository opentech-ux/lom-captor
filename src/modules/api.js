import { GET, POST } from './http';

const pageHost = window.location.host;
const pageHash = window.location.hash;
const pagePath = window.location.pathname;
const isHash = !!pageHash;
/**
 * @description Function to obtain information from the user.
 * @param {string} apiKey UX-Key User API Key.
 * @returns {Promise<import('../../types/UserAPIKeyResponse').UserAPIKeyResponse>} API response about the user obtained.
 */
export const getUser = (apiKey) =>
   GET(`users/apikey/${apiKey}`)
      .then((resp) => resp)
      .catch((err) => err);
/**
 * @description Function to obtain the list of sites of a user.
 * @param {import('../../types/UserAPIKeyResponse').UserAPIKeyResponse} userInfo API response about the user obtained.
 * @returns {Promise<import('../../types/SitesResponse').SitesResponse>} API response of the sites.
 */
export const getSites = (userInfo) =>
   GET(`sites?where=user:=:${userInfo.data._id}`)
      .then((resp) => resp)
      .catch((err) => err);
/**
 * @description Function to create a record in the API sites.
 * @param {import('../../types/SiteInfo').SiteInfo} siteData New site information.
 * @returns {Promise<import('../../types/SiteResponse').SiteResponse>} API response of the new site.
 */
export const createSite = (siteData) =>
   POST('sites', siteData)
      .then((resp) => resp)
      .catch((err) => err);
/**
 * @description Function to verify the status of a site with the current site characteristics.
 * @param {import('../../types/UserAPIKeyResponse').UserAPIKeyResponse} userInfo API response about the user obtained.
 * @returns {Promise<import('../../types/SiteInfo').SiteInfo>} Information on the site found or created.
 */
export const setSite = async (userInfo) => {
   const sitesResp = await getSites(userInfo);
   const siteInList = sitesResp.data.sites.find((site) => site.fields.host === pageHost);
   if (siteInList) return siteInList;
   const siteData = { fields: { host: pageHost }, user: userInfo.data._id };
   const siteInfo = await createSite(siteData);
   return siteInfo.data;
};

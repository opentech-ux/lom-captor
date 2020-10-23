import { GET, POST } from './http';
import { hasNumber } from './tools';

/**
 * @description URL's host and port (if different from the default port for the scheme).
 */
const pageHost = window.location.host;

/**
 * @description URL's fragment (includes leading "#" if non-empty).
 */
const pageHash = window.location.hash;

/**
 * @description URL's path.
 */
const pagePath = window.location.pathname;

/**
 * @description Verifier of hash status.
 */
const isHashed = !!pageHash.replace(/\/+$/, '');

/**
 * @description Function to obtain information from the user.
 * @param {string} apiKey UX-Key User API Key.
 * @returns {Promise<import('../../types/UserResponse').UserResponse>} API response about the user obtained.
 */
export const getUser = (apiKey) =>
   GET(`users/apikey/${apiKey}`)
      .then((resp) => resp)
      .catch((err) => err);

/**
 * @description Function to obtain the list of sites of a user.
 * @param {import('../../types/UserResponse').UserResponse} userInfo API response about the user obtained.
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
 * @param {import('../../types/UserResponse').UserResponse} userInfo API response about the user obtained.
 * @returns {Promise<import('../../types/SiteInfo').SiteInfo>} Information on the site (found or created).
 */
export const setSite = async (userInfo) => {
   const sitesResp = await getSites(userInfo);
   const siteInList = sitesResp.data.sites.find((site) => site.fields.host === pageHost);
   if (siteInList) return siteInList;
   const siteInfo = await createSite({ fields: { host: pageHost }, user: userInfo.data._id });
   return siteInfo.data;
};

/**
 * @description Function to obtain the list of the pages from a site.
 * @param {import('../../types/SiteInfo').SiteInfo} siteInfo API response about the site obtained.
 * @returns {Promise<import('../../types/PagesResponse').PagesResponse>} API response of the pages.
 */
export const getPages = (siteInfo) =>
   GET(`pages?where=site:=:${siteInfo._id}`)
      .then((resp) => resp)
      .catch((err) => err);

/**
 * @description Function to create a record in the API pages.
 * @param {import('../../types/PageInfo').PageInfo} pageData New page information.
 * @returns {Promise<import('../../types/PageResponse').PageResponse>} API response of the new page.
 */
export const createPage = (pageData) =>
   POST('pages', pageData)
      .then((resp) => resp)
      .catch((err) => err);

/**
 * @description Function to verify the status of a page with the current page characteristics.
 * @param {import('../../types/SiteInfo').SiteInfo} siteInfo API response about the site obtained.
 * @returns {Promise<import('../../types/PageInfo').PageInfo>} Information on the page (found or created).
 */
export const setPage = async (siteInfo) => {
   /**
    * @description Final version of [pagePath] to send to the database.
    */
   let truePath = null;
   /**
    * @description Final version of [pageHash] to send to the database.
    */
   let trueHash = null;

   pagePath.split('/').forEach((part) => {
      truePath = hasNumber(part) ? pagePath.replace(part, '{parameter}') : pagePath;
   });

   pageHash.split('/').forEach((part) => {
      trueHash = hasNumber(part) ? pageHash.replace(part, '{parameter}') : pageHash;
   });

   const pageResp = await getPages(siteInfo);
   const pageInList = pageResp.data.pages.find((page) => {
      if (isHashed) return page.fields.hash === trueHash || page.fields.hash === `${trueHash}/`;
      return page.fields.path === truePath || page.fields.path === `${truePath}/`;
   });
   if (pageInList) return pageInList;
   const pageInfo = await createPage({
      fields: { hash: trueHash === '' ? null : trueHash, path: truePath === '' ? null : truePath },
      site: siteInfo._id,
   });
   return pageInfo.data;
};

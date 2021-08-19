/* eslint-disable no-param-reassign */
import { sendData } from './http';
import { generateDomTree, getPageName } from './tools';

/**
 *
 *
 * @param {MouseEvent} event
 */
const saveLastMouseDown = (event) =>
   localStorage.setItem('pageChangeElementID', event.target.dataset.uxId ?? null);

/**
 *
 *
 * @param {LOM} lomObject
 * @param {string} linkPageName
 * @param {string} pageChangeElementID
 */
const addLinkToElement = (lomObject, linkPageName, pageChangeElementID) => {
   const { uxId, children } = lomObject;
   const isElementFound = uxId && uxId === pageChangeElementID;

   if (isElementFound) {
      lomObject.link = linkPageName;
      lomObject.style = {
         background: '#5F9EA0',
         border: '2px solid #00008B',
      };
   } else if (children.length > 0) {
      children.forEach((lomChild) => addLinkToElement(lomChild, linkPageName, pageChangeElementID));
   }
};

/**
 *
 *
 * @param {ScriptConfiguration} scriptConfig
 */
export const setLoms = (scriptConfig) => {
   const currentLom = generateDomTree(document.body);
   const previousLom = JSON.parse(localStorage.getItem('previousLom'));
   const sessionData = JSON.parse(localStorage.getItem('sessionData'));
   const pageName = getPageName();

   if (previousLom) {
      const previousPageName = localStorage.getItem('previousPageName');
      const pageChangeElementID = localStorage.getItem('pageChangeElementID');
      addLinkToElement(previousLom, pageName, pageChangeElementID);
      sessionData.loms[previousPageName] = previousLom;
      localStorage.setItem('sessionData', JSON.stringify(sessionData));
      sendData(scriptConfig);
   }

   localStorage.setItem('previousPageName', pageName);
   localStorage.setItem('previousLom', JSON.stringify(currentLom));
};

/**
 * @description Management function for events to be monitored.
 */
export const setEventHandlers = () => {
   document.body.addEventListener('mousedown', (event) => saveLastMouseDown(event), false);
};

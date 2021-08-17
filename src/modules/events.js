/* eslint-disable no-param-reassign */
import { generateDomTree, getPageName } from './tools';

/**
 *
 *
 * @param {MouseEvent} event
 */
const saveLastMouseDown = (event) =>
   localStorage.setItem('pageChangeElementID', event.target.dataset.uxId ?? null);

const addLinkToElement = (lomObject, linkPageName, pageChangeElementID) => {
   const { uxId, children } = lomObject;
   const isElementFound = uxId && uxId === pageChangeElementID;

   if (isElementFound) {
      lomObject.link = linkPageName;
   } else if (children.length > 0) {
      children.forEach((lomChild) => addLinkToElement(lomChild, linkPageName, pageChangeElementID));
   }
};

const setLoms = () => {
   const currentLom = generateDomTree(document.body);
   const previousLom = JSON.parse(localStorage.getItem('previousLom'));
   const sessionData = JSON.parse(localStorage.getItem('sessionData'));
   const pageName = getPageName();

   if (previousLom) {
      const previousPageName = localStorage.getItem('previousPageName');
      const pageChangeElementID = localStorage.getItem('pageChangeElementID');
      addLinkToElement(previousLom, pageName, pageChangeElementID);
      sessionData.loms[previousPageName] = previousLom;
   }

   localStorage.setItem('previousPageName', pageName);
   localStorage.setItem('previousLom', JSON.stringify(currentLom));
};

/**
 * @description Management function for events to be monitored.
 *
 * @param {import('../../types/SessionRequestInfo').SessionRequestInfo} sessionInfo Session information obtained or created previously.
 * @param {string} visitorId ID obtained from the current visitor.
 * @param {import('../../types/PageInfo').PageInfo} pageInfo Page information obtained or created previously.
 */
const setEventHandlers = () => {
   document.body.addEventListener('load', () => setLoms(), false);

   document.body.addEventListener('mousedown', (event) => saveLastMouseDown(event), false);
};

export default setEventHandlers;

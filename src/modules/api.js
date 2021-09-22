import { DateTime, Duration } from 'luxon';
import { v4 as uuidv4 } from 'uuid';
import { secureLocalStorage } from './tools';

/**
 * @description Manages the session refresh and session id creation at the defined moment to make it.
 *
 * @returns {string} The session ID.
 */
const setSessionId = () => {
   // let sessionId = localStorage.getItem('sessionId');
   let sessionId = secureLocalStorage.get('sessionId');
   // let sessionDate = Number(localStorage.getItem('sessionDate'));
   let sessionDate = Number(secureLocalStorage.get('sessionDate'));
   const currentDate = DateTime.now().toMillis();
   const datesDuration = Duration.fromMillis(currentDate - sessionDate ?? currentDate);

   if (!sessionId) {
      sessionId = uuidv4();
      // localStorage.setItem('sessionId', sessionId);
      secureLocalStorage.set('sessionId', sessionId);
   }

   if (!sessionDate) {
      sessionDate = currentDate;
      // localStorage.setItem('sessionDate', String(sessionDate));
      secureLocalStorage.set('sessionDate', sessionDate);
   } else if (datesDuration.as('hours') >= 3) {
      // localStorage.clear();
      secureLocalStorage.removeAll();
      setSession(true);
   }

   return sessionId;
};

/**
 * @description Creates the base information object for the session replay.
 *
 * @param {boolean} [isNewSession=false] Forces the creation of a new session.
 */
export const setSession = (isNewSession = false) => {
   const sessionId = setSessionId();
   // const sessionData = JSON.parse(localStorage.getItem('sessionData'));
   const sessionData = secureLocalStorage.get('sessionData');

   /**
    * @description Base session information.
    * @type {import("../../types/Session").Session}
    */
   const sessionObject = {
      loms: {},
      pageHeight: document.body.clientHeight,
      pageWidth: document.body.clientWidth,
      rootPath: '/',
      sessionId,
   };

   if (!sessionData || isNewSession) {
      // localStorage.setItem('sessionData', JSON.stringify(sessionObject));
      secureLocalStorage.set('sessionData', sessionObject);
   }
};

import { DateTime, Duration } from 'luxon';
import { v4 as uuidv4 } from 'uuid';

/**
 * @description Manages the session refresh and session id creation at the defined moment to make it
 *
 * @returns {string}
 */
const setSessionId = () => {
   let sessionId = localStorage.getItem('sessionId');
   let sessionDate = Number(localStorage.getItem('sessionDate'));
   const currentDate = DateTime.now().toMillis();
   const datesDuration = Duration.fromMillis(currentDate - sessionDate ?? currentDate);

   if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem('sessionId', sessionId);
   }

   if (!sessionDate) {
      sessionDate = currentDate;
      localStorage.setItem('sessionDate', String(sessionDate));
   } else if (datesDuration.as('hours') >= 3) {
      localStorage.clear();
      setSession(true);
   }

   return sessionId;
};

/**
 * @description Creates the base information object for the session replay.
 */
export const setSession = (isNewSession = false) => {
   const sessionId = setSessionId();
   const sessionData = JSON.parse(localStorage.getItem('sessionData'));

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

   if (!sessionData || isNewSession)
      localStorage.setItem('sessionData', JSON.stringify(sessionObject));
};

import { DateTime, Duration } from 'luxon';
import { v4 as uuidv4 } from 'uuid';

/**
 * @description Manages the session refresh and session id creation at the defined moment to make it.
 *
 * @returns {string} The session ID.
 */
const setSessionId = () => {
   let sessionId = localStorage.getItem('lom-sessionId');
   let sessionDate = Number(localStorage.getItem('lom-sessionDate'));
   const currentDate = DateTime.now().toMillis();
   const datesDuration = Duration.fromMillis(currentDate - sessionDate ?? currentDate);

   if (!sessionId) {
      sessionId = uuidv4();
      localStorage.setItem('lom-sessionId', sessionId);
   }

   if (!sessionDate) {
      sessionDate = currentDate;
      localStorage.setItem('lom-sessionDate', String(sessionDate));
   } else if (datesDuration.as('hours') >= 3) {
      localStorage.removeItem('lom-sessionId');
      localStorage.removeItem('lom-sessionDate');
      localStorage.removeItem('lom-sessionData');

      localStorage.removeItem('lom-pageChangeElementID');
      localStorage.removeItem('lom-previousLom');
      localStorage.removeItem('lom-previousPageName');

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
   const sessionData = JSON.parse(localStorage.getItem('lom-sessionData'));

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
      localStorage.setItem('lom-sessionData', JSON.stringify(sessionObject));
};

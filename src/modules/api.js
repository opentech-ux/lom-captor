/**
 * @description Creates the base information object for the session replay.
 */
export const setSession = () => {
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
   };

   if (!sessionData) localStorage.setItem('sessionData', JSON.stringify(sessionObject));
};

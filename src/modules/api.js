/* eslint-disable import/prefer-default-export */

export const setSession = async () => {
   const sessionData = JSON.parse(localStorage.getItem('sessionData'));

   /**
    * @description Complete session information.
    */
   const sessionInfo = {
      loms: {},
      pageHeight: document.body.clientHeight,
      pageWidth: document.body.clientWidth,
      rootPath: '/',
   };

   if (!sessionData) localStorage.setItem('sessionData', JSON.stringify(sessionInfo));
};

/* eslint-disable import/prefer-default-export */

export const setSession = async () => {
   /**
    * @description Complete session information.
    */
   const sessionInfo = {
      loms: {},
      pageHeight: document.body.clientHeight,
      pageWidth: document.body.clientWidth,
      rootPath: '/',
   };

   localStorage.setItem('sessionData', JSON.stringify(sessionInfo));
};

const header = [
   navigator.platform,
   navigator.userAgent,
   navigator.appVersion,
   navigator.vendor,
   // @ts-ignore
   window.opera,
];

const dataos = [
   {
      name: 'Windows Phone',
      value: 'Windows Phone',
      version: 'OS',
   },
   {
      name: 'Windows',
      value: 'Win',
      version: 'NT',
   },
   {
      name: 'iPhone',
      value: 'iPhone',
      version: 'OS',
   },
   {
      name: 'iPad',
      value: 'iPad',
      version: 'OS',
   },
   {
      name: 'Kindle',
      value: 'Silk',
      version: 'Silk',
   },
   {
      name: 'Android',
      value: 'Android',
      version: 'Android',
   },
   {
      name: 'PlayBook',
      value: 'PlayBook',
      version: 'OS',
   },
   {
      name: 'BlackBerry',
      value: 'BlackBerry',
      version: '/',
   },
   {
      name: 'Macintosh',
      value: 'Mac',
      version: 'OS X',
   },
   {
      name: 'Linux',
      value: 'Linux',
      version: 'rv',
   },
   {
      name: 'Palm',
      value: 'Palm',
      version: 'PalmOS',
   },
];

const databrowser = [
   {
      name: 'Chrome',
      value: 'Chrome',
      version: 'Chrome',
   },
   {
      name: 'Firefox',
      value: 'Firefox',
      version: 'Firefox',
   },
   {
      name: 'Safari',
      value: 'Safari',
      version: 'Version',
   },
   {
      name: 'Internet Explorer',
      value: 'MSIE',
      version: 'MSIE',
   },
   {
      name: 'Opera',
      value: 'Opera',
      version: 'Opera',
   },
   {
      name: 'BlackBerry',
      value: 'CLDC',
      version: 'CLDC',
   },
   {
      name: 'Mozilla',
      value: 'Mozilla',
      version: 'Mozilla',
   },
];

/**
 * @description Function for formatting the information of a device.
 *
 * @param {string} string Data to look for in the array.
 * @param {Record<string, string>[]} data Array of data.
 * @returns {Record<string, unknown>}
 */
const matchItem = (string, data) => {
   let i = 0;
   let j = 0;
   let regex;
   let regexv;
   let match;
   let matches;
   let version;
   for (i = 0; i < data.length; i += 1) {
      regex = new RegExp(data[i].value, 'i');
      match = regex.test(string);
      if (match) {
         regexv = new RegExp(`${data[i].version}[- /:;]([\\d._]+)`, 'i');
         matches = string.match(regexv);
         version = '';
         if (matches) {
            if (matches[1]) {
               // eslint-disable-next-line prefer-destructuring
               matches = matches[1];
            }
         }
         if (matches) {
            // @ts-ignore
            matches = matches.split(/[._]+/);
            for (j = 0; j < matches.length; j += 1) {
               if (j === 0) {
                  version += `${matches[j]}.`;
               } else {
                  version += matches[j];
               }
            }
         } else {
            version = '0';
         }
         return {
            name: data[i].name,
            version: parseFloat(version),
         };
      }
   }
   return {
      name: 'unknown',
      version: 0,
   };
};

/**
 * @description Function for returning device information.
 *
 * @returns {Record<string, unknown>}
 */
const getInfo = () => {
   const agent = header.join(' ');
   const os = matchItem(agent, dataos);
   const browser = matchItem(agent, databrowser);
   return {
      browser,
      navigator: {
         appVersion: header[2],
         platform: header[0],
         userAgent: header[1],
         vendor: header[3],
      },
      os,
   };
};

export default getInfo;

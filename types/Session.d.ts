import { LOM } from './LOM';

export interface Session {
   loms: {
      [key: string]: LOM;
   };
   pageHeight: number;
   pageWidth: number;
   rootPath: string;
   [key: string]: unknown;
}

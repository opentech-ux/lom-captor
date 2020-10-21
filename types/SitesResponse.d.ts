import { SiteInfo } from './SiteInfo';

export interface SitesResponse {
   [key: string]: unknown;
   data: {
      count: number;
      sites: [SiteInfo];
   };
   message: string;
   success: boolean;
   type: string;
}

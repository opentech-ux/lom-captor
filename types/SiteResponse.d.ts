import { SiteInfo } from './SiteInfo';

export interface SiteResponse {
   [key: string]: unknown;
   data: SiteInfo;
   message: string;
   success: boolean;
   type: string;
}

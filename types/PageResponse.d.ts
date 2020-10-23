import { PageInfo } from './PageInfo';
export interface PageResponse {
   [key: string]: unknown;
   data: PageInfo;
   message: string;
   success: boolean;
   type: string;
}

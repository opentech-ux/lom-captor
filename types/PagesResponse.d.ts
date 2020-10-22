import { PageInfo } from "./PageInfo";

export interface PagesResponse {
   [key: string]: unknown;
   data: {
      count: number;
      pages: [PageInfo];
   };
   message: string;
   success: boolean;
   type: string;
}

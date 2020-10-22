export interface PageInfo {
   [key: string]: unknown;

   _id?: string;
   fields: {
      hash: string | null;
      path: string | null;
   };
   createdAt?: string;
   updatedAt?: string;
   site: string;
}

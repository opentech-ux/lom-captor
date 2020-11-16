export interface EventInfo {
   [key: string]: unknown;
   _id?: string;
   fields: {
      [key: string]: unknown;
   };
   createdAt?: string;
   updatedAt?: string;
   page: string;
   session: string;
}

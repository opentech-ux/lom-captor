export interface SiteInfo {
   [key: string]: unknown;

   _id?: string;
   fields: {
      host: string;
      currentStep?: number;
   };
   createdAt?: string;
   updatedAt?: string;
   user: string;
}

export interface VisitorInfo {
   [key: string]: unknown;
   _id?: string;
   createdAt?: string;
   fields: Record<string, unknown>;
   page: string;
   site: string;
   updatedAt?: string;
}

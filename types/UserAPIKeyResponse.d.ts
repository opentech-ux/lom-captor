export interface UserAPIKeyResponse {
   [key: string]: unknown;

   data: {
      _id: string;
      email: string;
      createdAt: string;
      updatedAt: string;
   };
   message: string;
   success: boolean;
   type: string;
}

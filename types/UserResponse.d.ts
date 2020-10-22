import { UserInfo } from './UserInfo';

export interface UserResponse {
   [key: string]: unknown;

   data: UserInfo;
   message: string;
   success: boolean;
   type: string;
}

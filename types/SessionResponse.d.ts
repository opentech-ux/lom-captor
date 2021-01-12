import { SessionRequestInfo } from './SessionRequestInfo';

export interface SessionResponse {
   data: SessionRequestInfo;
   message: string;
   success: boolean;
   type: string;
}

import { VisitorInfo } from './VisitorInfo';

export interface VisitorResponse {
   data: VisitorInfo;
   message: string;
   success: boolean;
   type: string;
}

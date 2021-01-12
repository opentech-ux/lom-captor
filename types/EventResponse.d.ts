import { EventInfo } from './EventInfo';
export interface EventResponse {
   [key: string]: unknown;
   data: EventInfo;
   message: string;
   success: boolean;
   type: string;
}

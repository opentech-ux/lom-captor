export interface LOM {
   bounds: {
      height: number;
      width: number;
      x: number;
      y: number;
   };
   children: LOM[];
   style?: {
      background: string;
      border: string;
   };
   uxId: string | null;
   [key: string]: unknown;
}

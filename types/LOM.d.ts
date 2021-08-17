declare interface LOM {
   bounds: {
      height: number;
      width: number;
      x: number;
      y: number;
   };
   children: LOM[];
   uxId: string | null;
}

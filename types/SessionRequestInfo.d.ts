export interface SessionRequestInfo {
   [key: string]: unknown;
   _id?: string;
   fields: {
      [key: string]: unknown;
      dataVersion: string;
      deviceInfo: { [key: string]: unknown };
      devicePixelRatio: number;
      initialBodyClientHeight: number;
      initialBodyClientWidth: number;
      loadingTime: { [key: string]: unknown };
      lom: { [key: string]: unknown };
      pageRefresh: boolean;
      previousPage: string | null;
      visitorId: string;
      ended: boolean;
   };
   createdAt?: string;
   updatedAt?: string;
   page: string;
}

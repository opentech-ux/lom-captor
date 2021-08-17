import { isBetween } from '../src/modules/tools';

describe('Tools testing', () => {
   describe('isBetween function', () => {
      it('Should return true because 5 is between 4 and 6', () => {
         expect(isBetween(5, 4, 6)).toBeTruthy();
      });
      it('Should return true because 5 is between 5 and 6', () => {
         expect(isBetween(5, 5, 6)).toBeTruthy();
      });
      it('Should return false because 4 is NOT between 5 and 6', () => {
         expect(isBetween(4, 5, 6)).toBeFalsy();
      });
   });
});

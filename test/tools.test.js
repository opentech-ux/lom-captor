import { isBetween } from '../src/modules/tools';

describe('Tools testing', () => {
   describe('isBetween function', () => {
      it('Should return true because 5 is between 1 and 10', () => {
         expect(isBetween(5, 1, 10)).toBeTruthy();
      });
      it('Should return true because 1 is between 1 and 10', () => {
         expect(isBetween(1, 1, 10)).toBeTruthy();
      });
      it('Should return true because 10 is between 1 and 10', () => {
         expect(isBetween(10, 1, 10)).toBeTruthy();
      });
      it('Should return false because 15 is NOT between 1 and 10', () => {
         expect(isBetween(15, 1, 10)).toBeFalsy();
      });
   });
});

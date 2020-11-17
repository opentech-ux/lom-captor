import { isBetween, mergeObjects, simplifyArray } from '../src/modules/tools';

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

   describe('mergeObjects function', () => {
      it('Should add keys from object 2 to object 1', () => {
         expect(mergeObjects({ test1: true }, { test2: false })).toEqual({
            test1: true,
            test2: false,
         });
      });
      it('Should replace the values from object 2 to object 1', () => {
         expect(mergeObjects({ test1: true }, { test1: false, test2: false })).toEqual({
            test1: false,
            test2: false,
         });
      });
   });

   describe('simplifyArray function', () => {
      it('Should simplifying an array with javascript objects and get repetition times', () => {
         expect(
            simplifyArray(
               [
                  { make: 'audi', model: 'r8', year: '2012' },
                  { make: 'audi', model: 'rs5', year: '2013' },
                  { make: 'ford', model: 'mustang', year: '2012' },
                  { make: 'ford', model: 'fusion', year: '2015' },
                  { make: 'kia', model: 'optima', year: '2012' },
               ],
               (i) => [i.make]
            )
         ).toEqual([
            [{ make: 'audi', model: 'rs5', numberTimes: 2, year: '2013' }],
            [
               {
                  make: 'ford',
                  model: 'fusion',
                  numberTimes: 2,
                  year: '2015',
               },
            ],
            [{ make: 'kia', model: 'optima', numberTimes: 1, year: '2012' }],
         ]);
      });
   });
});

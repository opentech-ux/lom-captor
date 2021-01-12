import getDeviceInfo from '../src/modules/device';

describe('Device module testing', () => {
   describe('getDeviceInfo function', () => {
      test('Getting device information', () => {
         expect(getDeviceInfo()).not.toBe(null);
         expect(getDeviceInfo()).not.toBe({});
         expect(getDeviceInfo()).not.toBe(false);
      });
   });
});

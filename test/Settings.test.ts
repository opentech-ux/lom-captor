import { withDefaults } from '../src/Settings';

const defaultSettings = {
    trackUser: false,
    bufferTimeoutMs: 10000,
    globalTolerance: 20,
    devMode: false,
};

describe('Settings testing', () => {
    describe('withDefault function', () => {
        it('Should return default settings as only endpoint is specified', () => {
            expect(withDefaults({ endpoint: '/ux' })).toMatchObject({
                ...defaultSettings,
                endpoint: '/ux',
            });
        });
        it('Should return settings with some defaults overriden', () => {
            expect(withDefaults({ endpoint: '/ux', devMode: true, globalTolerance: 50 })).toMatchObject({
                ...defaultSettings,
                endpoint: '/ux',
                globalTolerance: 50,
                devMode: true,
            });
        });
    });
});

import * as cut from './../../src/utils/hash-utils';
import * as crypto from 'crypto';

describe('hash utils tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return a hashed string', () => {
        jest.spyOn(crypto, 'createHash').mockReturnValue({
            update: jest.fn().mockImplementation(() => {
                return {
                    digest: jest.fn().mockReturnValue('random-hash-string')
                }
            })
        } as any);

        expect(cut.hashString('input-string')).toEqual('random-hash-string');
        expect(cut.hashString('input-string')).not.toEqual('random-wrong-hash-string');
    })
})
import * as cut from './dynamodb-utils';

describe('dynamodb-utils tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('should return unique id', () => {
        expect(cut.generateUniqueId()).toBe('112233abc');
    })

    it('should return unique id with prefix', () => {
        expect(cut.generateUniqueId('prefix')).toBe('prefix112233abc');
    })
})
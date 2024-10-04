import * as cut from './service';

describe('service tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockedStoreParams: cut.StoreProps = {
        interval: {
            type: 'minutes',
            value: 10,
        },
        sender: 'send-test@test.x',
        recipient: 'receiver-test@test.x',
        subject: 'test',
        message: 'test message',
    };

    it('should throw an error if arguments are not provided', async () => {
        expect(cut.store({} as any)).rejects.toThrow(
            'Missing required property attributes!',
        );
    });

    it('should store reminder into db and return reminder id', async () => {
        const result = await cut.store(mockedStoreParams);

        expect(result).toEqual({
            reminderId: '112233abc'
        });
    });
});

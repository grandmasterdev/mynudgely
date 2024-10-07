import { ReminderProps } from '../../types';

let client: jest.Mock;
let cut: any;

describe('kill service tests', () => {
    beforeEach(async () => {
        jest.resetModules();

        jest.doMock('./../../clients/dynamodb-client', () => ({
            client: jest.fn().mockReturnValue({
                send: jest.fn()
            }),
        }));

        client = (await import('./../../clients/dynamodb-client')).client as any;
        cut = (await import('./service'));
    });

    it('should throw an error if argument is not passed to the function', async () => {
        expect(cut.kill(undefined as any)).rejects.toBeInstanceOf(Error);
        expect(cut.kill(undefined as any)).rejects.toEqual(
            new Error('Missing required property attributes!'),
        );
    });

    it('should remove reminder from the eventbridge and database', async () => {
        const mockSend = client().send;
        mockSend.mockResolvedValue({
            eventBridgeRuleName: 'mock-rule',
        } as unknown as ReminderProps)

        await cut.kill('mock-reminder-id');

        expect(client).toHaveBeenCalled();
        expect(mockSend).toHaveBeenCalled();
    });
});

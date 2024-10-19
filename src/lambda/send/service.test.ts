import { SendEvent } from '../../types';

describe('service tests', () => {
    let cut: any;
    let kill: jest.Mock;
    let client: jest.Mock;

    beforeEach(async () => {
        jest.resetModules();

        jest.doMock('./../../clients/dynamodb-client', () => ({
            client: jest.fn().mockReturnValue({
                send: jest.fn(),
            }),
        }));

        jest.doMock('./../kill/service', () => ({
            kill: jest.fn()
        }));

        client = (await import('./../../clients/dynamodb-client'))
            .client as any;
        kill = (await import('./../kill/service')).kill as any;
        cut = await import('./service');

        jest.clearAllMocks();
    });

    it('should send reminder if the cycle has not exceeded max and update the cycle in database', async () => {
        const mockSend = client().send;

        mockSend.mockResolvedValueOnce({
            Item: {
                sender: 'mock-sender',
                recipient: 'mock-recipient',
                message: 'message-mock',
                eventBridgeRuleName: 'event-bridge-rule-name-mock',
                maxCycles: 3,
                currentCycles: 0,
            },
        });
        mockSend.mockResolvedValueOnce({});

        const result = await cut.send({
            reminderId: 'mock-reminder-id',
        });

        expect(result).toEqual({
            event: SendEvent.sent,
        });
        expect(mockSend).toHaveBeenCalledTimes(2);
        expect.assertions(2);
    });

    it('should response with event exceeded response if the cycle has exceeded max', async () => {
        const mockSend = client().send;

        mockSend.mockResolvedValueOnce({
            Item: {
                sender: 'mock-sender',
                recipient: 'mock-recipient',
                message: 'message-mock',
                eventBridgeRuleName: 'event-bridge-rule-name-mock',
                maxCycles: 3,
                currentCycles: 3,
            },
        });
        mockSend.mockResolvedValueOnce({});

        const result = await cut.send({
            reminderId: 'mock-reminder-id',
        });

        expect(result).toEqual({
            event: SendEvent.exceeded,
        });
        expect(mockSend).toHaveBeenCalledTimes(1);
        expect(kill).toHaveBeenCalledTimes(1);
        expect.assertions(3);
    });
});

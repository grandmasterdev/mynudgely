import { SendEvent } from '../../types';
import * as cut from './index';
import { send } from './service';
import { mocked } from 'jest-mock';

jest.mock('./service');

describe('index tests', () => {
    const sendMock = mocked(send);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return status with object attribute status', async () => {
        sendMock.mockResolvedValueOnce({
            event: SendEvent.sent,
        });

        sendMock.mockResolvedValueOnce({
            event: SendEvent.exceeded,
        });

        let result = (await cut.handler(
            {
                reminderId: 'mock-reminder-id',
            } as any,
            {} as any,
        )) as cut.SendReminderHandlerResponse;

        expect(result).toEqual({
            reminderId: 'mock-reminder-id',
            status: SendEvent.sent,
        });

        result = (await cut.handler(
            {
                reminderId: 'mock-reminder-id',
            } as any,
            {} as any,
        )) as cut.SendReminderHandlerResponse;

        expect(result).toEqual({
            reminderId: 'mock-reminder-id',
            status: SendEvent.exceeded,
        });

        expect(sendMock).toHaveBeenCalledTimes(2);
        expect.assertions(3);
    });

    it('should throw error if handler params is missing', async () => {
        expect(cut.handler(undefined as any, {} as any)).rejects.toBeInstanceOf(Error);
        expect(cut.handler(undefined as any, {} as any)).rejects.toEqual(
            new Error('No event attribute found!'),
        );
    });
});

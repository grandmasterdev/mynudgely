import { Context } from 'aws-lambda';
import { send } from './service';
import { SendEvent } from '../../types';

const LOG_PREFIX: string = '[handler]';

/**
 * Send reminder lambda handler
 * @param event
 * @param context
 * @returns
 */
export const handler = async (
    event: SendReminderHandlerProps,
    context: Context,
): Promise<SendReminderHandlerResponse> => {
    if(!event) {
        const errMsg: string = 'No event attribute found!';
        console.error(errMsg);

        throw new Error(errMsg);
    }

    const { reminderId } = event;

    if (!reminderId) {
        const errMsg: string = 'No reminder id found!';
        console.error(errMsg);

        throw new Error(errMsg);
    }

    try {
        const result = await send({
            reminderId,
        });

        return {
            reminderId,
            status: result.event,
        };
    } catch (err) {
        console.error(`${LOG_PREFIX} ${(err as Error).message}`);

        return {
            reminderId,
            message: 'Sorry. Something went wrong.',
        };
    }
};

export interface SendReminderHandlerProps {
    reminderId: string;
}

export type SendReminderHandlerResponse = {
    reminderId: string;
    status?: SendEvent;
    message?: string;
};

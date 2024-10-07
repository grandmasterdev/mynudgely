import { APIGatewayEvent, Context } from 'aws-lambda';
import { kill } from './service';
import { APIGatewayResponse, APIStatusCode } from '../../types';

const LOG_PREFIX: string = '[handler]'

/**
 * Store reminder lambda handler
 * @param event
 * @param context
 * @returns
 */
export const handler = async (
    event: APIGatewayEvent,
    context: Context,
): Promise<APIGatewayResponse> => {
    const { httpMethod, path, pathParameters } = event;

    if (httpMethod === 'DELETE' && path.indexOf('/reminders/') > -1) {
        const reminderId: string | undefined = pathParameters?.reminderId;

        if (!reminderId) {
            const errMsg: string = 'No reminder id found';
            console.error(errMsg);

            throw new Error(errMsg);
        }

        try {
            const result = await kill(reminderId);

            return {
                status: APIStatusCode.OK,
                body: JSON.stringify(
                    result ?? {
                        message: 'Operation was successful',
                    },
                ),
            };
        } catch (err) {
            console.error(`${LOG_PREFIX} ${(err as Error).message}`);

            return {
                status: APIStatusCode.InternalServerError,
                body: JSON.stringify({
                    message: 'Sorry. Something went wrong.',
                }),
            };
        }
    } else {
        return {
            status: APIStatusCode.BadRequest,
            body: JSON.stringify({
                message: 'Sorry. Bad request.',
            }),
        };
    }
};

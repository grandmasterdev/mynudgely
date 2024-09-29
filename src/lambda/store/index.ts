import { APIGatewayEvent, Context } from 'aws-lambda';
import { store, StoreProps } from './service';
import { isStrJson } from '@nodifier/json';
import { APIGatewayResponse, APIStatusCode } from '../../types';

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
  const { httpMethod, path, body } = event;

  if (httpMethod === 'POST' && path === '/reminders') {
    if (!body || !isStrJson(body)) {
      return {
        status: APIStatusCode.BadRequest,
        body: JSON.stringify({
          message: 'Request body cannot be empty',
        }),
      };
    }

    const storeProps = JSON.parse(body) as StoreProps;

    try {
      const result = await store(storeProps);

      return {
        status: APIStatusCode.OK,
        body: JSON.stringify(
          result ?? {
            message: 'Operation was successful',
          },
        ),
      };
    } catch (err) {
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

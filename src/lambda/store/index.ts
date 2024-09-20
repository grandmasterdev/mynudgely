import { APIGatewayEvent, Context } from 'aws-lambda';
import { store } from './store-service';

export const handler = async (
  event: APIGatewayEvent,
  context: Context,
): Promise<APIGatewayResponse> => {
  const { httpMethod, path } = event;

  if (httpMethod === 'POST' && path === '/reminders') {
    await store({
      interval: {
        minute: 1
      },
      recipient: "test@gmail.com"
    });
  }

  return {
    status: APIStatusCode.OK,
    body: JSON.stringify({}),
  };
};

export type APIGatewayResponse = {
  status: APIStatusCode;
  body?: string;
};

export enum APIStatusCode {
  'OK' = 200,
  'NotFound' = 404,
  'UnAuthorized' = 401,
  'BadRequest' = 400,
}

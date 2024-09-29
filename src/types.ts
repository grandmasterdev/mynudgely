export type APIGatewayResponse = {
  status: APIStatusCode;
  body?: string;
};

export enum APIStatusCode {
  'OK' = 200,
  'NotFound' = 404,
  'UnAuthorized' = 401,
  'BadRequest' = 400,
  'InternalServerError' = 500
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      AWS_REGION: string;
      AWS_ACCOUNT_ID: string;
      SEND_REMINDER_LAMBDA_FUNCTION_ARN: string;
      REMINDER_TABLE_NAME: string;
    }
  }
}
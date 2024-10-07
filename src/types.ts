/**
 * Interfaces
 */
export interface ReminderProps {
  interval: ReminderPropsInterval;
  sender: string;
  recipient: string;
  subject: string;
  message: string;
  eventBridgeRuleName?: string;
}

/**
 * Types
 */
export type APIGatewayResponse = {
  status: APIStatusCode;
  body?: string;
};

export type ReminderRecord = {
  reminderId: string;
  ruleName: string;
};

export type ReminderPropsInterval = {
  type: 'minutes' | 'hours' | 'days' | 'weeks';
  value: number;
};

/**
 * Enums
 */
export enum APIStatusCode {
  'OK' = 200,
  'NotFound' = 404,
  'UnAuthorized' = 401,
  'BadRequest' = 400,
  'InternalServerError' = 500
}

/**
 * Global
 */
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
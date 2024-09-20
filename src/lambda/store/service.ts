import {
  EventBridgeClient,
  PutRuleCommand,
  PutTargetsCommand,
} from '@aws-sdk/client-eventbridge';
import { LambdaClient, AddPermissionCommand } from '@aws-sdk/client-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { convertStorePropsIntervalToCron } from './../../utils/cron-utils';
import { hashString } from './../../utils/hash-utils';

const eventBridgeClient = new EventBridgeClient({});
const lambdaClient = new LambdaClient({});
const dynamodbClient = new DynamoDBClient({});

const lambdaArn: string = process.env.SEND_REMINDER_LAMBDA_FUNCTION_ARN;

/**
 * Store reminder
 */
export const store = async (props: StoreProps) => {
  const { interval, sender, recipient, subject, message } = props;

  if (!interval || !sender || !recipient || !message || !subject) {
    throw new Error('Missing required property attributes!');
  }

  const ruleName: string = hashString(`mynudgely-${sender}:${recipient}:${subject}`);
  const scheduleExpression: string = convertStorePropsIntervalToCron(
    props.interval.type,
    props.interval.value,
  );

  try {
    // Create the EventBridge rule
    const putRuleCommand = new PutRuleCommand({
      Name: ruleName,
      ScheduleExpression: scheduleExpression,
      State: 'ENABLED',
    });
    await eventBridgeClient.send(putRuleCommand);

    // Add the Lambda function as a target
    const putTargetsCommand = new PutTargetsCommand({
      Rule: ruleName,
      Targets: [
        {
          Id: '1',
          Arn: lambdaArn,
        },
      ],
    });
    await eventBridgeClient.send(putTargetsCommand);

    // Add permission for EventBridge to invoke the Lambda function
    const addPermissionCommand = new AddPermissionCommand({
      FunctionName: lambdaArn,
      StatementId: `${ruleName}-invoke`,
      Action: 'lambda:InvokeFunction',
      Principal: 'events.amazonaws.com',
      SourceArn: `arn:aws:events:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:rule/${ruleName}`,
    });
    await lambdaClient.send(addPermissionCommand);

    // Store reminder in database
    const {} = props;

    return {
      reminderId: 'some-id',
    };
  } catch (err) {
    throw err;
  }
};

export interface StoreProps {
  interval: StorePropsInterval;
  sender: string;
  recipient: string;
  subject: string;
  message: string;
}

export type ReminderRecord = {
  reminderId: string;
  ruleName: string;
}

export type StorePropsInterval = {
  type: 'minutes' | 'hours' | 'days' | 'weeks';
  value: number;
};

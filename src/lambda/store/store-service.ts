import {
  EventBridgeClient,
  PutRuleCommand,
  PutTargetsCommand,
} from '@aws-sdk/client-eventbridge';
import { LambdaClient, AddPermissionCommand } from '@aws-sdk/client-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

const eventBridgeClient = new EventBridgeClient({});
const lambdaClient = new LambdaClient({});
const dynamodbClient = new DynamoDBClient({});

const ruleName: string = '';
const scheduleExpression: string = '';
const lambdaArn: string = '';

/**
 * Store reminder
 */
export const store = async (props: StoreProps) => {
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


  } catch (err) {
    throw err;
  }
};

export interface StoreProps {
  interval: StorePropsInterval;
  recipient: string;
}

export type StorePropsInterval = {
  minute?: number;
  hour?: number;
  day?: number;
  week?: number;
  month?: number;
};

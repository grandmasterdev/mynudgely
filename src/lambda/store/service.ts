import {
    EventBridgeClient,
    PutRuleCommand,
    PutTargetsCommand,
} from '@aws-sdk/client-eventbridge';
import { LambdaClient, AddPermissionCommand } from '@aws-sdk/client-lambda';
import { convertStorePropsIntervalToCron } from './../../utils/cron-utils';
import { hashString } from './../../utils/hash-utils';
import { client, PutCommand } from './../../clients/dynamodb-client';
import { generateUniqueId } from '../../utils/dynamodb-utils';
import { ReminderProps } from '../../types';

const eventBridgeClient = new EventBridgeClient({});
const lambdaClient = new LambdaClient({});
const ddbClient = client();

const lambdaArn: string = process.env.SEND_REMINDER_LAMBDA_FUNCTION_ARN;
const dynamodbTableName: string = process.env.REMINDER_TABLE_NAME;

/**
 * Store reminder
 */
export const store = async (props: ReminderProps) => {
    const { interval, sender, recipient, subject, message } = props;

    if (!interval || !sender || !recipient || !message || !subject) {
        throw new Error('Missing required property attributes!');
    }

    const ruleName: string = hashString(
        `mynudgely-${sender}:${recipient}:${subject}`,
    );
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

        console.debug('Success - new event bridge rule has been created.');

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

        console.debug(
            'Success - new event bridge rule target has been created.',
        );

        // Add permission for EventBridge to invoke the Lambda function
        const addPermissionCommand = new AddPermissionCommand({
            FunctionName: lambdaArn,
            StatementId: `${ruleName}-invoke`,
            Action: 'lambda:InvokeFunction',
            Principal: 'events.amazonaws.com',
            SourceArn: `arn:aws:events:${process.env.AWS_REGION}:${process.env.AWS_ACCOUNT_ID}:rule/${ruleName}`,
        });
        await lambdaClient.send(addPermissionCommand);

        console.debug(
            'Success - new permission has been granted to the event bridge to execute the lambda.',
        );

        // Store reminder in database
        const reminderId: string = generateUniqueId();

        props = {
            ...props,
            eventBridgeRuleName: ruleName
        }

        const putCommand = new PutCommand({
            TableName: dynamodbTableName,
            Item: {
                id: reminderId,
                ...props
            },
        });

        const result = await ddbClient.send(putCommand);

        console.debug(
            'Success - new remindered has been added to the db',
            result,
        );

        return {
            reminderId: reminderId,
        };
    } catch (err) {
        throw err;
    }
};
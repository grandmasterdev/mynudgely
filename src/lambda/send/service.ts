import { ReminderProps, SendEvent } from '../../types';
import { client } from './../../clients/dynamodb-client';
import { GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { kill } from './../kill/service';

const dynamodbTableName: string = process.env.REMINDER_TABLE_NAME;

const ddbClient = client();

export const send = async (props: SendReminder) => {
    const { reminderId } = props;

    if (!reminderId) {
        throw new Error(`Missing required property attributes!`);
    }

    try {
        // Grab reminder info from DB
        const getParams = new GetCommand({
            TableName: dynamodbTableName,
            Key: {
                reminderId,
            },
        });

        const result = await ddbClient.send(getParams);

        if (result && !result.Item) {
            throw new Error(`No record found in the database!`);
        }

        const {
            sender,
            recipient,
            message,
            eventBridgeRuleName,
            maxCycles,
            currentCycles,
        } = result.Item as ReminderProps;

        if (currentCycles && currentCycles >= maxCycles) {
            // Kill reminder
            await kill(reminderId);

            return {
                event: SendEvent.exceeded,
            };
        }

        // Send reminder

        // Update current cycle to database
        const cycles = currentCycles ? currentCycles + 1 : 1;

        const updateParams = new UpdateCommand({
            TableName: dynamodbTableName,
            Key: {
                reminderId,
            },
            UpdateExpression: 'SET #attr = :value',
            ExpressionAttributeNames: {
                '#attr': 'currentCycles',
            },
            ExpressionAttributeValues: {
                ':value': cycles,
            },
        });

        await ddbClient.send(updateParams);
    } catch (err) {
        console.error(`${(err as Error).message}`);
        throw err;
    }
};

export interface SendReminder {
    reminderId: string;
}

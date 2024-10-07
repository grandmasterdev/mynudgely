import { client } from './../../clients/dynamodb-client';
import { DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { EventBridgeClient, DeleteRuleCommand } from '@aws-sdk/client-eventbridge';
import { ReminderProps } from './../../types';

const ddbClient = client();
const eventBridgeClient = new EventBridgeClient({});

const dynamodbTableName: string = process.env.REMINDER_TABLE_NAME;

export const kill = async (reminderId: string) => {
    if (!reminderId) {
        throw new Error('Missing required property attributes!');
    }

    try {
        // Get event bridge rule
        const queryCommand = new QueryCommand({
            TableName: dynamodbTableName,
            KeyConditionExpression: `#reminderIdKey = :reminderIdValue`,
            ExpressionAttributeNames: {
                '#reminderIdKey': 'reminderId',
            },
            ExpressionAttributeValues: {
                ':reminderIdValue': reminderId,
            },
        });

        const reminder = await ddbClient.send(queryCommand) as unknown as ReminderProps;

        if (!reminder) {
            throw new Error(`No reminder found with the id: ${reminderId}`);
        }

        // Remove reminder rule from event bridge rule
        const deleteRuleCommand = new DeleteRuleCommand({
            Name: reminder.eventBridgeRuleName
        });

        await eventBridgeClient.send(deleteRuleCommand);

        console.debug(
            'Success - reminder event rule has been removed from the event bridge',
        );
        
        // Remove reminder in database
        const deleteCommand = new DeleteCommand({
            TableName: dynamodbTableName,
            Key: {
                reminderId,
            },
        });

        await ddbClient.send(deleteCommand);

        console.debug(
            'Success - reminder record has been removed from the database',
        );
    } catch (err) {
        console.error('Problem trying to kill reminder');

        throw err;
    }
};

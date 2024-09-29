import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    PutCommand,
    DeleteCommand,
    ScanCommand,
    QueryCommand,
} from '@aws-sdk/lib-dynamodb';

export const client = (config?: DynamoDBClientConfig) => {
    const ddbConfig = config && config.region ? { region: config.region } : {};

    const dynamodbClient = new DynamoDBClient(ddbConfig);
    const dynamodbDoc = DynamoDBDocumentClient.from(dynamodbClient);

    return dynamodbDoc;
};

export interface DynamoDBClientConfig {
    region: string;
}

export { PutCommand, DeleteCommand, ScanCommand, QueryCommand };

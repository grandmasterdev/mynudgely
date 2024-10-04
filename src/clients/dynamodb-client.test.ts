import { mocked } from 'jest-mock';
import * as cut from './dynamodb-client';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const mockedDynamoDBDocumentClient = mocked(DynamoDBDocumentClient);

describe('dynamodb-client tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return dynamodb document client', () => {
        const result = cut.client();

        expect(result).toBeTruthy();
    });
});

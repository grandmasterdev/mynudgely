export const DynamoDBClient = jest.fn().mockReturnValue({
    send: jest.fn().mockResolvedValue({})
});
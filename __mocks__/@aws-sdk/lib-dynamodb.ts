export const DynamoDBDocumentClient = {
    from: jest.fn().mockImplementation((input) => {
        return input
    })
}

export const PutCommand = jest.fn();
export const DeleteCommand = jest.fn();
export const ScanCommand = jest.fn();
export const QueryCommand = jest.fn();

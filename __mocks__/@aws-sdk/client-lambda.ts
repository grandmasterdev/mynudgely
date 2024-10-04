export const LambdaClient = jest.fn().mockReturnValue({
    send: jest.fn().mockResolvedValue({})
});
export const AddPermissionCommand = jest.fn();
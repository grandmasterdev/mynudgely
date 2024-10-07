export const EventBridgeClient = jest.fn().mockReturnValue({
    send: jest.fn().mockResolvedValue({})
});
export const PutRuleCommand = jest.fn();
export const PutTargetsCommand = jest.fn();
export const DeleteRuleCommand = jest.fn();
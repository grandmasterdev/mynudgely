import * as cut from './../../src/utils/aws-arn-utils';

describe('AWS ARN utils tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return true for valid lambda function arn', () => {
        expect(cut.validateLambdaArn('arn:aws:lambda:us-west-2:123456789012:function:my-function')).toBeTruthy();
    });

    it('should return false for invalid lambda function arn', () => {
        expect(cut.validateLambdaArn('arn:aws:lambda:123456789012:function:my-wrong-function')).toBeFalsy();
    });
})
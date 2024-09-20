const lambdaArnRegex = /^arn:aws:lambda:[a-z]{2}-[a-z]+-\d{1}:\d{12}:function:[a-zA-Z0-9-_]+$/;

export const validateLambdaArn = (input: string): boolean => {
    return lambdaArnRegex.test(input);
}
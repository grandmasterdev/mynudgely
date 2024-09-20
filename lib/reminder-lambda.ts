import { Construct } from 'constructs';
import { Aws } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';

/**
 * Infrastructure code for reminder lambda resources
 */
export class ReminderLambda extends Construct {
  public readonly storeReminderFunction: lambda.Function;
  public readonly killReminderFunction: lambda.Function;
  public readonly sendReminderFunction: lambda.Function;

  constructor(scope: Construct, id: string, props?: ReminderLambdaProps) {
    super(scope, id);

    this.sendReminderFunction = new lambda.Function(
      this,
      `${id}-send-reminder-function`,
      {
        functionName: 'sendReminderFunction',
        code: lambda.Code.fromAsset('dist/lambda/send'),
        handler: 'index.js',
        ...this.getLambdaConfig(props),
      },
    );
    this.sendReminderFunction.addToRolePolicy(this.getEventPolicyStatement());

    this.storeReminderFunction = new lambda.Function(
      this,
      `${id}-store-reminder-function`,
      {
        functionName: 'storeReminderFunction',
        code: lambda.Code.fromAsset('dist/lambda/store'),
        handler: 'index.js',
        ...this.getLambdaConfig(props),
      },
    );
    this.killReminderFunction.addEnvironment(
      'SEND_REMINDER_LAMBDA_FUNCTION_ARN',
      this.sendReminderFunction.functionArn,
    );
    this.storeReminderFunction.addToRolePolicy(this.getEventPolicyStatement());

    this.killReminderFunction = new lambda.Function(
      this,
      `${id}-kill-reminder-function`,
      {
        functionName: 'killReminderFunction',
        code: lambda.Code.fromAsset('dist/lambda/kill'),
        handler: 'index.js',
        ...this.getLambdaConfig(props),
      },
    );
    this.killReminderFunction.addEnvironment(
      'SEND_REMINDER_LAMBDA_FUNCTION_ARN',
      this.sendReminderFunction.functionArn,
    );
    this.killReminderFunction.addToRolePolicy(this.getEventPolicyStatement());
  }

  private getLambdaConfig(props?: ReminderLambdaProps): ReminderLambdaConfig {
    const environment = {
      AWS_ACCOUNT_ID: Aws.ACCOUNT_ID,
      AWS_REGION: Aws.REGION,
    };

    if (props) {
      return {
        memorySize: props.memorySize ?? 512,
        runtime: props.runtime ?? lambda.Runtime.NODEJS_20_X,
        environment: environment,
      };
    }

    return {
      memorySize: 512,
      runtime: lambda.Runtime.NODEJS_20_X,
      environment: environment,
    };
  }

  private getEventPolicyStatement(): iam.PolicyStatement {
    return new iam.PolicyStatement({
      actions: [
        'events: PutRule',
        'events: PutTargets',
        'lambda: AddPermission',
      ],
      resources: ['*'],
    });
  }
}

export interface ReminderLambdaProps {
  memorySize?: number;
  runtime?: lambda.Runtime;
}

export type ReminderLambdaConfig = {
  memorySize: number;
  runtime: lambda.Runtime;
  environment: Record<string, string>;
};

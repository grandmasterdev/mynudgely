import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as api from "aws-cdk-lib/aws-apigatewayv2";
import * as apiIntegration from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as ddb from "aws-cdk-lib/aws-dynamodb";
import { ReminderLambda } from "./reminder-lambda";

export class MyNudgelyStack extends cdk.Stack {
  private readonly tableName: string = "MyNudgelyTable";

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, `${id}-queue`, {
      visibilityTimeout: cdk.Duration.seconds(300),
    });

    // event bridge

    // Lambda functions
    const reminderLambda = new ReminderLambda(this, id);

    const reminderApi = new api.HttpApi(this, `${id}-reminder-api`, {
      corsPreflight: {
        allowHeaders: ["Content-Type"],
        allowMethods: [api.CorsHttpMethod.GET, api.CorsHttpMethod.POST],
        allowOrigins: ["*"],
      },
    });
    reminderApi.addRoutes({
      path: "/reminders",
      methods: [api.HttpMethod.POST],
      integration: new apiIntegration.HttpLambdaIntegration(
        `${id}-store-reminder-route`,
        reminderLambda.storeReminderFunction
      ),
    });
    reminderApi.addRoutes({
      path: "/reminders",
      methods: [api.HttpMethod.DELETE],
      integration: new apiIntegration.HttpLambdaIntegration(
        `${id}-store-reminder-route`,
        reminderLambda.killReminderFunction
      ),
    });
    reminderApi.addRoutes({
      path: "/reminders/send",
      methods: [api.HttpMethod.POST],
      integration: new apiIntegration.HttpLambdaIntegration(
        `${id}-send-reminder-route`,
        reminderLambda.sendReminderFunction
      ),
    });

    const reminderDb = new ddb.Table(this, `${id}-database`, {
      tableName: this.tableName,
      partitionKey: {
        name: "ReminderId",
        type: ddb.AttributeType.STRING,
      },
    });
  }
}

#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ChatAppStack } from "../lib/chat-app-stack";
import { ChatDynamoDbStack } from "../lib/chat-dynamodb-stack";
import { ChatLambdaStack } from "../lib/chat-lambda-stack";
import { ChatApiStack } from "../lib/chat-api-stack";

const app = new cdk.App();

new ChatAppStack(app, "ChatAppStack");

const dynamoDbStack = new ChatDynamoDbStack(app, "ChatDynamoDbStack");

const lambdaStack = new ChatLambdaStack(
    app,
    "ChatLambdaStack",
    dynamoDbStack.chatTable
);

new ChatApiStack(app, "ChatApiStack", lambdaStack.chatFunction);

import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { ChatDynamoDbStack } from "./chat-dynamodb-stack";

export class ChatAppStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        new ChatDynamoDbStack(this, "ChatDynamoDbStack");
    }
}

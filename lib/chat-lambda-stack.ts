import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { Function, Runtime, Code } from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import { ITable } from "aws-cdk-lib/aws-dynamodb";

export class ChatLambdaStack extends cdk.Stack {
    public readonly chatFunction: Function;

    constructor(
        scope: Construct,
        id: string,
        chatTable: ITable,
        props?: cdk.StackProps
    ) {
        super(scope, id, props);

        this.chatFunction = new Function(this, "ChatFunction", {
            runtime: Runtime.NODEJS_20_X,
            handler: "index.handler",
            code: Code.fromAsset(path.join(__dirname, "../dist")),
        });

        // Grant lambda permission read/write to db
        chatTable.grantReadWriteData(this.chatFunction);

        this.chatFunction.addEnvironment("TABLE_NAME", chatTable.tableName);
    }
}

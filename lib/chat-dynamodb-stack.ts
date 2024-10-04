import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { ITable, Table, AttributeType } from "aws-cdk-lib/aws-dynamodb";
import dotenv from "dotenv";

dotenv.config();

export class ChatDynamoDbStack extends cdk.Stack {
    public readonly chatTable: ITable;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const tableName = process.env.TABLE_NAME || "ChatMessages";

        this.chatTable = new Table(this, "ChatTable", {
            tableName: tableName,
            partitionKey: {
                name: "id",
                type: AttributeType.STRING,
            },
            removalPolicy: cdk.RemovalPolicy.DESTROY,
        });
    }
}

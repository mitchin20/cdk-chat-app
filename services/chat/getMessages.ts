import dynamoDb from "../dynamoDbClient";
import { APIGatewayProxyResult } from "aws-lambda";
import dotenv from "dotenv";

dotenv.config();

const tableName = process.env.TABLE_NAME;

interface GetParams {
    TableName: string;
}

// Get all chat messages
export async function getMessages(): Promise<APIGatewayProxyResult> {
    const params = {
        TableName: tableName,
    } as GetParams;

    const data = await dynamoDb.scan(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({
            success: true,
            data,
            message: "Successfully fetch all data",
        }),
    };
}

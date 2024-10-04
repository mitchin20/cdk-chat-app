import dynamoDb from "../dynamoDbClient";
import { APIGatewayProxyResult } from "aws-lambda";
import dotenv from "dotenv";

dotenv.config();

const tableName = process.env.TABLE_NAME;

interface ParamsWithId {
    TableName: string;
    Key: {
        id: string;
    };
}

// Get chat message by id
export async function getMessage(id: string): Promise<APIGatewayProxyResult> {
    const params = {
        TableName: tableName,
        Key: {
            id: id,
        },
    } as ParamsWithId;

    const data = await dynamoDb.get(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({
            success: true,
            data: JSON.stringify(data.Item),
            message: "Successfully fetch data",
        }),
    };
}

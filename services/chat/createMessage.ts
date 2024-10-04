import dynamoDb from "../dynamoDbClient";
import { APIGatewayProxyResult } from "aws-lambda";
import dotenv from "dotenv";

dotenv.config();

const tableName = process.env.TABLE_NAME;

interface Message {
    id: string;
    message: string;
    timestamp: string;
}

interface ParamsProps {
    TableName: string;
    Item: Message;
}

// Create a new chat message
export async function createMessage(body: any): Promise<APIGatewayProxyResult> {
    const { message, userId, username } = body;

    if (!message || !userId || !username) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Missing required fields",
                success: false,
            }),
        };
    }

    const params = {
        TableName: tableName,
        Item: {
            id: Date.now().toString(),
            message: message,
            userId: userId,
            username: username,
            timestamp: new Date().toISOString(),
        },
    } as ParamsProps;

    await dynamoDb.put(params).promise();

    return {
        statusCode: 201,
        body: JSON.stringify({
            message: "Message created successfully",
            success: true,
        }),
    };
}

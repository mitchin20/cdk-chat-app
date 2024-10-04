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

// Delete a message
export async function deleteMessage(
    id: string,
    userId: string
): Promise<APIGatewayProxyResult> {
    if (!id || !userId) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: "Missing required fields",
                success: false,
            }),
        };
    }

    const getParams = {
        TableName: tableName,
        Key: {
            id: id,
        },
    } as ParamsWithId;

    const existingMessage = await dynamoDb.get(getParams).promise();
    if (!existingMessage.Item) {
        return {
            statusCode: 404,
            body: JSON.stringify({
                message: "Message not found",
                success: false,
            }),
        };
    }

    if (existingMessage.Item.userId !== userId) {
        return {
            statusCode: 403,
            body: JSON.stringify({
                message: "Not authorized to delete this message",
                success: false,
            }),
        };
    }

    const params = {
        TableName: tableName,
        Key: {
            id: id,
        },
    } as ParamsWithId;

    await dynamoDb.delete(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({
            success: true,
            message: "Message deleted successfully",
        }),
    };
}

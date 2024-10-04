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

interface UpdateParams {
    TableName: string;
    Key: {
        id: string;
        message: string;
    };
    UpdateExpression: string;
    ExpressionAttributeValues: {
        ":message": string;
    };
    returnValues: string;
}

// Update a message
export async function updateMessage(body: any): Promise<APIGatewayProxyResult> {
    const { id, message, userId } = body;

    if (!id || !message || !userId) {
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
                message: "Not authorized to update this message",
                success: false,
            }),
        };
    }

    const params = {
        TableName: tableName,
        Key: {
            id: id,
            message: message,
        },
        UpdateExpression: "SET message = :message",
        ExpressionAttributeValues: {
            ":message": message,
        },
        returnValues: "UPDATE_NEW",
    } as UpdateParams;

    const data = await dynamoDb.update(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({
            success: true,
            data,
            message: "Message updated successfully",
        }),
    };
}

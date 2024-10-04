import dotenv from "dotenv";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { createMessage } from "../../services/chat/createMessage";
import { getMessage } from "../../services/chat/getMessage";
import { getMessages } from "../../services/chat/getMessages";
import { updateMessage } from "../../services/chat/updateMessage";
import { deleteMessage } from "../../services/chat/deleteMessage";

dotenv.config();

interface PathParamsProps {
    id?: string;
}

export const handler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    try {
        const method = event.httpMethod;
        const pathParams: PathParamsProps | null = event.pathParameters;

        const body = event.body ? JSON.parse(event.body) : null;
        const userId = body?.userId || event.queryStringParameters?.userId;

        switch (method) {
            case "POST":
                return await createMessage(body);
            case "GET":
                if (pathParams && pathParams.id) {
                    return await getMessage(pathParams.id);
                }
                return await getMessages();
            case "PUT":
                return await updateMessage(body);
            case "DELETE":
                if (pathParams && pathParams.id) {
                    return await deleteMessage(pathParams.id, userId);
                }
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        message: "Bad Request",
                        success: false,
                    }),
                };
            default:
                return {
                    statusCode: 405,
                    body: JSON.stringify({
                        message: "Method Not Allowed",
                        success: false,
                    }),
                };
        }
    } catch (error) {
        console.error("Error storing message in DynamoDB", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Error storing message in DynamoDB",
                success: false,
            }),
        };
    }
};

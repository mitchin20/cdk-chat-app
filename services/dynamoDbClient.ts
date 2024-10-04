import { DynamoDB } from "aws-sdk";

// Create a single DynamoDB DocumentClient instance for reuse
const dynamoDb = new DynamoDB.DocumentClient({
    region: process.env.AWS_REGION || "us-east-1",
});

export default dynamoDb;

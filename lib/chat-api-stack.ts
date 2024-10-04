import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { HttpApi, HttpMethod } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpLambdaIntegration } from "aws-cdk-lib/aws-apigatewayv2-integrations";
import { Function } from "aws-cdk-lib/aws-lambda";

export class ChatApiStack extends cdk.Stack {
    constructor(
        scope: Construct,
        id: string,
        chatLambda: Function,
        props?: cdk.StackProps
    ) {
        super(scope, id, props);

        const httpApi = new HttpApi(this, "ChatApi", {
            apiName: "ChatServiceApi",
            description: "Chat Service HTTP API",
        });

        const lambdaIntegration = new HttpLambdaIntegration(
            "ChatLambdaIntegration",
            chatLambda
        );

        httpApi.addRoutes({
            path: "/messsages",
            methods: [HttpMethod.POST, HttpMethod.GET],
            integration: lambdaIntegration,
        });

        httpApi.addRoutes({
            path: "/messages/{id}",
            methods: [HttpMethod.PUT, HttpMethod.DELETE],
            integration: lambdaIntegration,
        });
    }
}

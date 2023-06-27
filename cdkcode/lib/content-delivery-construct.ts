/* En este construct se crearán todos los recursos asociados a la entrega de contenido */

import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct,  } from 'constructs';
import { OriginAccessIdentity} from "aws-cdk-lib/aws-cloudfront";
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import { Duration } from "aws-cdk-lib/core";
import { Stack,CfnOutput } from 'aws-cdk-lib';

export interface ContentDeliveryConstructProps {
    /** props needed to work **/
    frontendBucket: s3.Bucket,
    backendApi: apigw.RestApi; 

  }

export class ContentDeliveryConstruct extends Construct {

  constructor(scope: Construct, id: string, props: ContentDeliveryConstructProps) {
    super(scope, id);

    // Se crear un OAI que otorga acceso de lectura
    const originAccessIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity');
    props.frontendBucket.grantRead(originAccessIdentity);

    // Se crea una distribución en Cloudfront para el acceso a S3
    const cloudfrontDistribution = new cloudfront.CloudFrontWebDistribution(this, 'Distribution', {
        defaultRootObject: 'index.html',
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
        originConfigs: [
          {
            customOriginSource: {
              domainName: `${props.backendApi.restApiId}.execute-api.${Stack.of(this).region}.amazonaws.com`,
              originPath: `/${props.backendApi.deploymentStage.stageName}`
            },
            behaviors: [
              {
                pathPattern: "/api/*", // CloudFront will forward `/api/*` to the backend so make sure all your routes are prepended with `/api/`
                allowedMethods: cloudfront.CloudFrontAllowedMethods.ALL,
                defaultTtl: Duration.seconds(0),
                forwardedValues: {
                  queryString: true,
                  headers: ["Authorization"], // By default CloudFront will not forward any headers through so if your API needs authentication make sure you forward auth headers across
                },
              },
            ],
          },
          {
            s3OriginSource: {
              s3BucketSource: props.frontendBucket,
              originAccessIdentity: originAccessIdentity,
            },
            behaviors: [
              {
                compress: true,
                isDefaultBehavior: true,
                defaultTtl: Duration.seconds(0),
                allowedMethods: cloudfront.CloudFrontAllowedMethods.GET_HEAD_OPTIONS,
              },
            ],
          },
        ]
      })

      new CfnOutput(this, "ApiUrl", { value: `${props.backendApi.restApiId}.execute-api.${Stack.of(this).region}.amazonaws.com` });
  }
}
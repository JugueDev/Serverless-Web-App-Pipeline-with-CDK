/* En este construct se crearán todos los recursosasociados al frontend de la aplicación */

import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct,  } from 'constructs';
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import {Distribution, OriginAccessIdentity} from "aws-cdk-lib/aws-cloudfront";
import {S3Origin} from "aws-cdk-lib/aws-cloudfront-origins";


export class FrontendConstruct extends Construct {
  public readonly frontendBucket: s3.Bucket; 

  constructor(scope: Construct, id: string) {
    super(scope, id);
    
    // Bucket donde se almacenarán los archivos 
    this.frontendBucket = new s3.Bucket(this, "frontend-bucket-id", {
        bucketName: "serverless-wep-app-test-jagr",
        accessControl: s3.BucketAccessControl.PRIVATE
        });

    // Se copian los archivos frontend al bocket
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
        sources: [s3deploy.Source.asset('../assets/frontend')],
        destinationBucket: this.frontendBucket,
        destinationKeyPrefix: '', 
      });

    // Se crear un OAI que otorga acceso de lectura
    const originAccessIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity');
    this.frontendBucket.grantRead(originAccessIdentity);

    // Se crea una distribución en Cloudfront para el acceso a S3
    const cloudfrontDistribution = new Distribution(this, 'Distribution', {
        defaultRootObject: 'index.html',
        defaultBehavior: {
          origin: new S3Origin(this.frontendBucket, {originAccessIdentity}),
        },
      })
  }
}
/* En este construct se crearán todos los recursos asociados a la entrega de contenido */

import * as s3 from "aws-cdk-lib/aws-s3";
import { Construct,  } from 'constructs';
import {Distribution, OriginAccessIdentity} from "aws-cdk-lib/aws-cloudfront";
import {S3Origin} from "aws-cdk-lib/aws-cloudfront-origins";

export interface ContentDeliveryConstructProps {
    /** props needed to work **/
    frontendBucket: s3.Bucket,
  }

export class ContentDeliveryConstruct extends Construct {

  constructor(scope: Construct, id: string, props: ContentDeliveryConstructProps) {
    super(scope, id);

    // Se crear un OAI que otorga acceso de lectura
    const originAccessIdentity = new OriginAccessIdentity(this, 'OriginAccessIdentity');
    props.frontendBucket.grantRead(originAccessIdentity);

    // Se crea una distribución en Cloudfront para el acceso a S3
    const cloudfrontDistribution = new Distribution(this, 'Distribution', {
        defaultRootObject: 'index.html',
        defaultBehavior: {
          origin: new S3Origin(props.frontendBucket, {originAccessIdentity}),
        },
      })
  }
}
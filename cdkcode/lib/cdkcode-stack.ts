import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { BackendConstruct } from './backend-construct';
import { FrontendConstruct } from './frontend-construct';
import { ContentDeliveryConstruct } from './content-delivery-construct';

export class CdkcodeStack extends Stack {

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const backendConstruct = new BackendConstruct(this, 'backendConstruct');
    const frontendConstruct = new FrontendConstruct(this, 'frontendConstruct');
    const contentDeliveryConstruct = new ContentDeliveryConstruct(
      this,
      'contentDeliveryConstruct', 
      {
        frontendBucket: frontendConstruct.frontendBucket
      })

  }
}
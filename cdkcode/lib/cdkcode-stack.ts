import { Stack, StackProps } from 'aws-cdk-lib';
import { BackendStack } from './backend-stack';
import { Construct } from 'constructs';

export class CdkcodeStack extends Stack {

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bootstrapStack = new BackendStack(this, 'backendStack');

  }
}
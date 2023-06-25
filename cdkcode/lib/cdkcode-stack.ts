import { Stack, StackProps } from 'aws-cdk-lib';
import { BackendConstruct } from './backend-construct';
import { Construct } from 'constructs';

export class CdkcodeStack extends Stack {

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const backendConstruct = new BackendConstruct(this, 'backendConstruct');

  }
}
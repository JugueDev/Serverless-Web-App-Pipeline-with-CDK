/* En este construct se crearán todos los recursos asociados al backend de la aplicación */

import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct,  } from 'constructs';
import * as path from 'path';
import * as iam from "aws-cdk-lib/aws-iam";

export class BackendConstruct extends Construct {

  constructor(scope: Construct, id: string) {
    super(scope, id);

    
    // Creamos un rol para asignarlo a la función lambda
    const lambdaRole = new iam.Role(this, "lambda-invoke-role-id", {
        assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
        roleName: "Lambda-Backend-Role",
        description: "Rol de IAM para que las funciones lambda puedan ejecutarse.",
      });
  

      // Añademos un Managed Policy al rol de IAM
      lambdaRole.addManagedPolicy(
        iam.ManagedPolicy.fromAwsManagedPolicyName(
            'service-role/AWSLambdaBasicExecutionRole', // from the arn after policy
          )
      );

    // Se define una función Lambda 
    const averageLambda = new lambda.Function(this, 'backend-average-lambda', {
        runtime: lambda.Runtime.PYTHON_3_9,
        handler: 'function.handler',
        functionName: "backend-average-lambda",
        code: lambda.Code.fromAsset(path.join(__dirname, "/../../assets/backend/average")), // frombucket requires zip file
        role: lambdaRole,
      });

    
  }
}
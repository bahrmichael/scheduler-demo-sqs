import type { AWS } from '@serverless/typescript';

import {sendMessage, receiveMessage, reportLostMessages} from './src/functions';

const serverlessConfiguration: AWS = {
  service: 'scheduler-demo-sqs',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    },
    logRetentionInDays: 14
  },
  plugins: ['serverless-webpack', 'serverless-iam-roles-per-function', 'serverless-plugin-log-retention'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: '${env:STAGE, "dev"}',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  functions: { sendMessage, receiveMessage, reportLostMessages },
  resources: {
    Resources: {
      MessagesTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          BillingMode: 'PAY_PER_REQUEST',
          KeySchema: [{
            AttributeName: 'pk',
            KeyType: 'HASH'
          }],
          AttributeDefinitions: [{
            AttributeName: 'pk',
            AttributeType: 'S'
          }],
          TimeToLiveSpecification: {
            AttributeName: 'timeToLive',
            Enabled: true,
          },
          StreamSpecification: {
            StreamViewType: 'NEW_IMAGE'
          },
        }
      },
      ReceiveQueue: {
        Type: 'AWS::SQS::Queue',
      },
      SchedulerPolicy: {
        Type : "AWS::SQS::QueuePolicy",
        Properties : {
          Queues :  [{Ref: 'ReceiveQueue'}],
          PolicyDocument: {
            Statement:[{
              Action:["sqs:SendMessage"],
              Effect:"Allow",
              Resource: {'Fn::GetAtt': ['ReceiveQueue', 'Arn']},
              Principal: {
                AWS: ["710154449298"]
              }
            }]
          }
        }
      }

    }
  }
}

module.exports = serverlessConfiguration;

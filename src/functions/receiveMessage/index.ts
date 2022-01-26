export default {
  handler: `${__dirname.split(process.cwd())[1].substring(1)}/handler.main`,
  events: [
    {
      sqs: {
        arn: {'Fn::GetAtt': ['ReceiveQueue', 'Arn']}
      }
    }
  ],
  environment: {
    MESSAGES_TABLE: {Ref: 'MessagesTable'},
  },
  iamRoleStatements: [
    {
      Effect: 'Allow',
      Action: ['dynamodb:UpdateItem', 'dynamodb:GetItem'],
      Resource: {'Fn::GetAtt': ['MessagesTable', 'Arn']}
    },
  ],
}

# Scheduler Demo SQS

This repository is a demo of how one can use the [Point In Time Scheduler](https://point-in-time-scheduler.com) with an Amazon SQS queue.

## Prerequisites

To deploy this demo app, you need an AWS account, have `yarn` or `npm` installed on your machine, and have
an AWS profile that the [serverless framework](https://www.serverless.com/framework/docs/getting-started) 
can assume to deploy the application. 

You will also need to [sign in at the Point In Time Scheduler Dashboard](https://app.point-in-time-scheduler.com).

## 1. Deploy the Demo

1. Run `yarn` or `npm install` to install the required dependencies
2. Run `yarn deploy` or `npm run deploy` to deploy the demo app to your AWS account
3. When the deployment finishes, go to the [AWS CloudFormation service](https://console.aws.amazon.com/cloudformation), identify the stack, and copy the Queue URL. You will need this later.

![Queue URL](https://github.com/bahrmichael/scheduler-demo-rest/blob/main/docs/img/terminal.png)

## 2. Register the Application

[Sign in at the Point In Time Scheduler Dashboard](https://app.point-in-time-scheduler.com) and register your first application.

![register your first application](https://github.com/bahrmichael/scheduler-demo-rest/blob/main/docs/img/register-1.png)

In the first step choose the integration type Amazon SQS. Then click on next.

![choose the integration type SQS](https://github.com/bahrmichael/scheduler-demo-sqs/blob/main/docs/img/register-2.png)

In the next step enter the URL of the queue for receiving messages. You can find it in the CloudFormation stack of your deployed application.

![enter the URL of the queue](https://github.com/bahrmichael/scheduler-demo-sqs/blob/main/docs/img/register-3.png)

In the following step you see the required resource policy. You must attach this to your queue so that the scheduler
has permission to send messages to your queue.

![specify the authentication](https://github.com/bahrmichael/scheduler-demo-sqs/blob/main/docs/img/register-4.png)

Give your app a name and description, something like "Demo App" is enough to later remember what this was for. The
description is optional.

![Give your app a name and description](https://github.com/bahrmichael/scheduler-demo-rest/blob/main/docs/img/register-5.png)

In the last step generate an API key. The demo app will need this to call the scheduler. Copy the application id and api key.

![Generate api key](https://github.com/bahrmichael/scheduler-demo-rest/blob/main/docs/img/register-6.png)

## 3. Plug in the App ID and API key

You can provide the id and key via environment variables. Assuming you have the App ID "123" and API key "S3crEt", run
`APP_ID=123 API_KEY=S3crEt yarn deploy`. You may have to put `""` around your API key.

Wait for the deployment to complete, then open your AWS Console and navigate to CloudWatch Metrics.

After a few minutes, a new namespace called "SchedulerDemoSQS" will appear. You should see more messages being sent than received initially.
The demo schedules them for a random point in time over the next 30 minutes.

You can modify the number of messages per minute with the environment variable `MESSAGES_PER_MINUTE`. Example: `MESSAGES_PER_MINUTE=10 APP_ID=123 API_KEY=S3crEt yarn deploy`

## Feedback

Please use the GitHub issues of this repo to provide feedback, or use [this form](https://zipmessage.com/gwcyvrb1).
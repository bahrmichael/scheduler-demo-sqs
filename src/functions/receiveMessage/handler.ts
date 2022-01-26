import 'source-map-support/register';
import * as DynamoDB from 'aws-sdk/clients/dynamodb';
import {metricScope} from "aws-embedded-metrics";

import {SQSEvent} from "aws-lambda";

const ddb = new DynamoDB.DocumentClient();

const {MESSAGES_TABLE} = process.env;

async function setMessageReceived(pk: string): Promise<void> {
    await ddb.update({
        TableName: MESSAGES_TABLE,
        Key: {
            pk,
        },
        UpdateExpression: 'set #status = :s',
        ExpressionAttributeNames: {
            '#status': 'status',
        },
        ExpressionAttributeValues: {
            ':s': 'RECEIVED'
        }
    }).promise();
}

async function getMessage(pk: string): Promise<any> {
    return (await ddb.get({
        TableName: MESSAGES_TABLE,
        Key: {pk}
    }).promise()).Item;
}

export const main = metricScope(metrics => async (event: SQSEvent) => {

    const received = new Date().getTime();

    metrics.setNamespace("SchedulerDemoSQS");
    metrics.putMetric("ReceiveMessages", 1, "Count");

    for (const record of event.Records) {
        const {body} = record;

        console.log('Received event', body);

        const {scheduledAt} = JSON.parse(body);

        // Record metrics about how late the message was.
        const {sendAt: expectedArrival} = await getMessage(scheduledAt);
        const arrivalDelay = received - new Date(expectedArrival).getTime();
        metrics.putMetric("ArrivalDelay", arrivalDelay, "Milliseconds");

        // Mark the message as received, for later metrics about lost messages.
        await setMessageReceived(scheduledAt);
    }
});

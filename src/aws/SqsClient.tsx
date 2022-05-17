import {
  CreateQueueCommand,
  DeleteQueueCommand,
  GetQueueAttributesCommand,
  ListQueuesCommand,
  PurgeQueueCommand,
  ReceiveMessageCommand,
  SendMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";
import { SqsMessage } from "../types";

const {
  REACT_APP_AWS_REGION: AWS_REGION,
  REACT_APP_AWS_ACCESS_KEY_ID: AWS_ACCESS_KEY_ID,
  REACT_APP_AWS_SECRET_ACCESS_KEY: AWS_SECRET_ACCESS_KEY,
  REACT_APP_SQS_ENDPOINT: SQS_ENDPOINT,
} = process.env;

const sqsClient = new SQSClient({
  region: AWS_REGION || "eu-central-1",
  endpoint: SQS_ENDPOINT || "http://localhost:4566",
  tls: (SQS_ENDPOINT && SQS_ENDPOINT.indexOf("https://") === 0) || false,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID || "key",
    secretAccessKey: AWS_SECRET_ACCESS_KEY || "secret",
  },
});

export const fetchQueues = async () => {
  const command = new ListQueuesCommand({});
  return sqsClient.send(command);
};

export const getQueueAttribute = async (queueUrl: string) => {
  const command = new GetQueueAttributesCommand({
    QueueUrl: queueUrl,
    AttributeNames: ["All"],
  });
  return sqsClient.send(command);
};

export const receiveMessage = async (queueUrl: string) => {
  const command = new ReceiveMessageCommand({
    QueueUrl: queueUrl,
    AttributeNames: ["All"],
    MaxNumberOfMessages: 10,
    VisibilityTimeout: 0,
    WaitTimeSeconds: 0,
  });
  return sqsClient.send(command);
};

export const purgeQueue = async (queueUrl: string) => {
  const command = new PurgeQueueCommand({
    QueueUrl: queueUrl,
  });
  sqsClient.send(command);
};

export const deleteQueue = async (queueUrl: string) => {
  const command = new DeleteQueueCommand({
    QueueUrl: queueUrl,
  });
  sqsClient.send(command);
};

export const createQueue = async (queueName: string) => {
  const command = new CreateQueueCommand({
    QueueName: queueName,
  });
  sqsClient.send(command);
};

export const sendMessage = async (queueUrl: string, message: SqsMessage) => {
  const command = new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: message.MessageBody,
    MessageAttributes: message.MessageAttributes,
  });
  sqsClient.send(command);
};

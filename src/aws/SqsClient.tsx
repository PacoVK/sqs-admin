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

const sqsClient = new SQSClient({
  region: "eu-central-1",
  endpoint: "http://localhost:4566",
  tls: false,
  credentials: {
    accessKeyId: "key",
    secretAccessKey: "secret",
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

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

export const sendMessage = async (queueUrl: string, message: SqsMessage) => {
  const command = new SendMessageCommand({
    QueueUrl: queueUrl,
    MessageBody: message.messageBody,
  });
  sqsClient.send(command);
};

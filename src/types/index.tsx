import { AlertColor } from "@mui/material";
import { MessageAttributeValue } from "@aws-sdk/client-sqs";

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface CreateQueueDialogProps {
  onSubmit: (queueName: string) => void;
}

export interface SendMessageDialogProps {
  onSubmit: (message: SqsMessage) => void;
}

export interface AlertProps {
  message: any;
  severity: AlertColor;
  onClose: () => void;
}

export interface Queue {
  Attributes: { [key: string]: string } | undefined;
  QueueUrl: string;
  QueueName: string;
}

export interface SqsMessage {
  MessageBody: string;
  MessageAttributes?: { [key: string]: MessageAttributeValue } | undefined;
}

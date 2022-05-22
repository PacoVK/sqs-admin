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
  disabled: boolean;
}

export interface AlertProps {
  message: any;
  severity: AlertColor;
  onClose: () => void;
}

export interface Queue {
  QueueUrl: string;
  QueueName: string;
  QueueAttributes?: { [key: string]: string } | undefined;
}

export interface SqsMessage {
  messageBody: string;
  messageId?: string;
  messageAttributes?: { [key: string]: string } | undefined;
}

export interface ApiCall {
  method: string;
  action?: "CreateQueue" | "DeleteQueue" | "PurgeQueue" | "GetMessages";
  queue?: Queue;
  onSuccess: any;
  onError: (error: string) => void;
}

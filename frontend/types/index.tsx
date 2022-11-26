import { AlertColor } from "@mui/material";

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface CreateQueueDialogProps {
  onSubmit: (queue: Queue) => void;
}

export interface SendMessageDialogProps {
  onSubmit: (message: SqsMessage) => void;
  disabled: boolean;
  queue: Queue;
}

export interface AlertProps {
  message: any;
  severity: AlertColor;
  onClose: () => void;
}

export interface Queue {
  QueueName: string;
  QueueUrl?: string;
  QueueAttributes?: { [key: string]: string } | undefined;
}

export interface SqsMessage {
  messageBody: string;
  messageId?: string;
  messageAttributes?:
    | {
        ApproximateFirstReceiveTimestamp?: string;
        ApproximateReceiveCount?: string;
        MessageDeduplicationId?: string;
        MessageGroupId?: string;
        SenderId?: string;
        SentTimestamp?: string;
        SequenceNumber?: string;
      }
    | undefined;
}

export interface ApiCall {
  method: string;
  action?:
    | "CreateQueue"
    | "DeleteQueue"
    | "PurgeQueue"
    | "GetMessages"
    | "SendMessage";
  queue?: Queue;
  message?: any;
  onSuccess: any;
  onError: (error: string) => void;
}

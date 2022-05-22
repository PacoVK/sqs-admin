import React from "react";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { SqsMessage } from "../types";

const toLocaleString = (epochTimeStamp: string) => {
  return new Date(parseInt(epochTimeStamp)).toLocaleString();
};

const MessageItem = (props: { data: SqsMessage }) => {
  return (
    <>
      <Card>
        <CardHeader
          title={`MessageId: ${props.data.messageId}`}
          subheader={`Sent on: ${toLocaleString(
            // @ts-ignore
            props.data.messageAttributes.SentTimestamp
          )}, Received at: ${toLocaleString(
            // @ts-ignore
            props.data.messageAttributes.ApproximateFirstReceiveTimestamp
          )}`}
        />
        <CardContent>
          <Typography component={"span"} variant="body2">
            {props.data.messageBody}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default MessageItem;

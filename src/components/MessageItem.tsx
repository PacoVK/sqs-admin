import React from "react";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";

const toLocaleString = (epochTimeStamp: string) => {
  return new Date(parseInt(epochTimeStamp)).toLocaleString();
}
// @ts-ignore
const MessageItem = (props) => {
  return (
    <>
      <Card>
        <CardHeader
          title={`MessageId: ${props.data.messageId}`}
          subheader={`Sent on: ${
            toLocaleString(props.data.messageAttributes.SentTimestamp)
          }, Received at: ${
            toLocaleString(props.data.messageAttributes.ApproximateFirstReceiveTimestamp)
          }`}
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

import React from "react";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";

// @ts-ignore
const MessageItem = (props) => {
  return (
    <>
      <Card>
        <CardHeader
          title={`MessageId: ${props.message.MessageId}`}
          subheader={`Sent on: ${props.message.Attributes.SentTimestamp} Received at: ${props.message.Attributes.ApproximateFirstReceiveTimestamp}`}
        />
        <CardContent>
          <Typography component={"span"} variant="body2">
            {props.message.Body}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default MessageItem;

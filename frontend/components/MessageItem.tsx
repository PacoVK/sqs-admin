import React from "react";
import { Card, CardContent, CardHeader } from "@mui/material";
import { SqsMessage } from "../types";
import { JSONTree } from "react-json-tree";

const toLocaleString = (epochTimeStamp: string) => {
  return new Date(parseInt(epochTimeStamp)).toLocaleString();
};

const getJsonOrRawData = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
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
          <JSONTree
            data={getJsonOrRawData(props.data.messageBody)}
            keyPath={["message"]}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default MessageItem;

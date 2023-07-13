import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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
            props.data.messageAttributes.SentTimestamp,
          )}, Received at: ${toLocaleString(
            // @ts-ignore
            props.data.messageAttributes.ApproximateFirstReceiveTimestamp,
          )}
          ${
            props.data.messageAttributes?.MessageGroupId
              ? `, MessageGroupId: ${props.data.messageAttributes?.MessageGroupId},
              DeduplicationId: ${props.data.messageAttributes?.MessageDeduplicationId}`
              : ""
          }
          `}
        />
        <CardContent>
          {props.data.messageAttributes?.CustomAttributes ? (
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Message Attributes</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {
                  // @ts-ignore
                  Object.entries(
                    JSON.parse(props.data.messageAttributes.CustomAttributes),
                  ).map(([key, value]) => {
                    return (
                      <Box key={key}>
                        <Divider />
                        <Stack direction="row" sx={{ ml: 0 }} spacing={2}>
                          <Typography>Key: {key}</Typography>
                          <Typography>Value: {value as string}</Typography>
                        </Stack>
                        <Divider />
                      </Box>
                    );
                  })
                }
              </AccordionDetails>
            </Accordion>
          ) : null}

          <Accordion expanded={true}>
            <AccordionDetails sx={{ pt: 1, pb: 1 }}>
              <JSONTree
                data={getJsonOrRawData(props.data.messageBody)}
                keyPath={["message"]}
              />
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>
    </>
  );
};

export default MessageItem;

import React, { useState, useEffect } from "react";
import TabPanel from "../components/TabPanel";
import {
  Alert as MuiAlert,
  AlertTitle,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { Queue, SqsMessage } from "../types";
import CreateQueueDialog from "../components/CreateQueueDialog";
import Alert from "../components/Alert";
import useInterval from "../hooks/useInterval";
import SendMessageDialog from "../components/SendMessageDialog";
import { callApi } from "../api/Http";
import MessageItem from "../components/MessageItem";

const a11yProps = (id: string, index: number) => {
  return {
    key: `queue-${id}-${index}`,
    "aria-controls": `queue-${id}-${index}`,
  };
};

const Overview = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [queues, setQueues] = useState([] as Queue[]);
  const [messages, setMessages] = useState([] as SqsMessage[]);
  const [reload, triggerReload] = useState(true);
  const [error, setError] = useState("");
  const [disabledStatus, setDisabledStatus] = useState(true);

  useInterval(async () => {
    await receiveMessageFromCurrentQueue();
  }, 3000);

  useEffect(() => {
    receiveMessageFromCurrentQueue();
    // eslint-disable-next-line
  }, [queues, tabIndex]);

  useEffect(() => {
    callApi({
      method: "GET",
      onSuccess: (data: Queue[]) => {
        setQueues(data);
        if (data.length > 0) {
          setTabIndex(data.length - 1);
          setDisabledStatus(false);
        } else {
          setTabIndex(0);
          setDisabledStatus(true);
        }
      },
      onError: setError,
    });
  }, [reload]);

  const handleChange = (event: React.SyntheticEvent, newTabIndex: number) => {
    setTabIndex(newTabIndex);
  };

  const receiveMessageFromCurrentQueue = async () => {
    let queueUrl = queues[tabIndex]?.QueueUrl || null;
    if (queueUrl != null) {
      await callApi({
        method: "POST",
        action: "GetMessages",
        queue: queues[tabIndex],
        onSuccess: setMessages,
        onError: setError,
      });
    }
  };

  const createNewQueue = async (queue: Queue) => {
    await callApi({
      method: "POST",
      action: "CreateQueue",
      queue: queue,
      onSuccess: () => {
        setTimeout(() => {
          triggerReload(!reload);
        }, 1000);
      },
      onError: setError,
    });
  };

  const purgeCurrentQueue = async () => {
    await callApi({
      method: "POST",
      action: "PurgeQueue",
      queue: queues[tabIndex],
      onSuccess: () => {
        setMessages([]);
      },
      onError: setError,
    });
  };

  const deleteCurrentQueue = async () => {
    await callApi({
      method: "POST",
      action: "DeleteQueue",
      queue: queues[tabIndex],
      onSuccess: () => {
        setMessages([]);
        setTimeout(() => {
          triggerReload(!reload);
        }, 1000);
      },
      onError: setError,
    });
  };

  const sendMessageToCurrentQueue = async (message: SqsMessage) => {
    let queueUrl = queues[tabIndex]?.QueueUrl || null;
    if (queueUrl !== null) {
      if (
        queues[tabIndex]?.QueueName.endsWith(".fifo") &&
        !message.messageGroupId
      ) {
        setError(
          "You need to set a MessageGroupID when sending Messages to a FIFO queue"
        );
        return;
      }
      await callApi({
        method: "POST",
        action: "SendMessage",
        queue: queues[tabIndex],
        message: message,
        onSuccess: () => {},
        onError: setError,
      });
    } else {
      setError("Could not send message to non-existent queue");
    }
  };

  return (
    <>
      <Container maxWidth="md" sx={{ marginY: "15px" }}>
        <Typography variant="h4">SQS Admin UI</Typography>
      </Container>
      <Container
        maxWidth="md"
        sx={{
          marginY: "15px",
          display: "grid",
          gap: 1,
          gridTemplateColumns: "repeat(4, 1fr)",
        }}
      >
        <CreateQueueDialog onSubmit={createNewQueue} />
        <Button
          variant="contained"
          disabled={disabledStatus}
          onClick={deleteCurrentQueue}
        >
          Delete Queue
        </Button>
        <SendMessageDialog
          disabled={disabledStatus}
          onSubmit={sendMessageToCurrentQueue}
          queue={queues[tabIndex]}
        />
        <Button
          variant="contained"
          disabled={disabledStatus}
          onClick={purgeCurrentQueue}
        >
          Purge Queue
        </Button>
      </Container>
      {error !== "" ? (
        <Container maxWidth="md">
          <Alert
            message={error}
            severity={"error"}
            onClose={() => setError("")}
          />
        </Container>
      ) : null}
      {queues?.length === 0 ? (
        <Container maxWidth="md">
          <MuiAlert severity="info">
            <AlertTitle>No Queue</AlertTitle>
            No Queues exist in region (default was "eu-central-1")
          </MuiAlert>
        </Container>
      ) : (
        <Container maxWidth="md">
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabIndex}
              onChange={handleChange}
              aria-label="SQS overview"
            >
              {queues?.map((queue, index) => (
                <Tab label={queue.QueueName} {...a11yProps("tab", index)} />
              ))}
            </Tabs>
          </Box>
          {queues?.map((queue, index) => (
            <TabPanel
              value={tabIndex}
              index={index}
              {...a11yProps("tabpanel", index)}
            >
              <Grid container spacing={2}>
                {messages?.map((message, index) => (
                  <Grid item xs={12} {...a11yProps("gridItem", index)}>
                    <Paper>
                      <MessageItem
                        data={message}
                        {...a11yProps("messageItem", index)}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
          ))}
        </Container>
      )}
    </>
  );
};

export default Overview;

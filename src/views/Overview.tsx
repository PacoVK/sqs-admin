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
import {
  createQueue,
  deleteQueue,
  fetchQueues,
  getQueueAttribute,
  purgeQueue,
  receiveMessage,
  sendMessage,
} from "../aws/SqsClient";
import { Queue, SqsMessage } from "../types";
import { Message } from "@aws-sdk/client-sqs";
import MessageItem from "../components/MessageItem";
import CreateQueueDialog from "../components/CreateQueueDialog";
import Alert from "../components/Alert";
import useInterval from "../hooks/useInterval";
import SendMessageDialog from "../components/SendMessageDialog";

const { REACT_APP_AWS_REGION: AWS_REGION } = process.env;

const a11yProps = (id: string, index: number) => {
  return {
    key: `queue-${id}-${index}`,
    "aria-controls": `queue-${id}-${index}`,
  };
};

const Overview = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [queues, setQueues] = useState([] as Queue[]);
  const [messages, setMessages] = useState([] as Message[]);
  const [reload, triggerReload] = useState(true);
  const [error, setError] = useState("");

  useInterval(async () => {
    await receiveMessageFromCurrentQueue();
  }, 2000);

  useEffect(() => {
    receiveMessageFromCurrentQueue();
    // eslint-disable-next-line
  }, [queues, tabIndex]);

  useEffect(() => {
    fetchQueues()
      .then((result) => {
        const { QueueUrls = [] } = result;
        const promises = QueueUrls.map((QueueUrl) => {
          return getQueueAttribute(QueueUrl).then(({ Attributes }) => {
            const arnParts = Attributes?.QueueArn.split(":") || [];
            return {
              Attributes,
              QueueUrl,
              QueueName: arnParts[arnParts.length - 1],
            };
          });
        });
        Promise.all(promises).then((res) => {
          setQueues(res);
        });
      })
      .catch((error) => {
        setError(error.message);
      });
  }, [reload]);

  const handleChange = async (
    event: React.SyntheticEvent,
    newTabIndex: number
  ) => {
    setTabIndex(newTabIndex);
  };

  const receiveMessageFromCurrentQueue = async () => {
    var queueUrl = queues[tabIndex]?.QueueUrl || null;
    if (queueUrl != null) {
      receiveMessage(queueUrl).then((result) => {
        setMessages(result.Messages || []);
      });
    }
  };

  const createNewQueue = async (queueName: string) => {
    createQueue(queueName)
      .then(() => {
        setTimeout(() => {
          triggerReload(!reload);
        }, 1000);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const purgeCurrentQueue = async () => {
    purgeQueue(queues[tabIndex].QueueUrl)
      .then(() => {
        setMessages([]);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const deleteCurrentQueue = async () => {
    deleteQueue(queues[tabIndex].QueueUrl)
      .then(() => {
        setTimeout(() => {
          triggerReload(!reload);
        }, 1000);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const sendMessageToCurrentQueue = async (message: SqsMessage) => {
    var queueUrl = queues[tabIndex]?.QueueUrl || null;
    if (queueUrl !== null) {
      sendMessage(queueUrl, message).catch((error) => {
        setError(error.message);
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
        <Button variant="contained" onClick={deleteCurrentQueue}>
          Delete Queue
        </Button>
        <SendMessageDialog onSubmit={sendMessageToCurrentQueue} />
        <Button variant="contained" onClick={purgeCurrentQueue}>
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
      {queues.length === 0 ? (
        <Container maxWidth="md">
          <MuiAlert severity="info">
            <AlertTitle>No Queue</AlertTitle>
            No Queues exist in region {AWS_REGION}
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
              {queues.map((queue, index) => (
                <Tab label={queue.QueueName} {...a11yProps("tab", index)} />
              ))}
            </Tabs>
          </Box>
          {queues.map((queue, index) => (
            <TabPanel
              value={tabIndex}
              index={index}
              {...a11yProps("tabpanel", index)}
            >
              <Grid container spacing={2}>
                {messages.map((message, index) => (
                  <Grid item xs={12} {...a11yProps("gridItem", index)}>
                    <Paper>
                      <MessageItem
                        message={message}
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

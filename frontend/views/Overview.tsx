import React, { useState, useEffect } from "react";
import TabPanel from "../components/TabPanel";
import {
  Alert as MuiAlert,
  AlertTitle,
  Button,
  Container,
  Divider,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import { AwsRegion, Queue, SqsMessage } from "../types";
import CreateQueueDialog from "../components/CreateQueueDialog";
import Alert from "../components/Alert";
import useInterval from "../hooks/useInterval";
import SendMessageDialog from "../components/SendMessageDialog";
import { callApi } from "../api/Http";
import MessageItem from "../components/MessageItem";
import QueueIcon from "@mui/icons-material/CalendarViewWeek";
import Box from "@mui/material/Box";
import SidebarResizeHandle from "../components/SidebarResizeHandle";
import useResizableSidebar, {
  SIDEBAR_CONTAINER,
  SIDEBAR_WIDTH_VAR,
} from "../hooks/useResizableSidebar";

const a11yProps = (id: string, index: number) => {
  return {
    "aria-controls": `queue-${id}-${index}`,
  };
};

const Overview = () => {
  const [listItemIndex, setListItemIndex] = useState(0);
  const [queues, setQueues] = useState([] as Queue[]);
  const [messages, setMessages] = useState([] as SqsMessage[]);
  const [reload, triggerReload] = useState(true);
  const [error, setError] = useState("");
  const [disabledStatus, setDisabledStatus] = useState(true);
  const [region, setRegion] = useState({ region: "" } as AwsRegion);
  const {
    width: sidebarWidth,
    resizing,
    containerRef,
    separatorProps,
  } = useResizableSidebar();

  useInterval(async () => {
    await receiveMessageFromCurrentQueue();
  }, 3000);

  useEffect(() => {
    receiveMessageFromCurrentQueue();
    // eslint-disable-next-line
  }, [queues, listItemIndex]);

  useEffect(() => {
    receiveRegion();
  }, []);

  useEffect(() => {
    callApi({
      method: "GET",
      onSuccess: (data: Queue[]) => {
        setQueues(data);
        if (data.length > 0) {
          setListItemIndex(data.length - 1);
          setDisabledStatus(false);
        } else {
          setListItemIndex(0);
          setDisabledStatus(true);
        }
      },
      onError: setError,
    });
  }, [reload]);

  const selectQueue = (event: React.MouseEvent<HTMLLIElement, MouseEvent>) => {
    setListItemIndex(event.currentTarget.value);
  };

  const receiveMessageFromCurrentQueue = async () => {
    let queueUrl = queues[listItemIndex]?.QueueUrl || null;
    if (queueUrl != null) {
      await callApi({
        method: "POST",
        action: "GetMessages",
        queue: queues[listItemIndex],
        onSuccess: setMessages,
        onError: setError,
      });
    }
  };

  const receiveRegion = async () => {
    await callApi({
      method: "POST",
      action: "GetRegion",
      onSuccess: setRegion,
      queue: { QueueName: "" } as Queue,
      onError: setError,
    });
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
      queue: queues[listItemIndex],
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
      queue: queues[listItemIndex],
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
    let queueUrl = queues[listItemIndex]?.QueueUrl || null;
    if (queueUrl !== null) {
      if (
        queues[listItemIndex]?.QueueName.endsWith(".fifo") &&
        !message.messageAttributes?.MessageGroupId
      ) {
        setError(
          "You need to set a MessageGroupID when sending Messages to a FIFO queue",
        );
        return;
      }
      await callApi({
        method: "POST",
        action: "SendMessage",
        queue: queues[listItemIndex],
        message: message,
        onSuccess: () => {},
        onError: setError,
      });
    } else {
      setError("Could not send message to non-existent queue");
    }
  };

  return (
    <Box
      ref={containerRef}
      sx={{ display: "flex", [SIDEBAR_WIDTH_VAR]: `${sidebarWidth}px` }}
    >
      <Box>
        <Drawer
          sx={{
            width: `var(${SIDEBAR_WIDTH_VAR})`,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: `var(${SIDEBAR_WIDTH_VAR})`,
              boxSizing: "border-box",
              containerType: "inline-size",
              containerName: SIDEBAR_CONTAINER,
            },
          }}
          variant="permanent"
          anchor="left"
        >
          <List>
            <ListItem sx={{ flexWrap: "wrap", columnGap: 1 }}>
              <Typography variant="h6" margin={"auto"}>
                SQS Admin UI
              </Typography>
              <Typography variant="subtitle2" margin={"auto"}>
                {import.meta.env.REACT_APP_VERSION}
              </Typography>
              <Typography variant="subtitle2" margin={"auto"}>
                {region.region}
              </Typography>
            </ListItem>
            <ListItem>
              <Toolbar
                sx={{
                  gap: 1,
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  [`@container ${SIDEBAR_CONTAINER} (max-width: 340px)`]: {
                    gridTemplateColumns: "1fr",
                    paddingLeft: 1,
                    paddingRight: 1,
                  },
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
                  queue={queues[listItemIndex]}
                />
                <Button
                  variant="contained"
                  disabled={disabledStatus}
                  onClick={purgeCurrentQueue}
                >
                  Purge Queue
                </Button>
              </Toolbar>
            </ListItem>
          </List>
          <Divider />
          <Divider />
          <List>
            {queues?.map((queue, index) => (
              <ListItem
                key={index}
                {...a11yProps("item", index)}
                onClick={selectQueue}
                value={index}
                disablePadding
              >
                <ListItemButton selected={index === listItemIndex}>
                  <ListItemIcon>
                    <QueueIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={queue.QueueName}
                    primaryTypographyProps={{
                      style: {
                        whiteSpace: "pre-wrap",
                        overflowWrap: "break-word",
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </Box>
      <SidebarResizeHandle resizing={resizing} {...separatorProps} />
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Grid size={{ xs: 12 }}>
          <Toolbar>
            <Typography variant="h6" margin={"auto"}>
              Messages
            </Typography>
          </Toolbar>
        </Grid>
        <Grid size={{ xs: 12 }}>
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
                {`No Queues exist in region: ${region.region ? region.region : "eu-central-1"}`}
              </MuiAlert>
            </Container>
          ) : null}
        </Grid>
        <Grid size={{ xs: 12 }}>
          {queues?.map((queue, index) => (
            <TabPanel
              key={index}
              value={listItemIndex}
              index={index}
              {...a11yProps("tabpanel", index)}
            >
              <Grid container spacing={2}>
                {messages?.map((message, index) => (
                  <Grid
                    key={index}
                    size={{ xs: 12 }}
                    {...a11yProps("gridItem", index)}
                  >
                    <Paper>
                      <MessageItem
                        key={index}
                        data={message}
                        {...a11yProps("messageItem", index)}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </TabPanel>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Overview;

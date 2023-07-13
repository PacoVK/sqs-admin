import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Fab,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { SendMessageDialogProps, SqsMessage } from "../types";

const SendMessageDialog = (props: SendMessageDialogProps) => {
  const [open, setOpen] = useState(false);
  const [messageBody, setMessageBody] = useState("");
  const [messageGroupId, setMessageGroupId] = useState("");
  const [messageAttributes, setMessageAttributes] = useState(
    {} as { [key: string]: string },
  );
  const [attributeKey, setAttributeKey] = useState("");
  const [attributeValue, setAttributeValue] = useState("");

  const handleClickOpen = () => {
    setMessageBody("");
    setOpen(true);
    setMessageGroupId("");
  };

  const handleClose = () => {
    setMessageAttributes({});
    setOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageBody(event.target.value);
  };

  const handleGroupIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageGroupId(event.target.value);
  };

  const submitSendRequest = () => {
    let sqsMessage: SqsMessage = {
      messageBody: messageBody,
      messageAttributes: {
        CustomAttributes:
          Object.entries(messageAttributes).length > 0
            ? JSON.stringify(messageAttributes)
            : undefined,
      },
    };
    if (messageGroupId !== "") {
      sqsMessage.messageAttributes = {
        MessageGroupId: messageGroupId,
      };
    }
    props.onSubmit(sqsMessage);
    handleClose();
  };

  return (
    <>
      <Button
        variant="contained"
        disabled={props.disabled}
        onClick={handleClickOpen}
      >
        Send message
      </Button>
      <Dialog fullWidth open={open} onClose={handleClose}>
        <DialogTitle>Send message</DialogTitle>
        <DialogContent>
          <DialogContentText>Please provide a message body.</DialogContentText>
          <TextField
            multiline
            rows={4}
            autoFocus
            margin="dense"
            id="messageBody"
            label="Message-Body"
            type="text"
            fullWidth
            value={messageBody}
            onChange={handleChange}
            variant="standard"
          />
          <TextField
            margin="dense"
            id="messageGroupId"
            label="Message-Group-Id"
            type="text"
            fullWidth
            required={true}
            value={messageGroupId}
            onChange={handleGroupIdChange}
            style={{
              display: props.queue?.QueueName.endsWith(".fifo")
                ? "flex"
                : "none",
            }}
            variant="standard"
          />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Custom Message Attributes
          </Typography>
          <TextField
            margin="dense"
            id="addNewAttribute-key"
            label="Attribute key"
            type="text"
            onChange={(event) => {
              setAttributeKey(event.target.value);
            }}
            fullWidth
            value={attributeKey}
            variant="standard"
          />
          <TextField
            margin="dense"
            id="addNewAttribute-value"
            label="Attribute value"
            type="text"
            onChange={(event) => {
              setAttributeValue(event.target.value);
            }}
            fullWidth
            value={attributeValue}
            variant="standard"
          />
          <Box sx={{ direction: "rtl" }}>
            <Fab
              size="small"
              color="primary"
              aria-label="add"
              sx={{ alignSelf: "end" }}
              onClick={() => {
                if (attributeKey.trim() === "" || attributeValue.trim() === "")
                  return;
                setMessageAttributes({
                  ...messageAttributes,
                  [attributeKey]: attributeValue,
                });
                setAttributeKey("");
                setAttributeValue("");
              }}
            >
              <AddIcon />
            </Fab>
          </Box>
          <Divider sx={{ mt: "1em", mb: "1em" }} />
          {Object.keys(messageAttributes).map((key) => {
            return (
              <Box
                key={key}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <TextField
                  margin="dense"
                  key={key}
                  id={key}
                  label={key}
                  type="text"
                  onChange={(event) => {
                    setMessageAttributes({
                      ...messageAttributes,
                      [key]: event.target.value,
                    });
                  }}
                  fullWidth
                  value={messageAttributes[key]}
                  variant="standard"
                />
                <DeleteIcon
                  sx={{ m: "auto" }}
                  onClick={() => {
                    const { [key]: value, ...newAttributes } =
                      messageAttributes;
                    setMessageAttributes(newAttributes);
                  }}
                />
              </Box>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={submitSendRequest}>Send</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SendMessageDialog;

import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { SendMessageDialogProps } from "../types";

const SendMessageDialog = (props: SendMessageDialogProps) => {
  const [open, setOpen] = useState(false);
  const [messageBody, setMessageBody] = useState("");
  const [messageGroupId, setMessageGroupId] = useState("");

  const handleClickOpen = () => {
    setMessageBody("");
    setOpen(true);
    setMessageGroupId("");
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageBody(event.target.value);
  };

  const handleGroupIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageGroupId(event.target.value);
  };

  const submitSendRequest = () => {
    props.onSubmit({
      messageBody: messageBody,
      messageGroupId: messageGroupId === "" ? undefined : messageGroupId,
    });
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
      <Dialog open={open} onClose={handleClose}>
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

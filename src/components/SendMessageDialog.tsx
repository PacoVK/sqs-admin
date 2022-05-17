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

  const handleClickOpen = () => {
    setMessageBody("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageBody(event.target.value);
  };

  const submitSendRequest = () => {
    props.onSubmit({
      MessageBody: messageBody,
    });
    handleClose();
  };

  return (
    <>
      <Button variant="contained" onClick={handleClickOpen}>
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

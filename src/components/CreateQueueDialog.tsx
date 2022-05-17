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
import { CreateQueueDialogProps } from "../types";

const CreateQueueDialog = (props: CreateQueueDialogProps) => {
  const [open, setOpen] = useState(false);
  const [queueName, setQueueName] = useState("");

  const handleClickOpen = () => {
    setQueueName("");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQueueName(event.target.value);
  };

  const submitCreateQueue = () => {
    props.onSubmit(queueName);
    handleClose();
  };

  return (
    <>
      <Button variant="contained" onClick={handleClickOpen}>
        Create Queue
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create new SQS</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please provide a unique queue name.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Queue-Name"
            type="text"
            fullWidth
            value={queueName}
            onChange={handleChange}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={submitCreateQueue}>Create</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CreateQueueDialog;

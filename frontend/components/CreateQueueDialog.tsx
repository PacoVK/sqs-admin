import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import { CreateQueueDialogProps, Queue } from "../types";

const CreateQueueDialog = (props: CreateQueueDialogProps) => {
  const [open, setOpen] = useState(false);
  const [queueName, setQueueName] = useState("");
  const [isFifoQueue, enableFifoQueue] = useState(false);

  const handleClickOpen = () => {
    setQueueName("");
    enableFifoQueue(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeQueueName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setQueueName(event.target.value);
  };

  const handleChangeFifoSwitch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    enableFifoQueue(event.target.checked);
  };

  const submitCreateQueue = () => {
    let sanitizedQueueName = queueName;
    if (isFifoQueue && !queueName.endsWith(".fifo")) {
      sanitizedQueueName = `${sanitizedQueueName}.fifo`;
    }
    const newQueue: Queue = {
      QueueName: sanitizedQueueName,
      QueueAttributes: {
        FifoQueue: `${isFifoQueue}`,
      },
    };
    props.onSubmit(newQueue);
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
            onChange={handleChangeQueueName}
            variant="standard"
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isFifoQueue}
                  onChange={handleChangeFifoSwitch}
                  inputProps={{ "aria-label": "controlled" }}
                />
              }
              label="FIFO Queue"
            />
          </FormGroup>
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

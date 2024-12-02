import { Collapse, IconButton, Alert as MuiAlert } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { AlertProps } from "../types";

const Alert = (props: AlertProps) => {
  return (
    <Collapse in={props.message !== null}>
      <MuiAlert
        severity={props.severity}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              props.onClose();
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{ mb: 2 }}
      >
        {props.message}
      </MuiAlert>
    </Collapse>
  );
};

export default Alert;

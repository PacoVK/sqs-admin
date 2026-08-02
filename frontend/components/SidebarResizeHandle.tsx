import React from "react";
import Box from "@mui/material/Box";
import { SIDEBAR_WIDTH_VAR } from "../hooks/useResizableSidebar";

const HIT_AREA_WIDTH = 12;

type SidebarResizeHandleProps = React.ComponentPropsWithoutRef<"div"> & {
  resizing: boolean;
};

const SidebarResizeHandle = ({
  resizing,
  ...separatorProps
}: SidebarResizeHandleProps) => (
  <Box
    {...separatorProps}
    data-resizing={resizing}
    sx={{
      position: "fixed",
      top: 0,
      bottom: 0,
      left: `var(${SIDEBAR_WIDTH_VAR})`,
      width: `${HIT_AREA_WIDTH}px`,
      marginLeft: `${-HIT_AREA_WIDTH / 2}px`,
      zIndex: (theme) => theme.zIndex.drawer + 1,
      display: "flex",
      justifyContent: "center",
      cursor: "col-resize",
      touchAction: "none",
      "&:focus-visible": {
        outline: "none",
      },
      "&::after": {
        content: '""',
        width: "2px",
        backgroundColor: "transparent",
        transition: "background-color 120ms ease, width 120ms ease",
      },
      "&:hover::after, &[data-resizing='true']::after": {
        backgroundColor: "primary.main",
      },
      "&:focus-visible::after": {
        width: "4px",
        backgroundColor: "primary.main",
      },
      "@media (prefers-reduced-motion: reduce)": {
        "&::after": {
          transition: "none",
        },
      },
    }}
  />
);

export default SidebarResizeHandle;

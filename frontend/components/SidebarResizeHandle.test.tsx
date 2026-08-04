import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Box from "@mui/material/Box";
import SidebarResizeHandle from "./SidebarResizeHandle";
import useResizableSidebar, {
  DEFAULT_SIDEBAR_WIDTH,
  MAX_SIDEBAR_WIDTH,
  MIN_SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_VAR,
} from "../hooks/useResizableSidebar";

const STORAGE_KEY = "sqs-admin.sidebarWidth";

const Harness = () => {
  const { width, resizing, containerRef, separatorProps } =
    useResizableSidebar();
  return (
    <Box
      ref={containerRef}
      data-testid="container"
      sx={{ display: "flex", [SIDEBAR_WIDTH_VAR]: `${width}px` }}
    >
      <SidebarResizeHandle resizing={resizing} {...separatorProps} />
    </Box>
  );
};

const separator = () =>
  screen.getByRole("separator", { name: "Resize queue list" });

const currentWidth = () => Number(separator().getAttribute("aria-valuenow"));

const cssWidth = () =>
  screen.getByTestId("container").style.getPropertyValue(SIDEBAR_WIDTH_VAR);

const drag = (fromX: number, toX: number) => {
  fireEvent(
    separator(),
    new MouseEvent("pointerdown", {
      clientX: fromX,
      button: 0,
      bubbles: true,
    }),
  );
  act(() => {
    window.dispatchEvent(
      new MouseEvent("pointermove", { clientX: toX, bubbles: true }),
    );
    window.dispatchEvent(
      new MouseEvent("pointerup", { clientX: toX, bubbles: true }),
    );
  });
};

const setViewportWidth = (viewportWidth: number) => {
  Object.defineProperty(window, "innerWidth", {
    value: viewportWidth,
    configurable: true,
    writable: true,
  });
  act(() => {
    window.dispatchEvent(new Event("resize"));
  });
};

beforeEach(() => {
  window.localStorage.clear();
  setViewportWidth(1024);
});

describe("<SidebarResizeHandle /> spec", () => {
  it("starts at the default width", () => {
    render(<Harness />);

    expect(currentWidth()).toBe(DEFAULT_SIDEBAR_WIDTH);
    expect(cssWidth()).toBe(`${DEFAULT_SIDEBAR_WIDTH}px`);
  });

  it("exposes the resize bounds to assistive technology", () => {
    render(<Harness />);

    expect(separator()).toHaveAttribute("aria-orientation", "vertical");
    expect(separator()).toHaveAttribute(
      "aria-valuemin",
      String(MIN_SIDEBAR_WIDTH),
    );
    expect(separator()).toHaveAttribute(
      "aria-valuemax",
      String(MAX_SIDEBAR_WIDTH),
    );
  });

  it("restores the persisted width on mount", () => {
    window.localStorage.setItem(STORAGE_KEY, "300");

    render(<Harness />);

    expect(currentWidth()).toBe(300);
    expect(cssWidth()).toBe("300px");
  });

  it("ignores a corrupted persisted width", () => {
    window.localStorage.setItem(STORAGE_KEY, "not-a-width");

    render(<Harness />);

    expect(currentWidth()).toBe(DEFAULT_SIDEBAR_WIDTH);
  });

  it("clamps a persisted width that no longer fits the viewport", () => {
    window.localStorage.setItem(STORAGE_KEY, "5000");

    render(<Harness />);

    expect(currentWidth()).toBe(MAX_SIDEBAR_WIDTH);
  });

  it("widens the sidebar when the handle is dragged right", () => {
    render(<Harness />);

    drag(DEFAULT_SIDEBAR_WIDTH, DEFAULT_SIDEBAR_WIDTH + 98);

    expect(currentWidth()).toBe(500);
    expect(cssWidth()).toBe("500px");
  });

  it("narrows the sidebar when the handle is dragged left", () => {
    render(<Harness />);

    drag(DEFAULT_SIDEBAR_WIDTH, DEFAULT_SIDEBAR_WIDTH - 102);

    expect(currentWidth()).toBe(300);
  });

  it("keeps the sidebar at least as wide as the minimum", () => {
    render(<Harness />);

    drag(DEFAULT_SIDEBAR_WIDTH, 0);

    expect(currentWidth()).toBe(MIN_SIDEBAR_WIDTH);
  });

  it("keeps the message panel visible when dragged far right", () => {
    render(<Harness />);

    drag(DEFAULT_SIDEBAR_WIDTH, 5000);

    expect(currentWidth()).toBe(MAX_SIDEBAR_WIDTH);
  });

  it("persists the width once the drag ends", () => {
    render(<Harness />);

    drag(DEFAULT_SIDEBAR_WIDTH, DEFAULT_SIDEBAR_WIDTH + 98);

    expect(window.localStorage.getItem(STORAGE_KEY)).toBe("500");
  });

  it("ignores drags started with a non-primary button", () => {
    render(<Harness />);

    fireEvent(
      separator(),
      new MouseEvent("pointerdown", {
        clientX: DEFAULT_SIDEBAR_WIDTH,
        button: 2,
        bubbles: true,
      }),
    );
    act(() => {
      window.dispatchEvent(
        new MouseEvent("pointermove", { clientX: 600, bubbles: true }),
      );
    });

    expect(currentWidth()).toBe(DEFAULT_SIDEBAR_WIDTH);
  });

  it("resizes with the arrow keys", () => {
    render(<Harness />);

    fireEvent.keyDown(separator(), { key: "ArrowRight" });
    expect(currentWidth()).toBe(DEFAULT_SIDEBAR_WIDTH + 16);

    fireEvent.keyDown(separator(), { key: "ArrowLeft" });
    expect(currentWidth()).toBe(DEFAULT_SIDEBAR_WIDTH);
  });

  it("takes larger steps when shift is held", () => {
    render(<Harness />);

    fireEvent.keyDown(separator(), { key: "ArrowRight", shiftKey: true });

    expect(currentWidth()).toBe(DEFAULT_SIDEBAR_WIDTH + 64);
  });

  it("jumps to the bounds with Home and End", () => {
    render(<Harness />);

    fireEvent.keyDown(separator(), { key: "Home" });
    expect(currentWidth()).toBe(MIN_SIDEBAR_WIDTH);

    fireEvent.keyDown(separator(), { key: "End" });
    expect(currentWidth()).toBe(MAX_SIDEBAR_WIDTH);
  });

  it("resets to the default width on double click", () => {
    render(<Harness />);

    fireEvent.keyDown(separator(), { key: "Home" });
    expect(currentWidth()).toBe(MIN_SIDEBAR_WIDTH);

    fireEvent.doubleClick(separator());

    expect(currentWidth()).toBe(DEFAULT_SIDEBAR_WIDTH);
  });

  it("restores the chosen width when the viewport grows back", () => {
    render(<Harness />);

    drag(DEFAULT_SIDEBAR_WIDTH, 600);
    expect(currentWidth()).toBe(600);

    setViewportWidth(700);
    expect(currentWidth()).toBe(700 - 320);

    setViewportWidth(1024);
    expect(currentWidth()).toBe(600);
  });
});

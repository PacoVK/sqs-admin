import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

export const SIDEBAR_WIDTH_VAR = "--sqs-sidebar-width";
export const SIDEBAR_CONTAINER = "sqs-sidebar";
export const DEFAULT_SIDEBAR_WIDTH = 402;
export const MIN_SIDEBAR_WIDTH = 220;
export const MAX_SIDEBAR_WIDTH = 640;
export const MIN_CONTENT_WIDTH = 320;

const STORAGE_KEY = "sqs-admin.sidebarWidth";
const KEYBOARD_STEP = 16;
const KEYBOARD_STEP_COARSE = 64;

const maxWidthForViewport = (viewportWidth: number) =>
  Math.max(
    MIN_SIDEBAR_WIDTH,
    Math.min(MAX_SIDEBAR_WIDTH, viewportWidth - MIN_CONTENT_WIDTH),
  );

const readStoredWidth = () => {
  try {
    const stored = Number.parseInt(
      window.localStorage.getItem(STORAGE_KEY) ?? "",
      10,
    );
    return Number.isFinite(stored) ? stored : DEFAULT_SIDEBAR_WIDTH;
  } catch {
    return DEFAULT_SIDEBAR_WIDTH;
  }
};

const writeStoredWidth = (width: number) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(width));
  } catch {
    // Storage is unavailable, so the width only lasts for this session.
  }
};

const useResizableSidebar = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [preferredWidth, setPreferredWidth] = useState(readStoredWidth);
  const [maxWidth, setMaxWidth] = useState(() =>
    maxWidthForViewport(window.innerWidth),
  );
  const [resizing, setResizing] = useState(false);

  const width = Math.min(Math.max(preferredWidth, MIN_SIDEBAR_WIDTH), maxWidth);

  useLayoutEffect(() => {
    containerRef.current?.style.setProperty(SIDEBAR_WIDTH_VAR, `${width}px`);
  }, [width]);

  useEffect(() => {
    const onViewportResize = () =>
      setMaxWidth(maxWidthForViewport(window.innerWidth));
    window.addEventListener("resize", onViewportResize);
    return () => window.removeEventListener("resize", onViewportResize);
  }, []);

  const commitWidth = useCallback(
    (next: number) => {
      const clamped = Math.round(
        Math.min(Math.max(next, MIN_SIDEBAR_WIDTH), maxWidth),
      );
      setPreferredWidth(clamped);
      writeStoredWidth(clamped);
    },
    [maxWidth],
  );

  const startResize = (event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0) {
      return;
    }

    const handle = event.currentTarget;
    const startX = event.clientX;
    const startWidth = width;
    let draft = width;

    handle.setPointerCapture?.(event.pointerId);
    setResizing(true);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const onPointerMove = (moveEvent: PointerEvent) => {
      draft = Math.round(
        Math.min(
          Math.max(startWidth + moveEvent.clientX - startX, MIN_SIDEBAR_WIDTH),
          maxWidth,
        ),
      );
      containerRef.current?.style.setProperty(SIDEBAR_WIDTH_VAR, `${draft}px`);
      handle.setAttribute("aria-valuenow", String(draft));
    };

    const stopResize = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stopResize);
      window.removeEventListener("pointercancel", stopResize);
      handle.releasePointerCapture?.(event.pointerId);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      setResizing(false);
      commitWidth(draft);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stopResize);
    window.addEventListener("pointercancel", stopResize);
  };

  const resizeByKeyboard = (event: React.KeyboardEvent<HTMLElement>) => {
    const step = event.shiftKey ? KEYBOARD_STEP_COARSE : KEYBOARD_STEP;
    let next: number;

    switch (event.key) {
      case "ArrowLeft":
        next = width - step;
        break;
      case "ArrowRight":
        next = width + step;
        break;
      case "Home":
        next = MIN_SIDEBAR_WIDTH;
        break;
      case "End":
        next = maxWidth;
        break;
      case "Enter":
      case " ":
        next = DEFAULT_SIDEBAR_WIDTH;
        break;
      default:
        return;
    }

    event.preventDefault();
    commitWidth(next);
  };

  return {
    width,
    resizing,
    containerRef,
    separatorProps: {
      role: "separator",
      tabIndex: 0,
      "aria-orientation": "vertical" as const,
      "aria-label": "Resize queue list",
      "aria-valuenow": width,
      "aria-valuemin": MIN_SIDEBAR_WIDTH,
      "aria-valuemax": maxWidth,
      onPointerDown: startResize,
      onKeyDown: resizeByKeyboard,
      onDoubleClick: () => commitWidth(DEFAULT_SIDEBAR_WIDTH),
    },
  };
};

export default useResizableSidebar;

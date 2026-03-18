import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import Overview from "./Overview";
import "@testing-library/jest-dom";

const mockQueues = [
  {
    QueueName: "test-queue",
    QueueUrl: "http://localhost:4566/000000000000/test-queue",
  },
  {
    QueueName: "orders.fifo",
    QueueUrl: "http://localhost:4566/000000000000/orders.fifo",
  },
];

const mockMessages = [
  {
    messageBody: '{"orderId": 1}',
    messageId: "msg-001",
    messageAttributes: {
      SentTimestamp: "1700000000000",
      ApproximateFirstReceiveTimestamp: "1700000001000",
    },
  },
];

let fetchHandler: (url: string, options?: RequestInit) => Promise<Response>;

beforeEach(() => {
  jest.useFakeTimers();

  fetchHandler = jest.fn(async (_url: string, options?: RequestInit) => {
    if (!options || options.method === "GET") {
      return Response.json(mockQueues);
    }
    const body = JSON.parse(options.body as string);
    switch (body.action) {
      case "GetRegion":
        return Response.json({ region: "us-east-1" });
      case "GetMessages":
        return Response.json(mockMessages);
      case "CreateQueue":
        return Response.json({});
      case "DeleteQueue":
        return Response.json({});
      case "PurgeQueue":
        return Response.json({});
      case "SendMessage":
        return Response.json({});
      default:
        return Response.json({});
    }
  });

  global.fetch = fetchHandler as typeof fetch;
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe("<Overview /> spec", () => {
  it("renders sidebar with app title and region", async () => {
    await act(async () => {
      render(<Overview />);
    });
    expect(screen.getByText("SQS Admin UI")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("us-east-1")).toBeInTheDocument();
    });
  });

  it("renders queue list from API", async () => {
    await act(async () => {
      render(<Overview />);
    });
    await waitFor(() => {
      expect(screen.getByText("test-queue")).toBeInTheDocument();
      expect(screen.getByText("orders.fifo")).toBeInTheDocument();
    });
  });

  it("shows 'No Queue' message when no queues exist", async () => {
    global.fetch = jest.fn(async (_url: string, options?: RequestInit) => {
      if (!options || options.method === "GET") {
        return Response.json([]);
      }
      const body = JSON.parse(options.body as string);
      if (body.action === "GetRegion") {
        return Response.json({ region: "eu-central-1" });
      }
      return Response.json({});
    }) as typeof fetch;

    await act(async () => {
      render(<Overview />);
    });

    await waitFor(() => {
      expect(screen.getByText("No Queue")).toBeInTheDocument();
      expect(screen.getByText(/No Queues exist in region/)).toBeInTheDocument();
    });
  });

  it("disables action buttons when no queues exist", async () => {
    global.fetch = jest.fn(async (_url: string, options?: RequestInit) => {
      if (!options || options.method === "GET") return Response.json([]);
      return Response.json({ region: "" });
    }) as typeof fetch;

    await act(async () => {
      render(<Overview />);
    });

    expect(screen.getByRole("button", { name: "Delete Queue" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Purge Queue" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled();
  });

  it("enables action buttons when queues exist", async () => {
    await act(async () => {
      render(<Overview />);
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Delete Queue" })).toBeEnabled();
      expect(screen.getByRole("button", { name: "Purge Queue" })).toBeEnabled();
      expect(screen.getByRole("button", { name: "Send message" })).toBeEnabled();
    });
  });

  it("renders messages for selected queue", async () => {
    await act(async () => {
      render(<Overview />);
    });

    await waitFor(() => {
      expect(screen.getByText(/msg-001/)).toBeInTheDocument();
    });
  });

  it("selects a queue when clicked in sidebar", async () => {
    await act(async () => {
      render(<Overview />);
    });

    await waitFor(() => {
      expect(screen.getByText("test-queue")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText("test-queue"));
    });

    const selectedButton = screen.getByText("test-queue").closest("div.MuiListItemButton-root");
    expect(selectedButton).toHaveClass("Mui-selected");
  });

  it("displays version from env", async () => {
    await act(async () => {
      render(<Overview />);
    });
    expect(screen.getByText("1.0.0-test")).toBeInTheDocument();
  });

  it("shows error alert when API call fails", async () => {
    global.fetch = jest.fn(async () => {
      throw new Error("Network failure");
    }) as typeof fetch;

    await act(async () => {
      render(<Overview />);
    });

    await waitFor(() => {
      expect(screen.getByText("Network failure")).toBeInTheDocument();
    });
  });

  it("dismisses error alert when close is clicked", async () => {
    global.fetch = jest.fn(async () => {
      throw new Error("Something broke");
    }) as typeof fetch;

    await act(async () => {
      render(<Overview />);
    });

    await waitFor(() => {
      expect(screen.getByText("Something broke")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /close/i }));
    });

    await waitFor(() => {
      expect(screen.queryByText("Something broke")).not.toBeInTheDocument();
    });
  });

  it("calls delete queue API when Delete Queue is clicked", async () => {
    await act(async () => {
      render(<Overview />);
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Delete Queue" })).toBeEnabled();
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Delete Queue" }));
    });

    expect(fetchHandler).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringContaining('"DeleteQueue"'),
      }),
    );
  });

  it("calls purge queue API when Purge Queue is clicked", async () => {
    await act(async () => {
      render(<Overview />);
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Purge Queue" })).toBeEnabled();
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Purge Queue" }));
    });

    expect(fetchHandler).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringContaining('"PurgeQueue"'),
      }),
    );
  });

  it("creates a queue via the Create Queue dialog", async () => {
    await act(async () => {
      render(<Overview />);
    });

    fireEvent.click(screen.getByRole("button", { name: "Create Queue" }));
    fireEvent.change(screen.getByLabelText("Queue-Name"), {
      target: { value: "new-queue" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Create" }));
    });

    expect(fetchHandler).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: expect.stringContaining('"CreateQueue"'),
      }),
    );
  });
});

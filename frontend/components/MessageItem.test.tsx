import { render, screen, fireEvent } from "@testing-library/react";
import MessageItem from "./MessageItem";
import "@testing-library/jest-dom";

const baseMessage = {
  messageBody: '{"orderId": 123, "status": "shipped"}',
  messageId: "msg-abc-123",
  messageAttributes: {
    SentTimestamp: "1700000000000",
    ApproximateFirstReceiveTimestamp: "1700000001000",
  },
};

describe("<MessageItem /> spec", () => {
  it("renders message ID and timestamps", () => {
    render(<MessageItem data={baseMessage} />);
    expect(screen.getByText(/msg-abc-123/)).toBeInTheDocument();
    expect(screen.getByText(/Sent on:/)).toBeInTheDocument();
    expect(screen.getByText(/Received at:/)).toBeInTheDocument();
  });

  it("renders JSON message body in a tree", () => {
    render(<MessageItem data={baseMessage} />);
    expect(screen.getByText(/orderId/)).toBeInTheDocument();
    expect(screen.getByText(/shipped/)).toBeInTheDocument();
  });

  it("renders plain text message body", () => {
    const plainMessage = {
      ...baseMessage,
      messageBody: "Hello, world!",
    };
    render(<MessageItem data={plainMessage} />);
    expect(screen.getByText(/Hello, world!/)).toBeInTheDocument();
  });

  it("shows FIFO metadata when MessageGroupId is present", () => {
    const fifoMessage = {
      ...baseMessage,
      messageAttributes: {
        ...baseMessage.messageAttributes,
        MessageGroupId: "group-1",
        MessageDeduplicationId: "dedup-42",
      },
    };
    render(<MessageItem data={fifoMessage} />);
    expect(screen.getByText(/MessageGroupId: group-1/)).toBeInTheDocument();
    expect(screen.getByText(/DeduplicationId: dedup-42/)).toBeInTheDocument();
  });

  it("renders custom attributes accordion when present", () => {
    const messageWithAttrs = {
      ...baseMessage,
      messageAttributes: {
        ...baseMessage.messageAttributes,
        CustomAttributes: JSON.stringify({ env: "prod", priority: "high" }),
      },
    };
    render(<MessageItem data={messageWithAttrs} />);
    expect(screen.getByText("Message Attributes")).toBeInTheDocument();

    // Click the accordion summary to expand
    fireEvent.click(screen.getByText("Message Attributes"));

    expect(screen.getByText(/Key: env/)).toBeInTheDocument();
    expect(screen.getByText(/Value: prod/)).toBeInTheDocument();
    expect(screen.getByText(/Key: priority/)).toBeInTheDocument();
    expect(screen.getByText(/Value: high/)).toBeInTheDocument();
  });

  it("does not render custom attributes accordion when absent", () => {
    render(<MessageItem data={baseMessage} />);
    expect(screen.queryByText("Message Attributes")).not.toBeInTheDocument();
  });
});

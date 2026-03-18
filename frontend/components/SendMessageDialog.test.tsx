import { render, screen, fireEvent } from "@testing-library/react";
import SendMessageDialog from "./SendMessageDialog";
import { Queue } from "../types";
import "@testing-library/jest-dom";

const standardQueue: Queue = { QueueName: "test-queue" };
const fifoQueue: Queue = { QueueName: "test-queue.fifo" };

describe("<SendMessageDialog /> spec", () => {
  it("renders disabled button when disabled prop is true", () => {
    render(
      <SendMessageDialog disabled={true} onSubmit={() => {}} queue={standardQueue} />,
    );
    expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled();
  });

  it("renders enabled button when disabled prop is false", () => {
    render(
      <SendMessageDialog disabled={false} onSubmit={() => {}} queue={standardQueue} />,
    );
    expect(screen.getByRole("button", { name: "Send message" })).toBeEnabled();
  });

  it("opens dialog when button is clicked", () => {
    render(
      <SendMessageDialog disabled={false} onSubmit={() => {}} queue={standardQueue} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Please provide a message body.")).toBeInTheDocument();
  });

  it("blurs trigger button when dialog opens to avoid aria-hidden conflict", () => {
    render(
      <SendMessageDialog disabled={false} onSubmit={() => {}} queue={standardQueue} />,
    );
    const triggerButton = screen.getByRole("button", { name: "Send message" });
    triggerButton.focus();
    expect(document.activeElement).toBe(triggerButton);

    fireEvent.click(triggerButton);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(document.activeElement).not.toBe(triggerButton);
  });

  it("submits message with body text", () => {
    const mockSubmit = jest.fn();
    render(
      <SendMessageDialog disabled={false} onSubmit={mockSubmit} queue={standardQueue} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    fireEvent.change(screen.getByLabelText("Message-Body"), {
      target: { value: '{"hello": "world"}' },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit.mock.calls[0][0].messageBody).toBe('{"hello": "world"}');
  });

  it("shows Message-Group-Id field for FIFO queues", () => {
    render(
      <SendMessageDialog disabled={false} onSubmit={() => {}} queue={fifoQueue} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    const groupIdInput = document.getElementById("messageGroupId") as HTMLElement;
    expect(groupIdInput).toBeInTheDocument();
    // For FIFO queues the field is displayed as flex
    const wrapper = groupIdInput.closest(".MuiTextField-root") as HTMLElement;
    expect(wrapper?.style.display).toBe("flex");
  });

  it("hides Message-Group-Id field for standard queues", () => {
    render(
      <SendMessageDialog disabled={false} onSubmit={() => {}} queue={standardQueue} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    const groupIdInput = document.getElementById("messageGroupId") as HTMLElement;
    expect(groupIdInput).toBeInTheDocument();
    const wrapper = groupIdInput.closest(".MuiTextField-root") as HTMLElement;
    expect(wrapper?.style.display).toBe("none");
  });

  it("adds custom message attributes", () => {
    const mockSubmit = jest.fn();
    render(
      <SendMessageDialog disabled={false} onSubmit={mockSubmit} queue={standardQueue} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    fireEvent.change(screen.getByLabelText("Attribute key"), {
      target: { value: "env" },
    });
    fireEvent.change(screen.getByLabelText("Attribute value"), {
      target: { value: "production" },
    });
    fireEvent.click(screen.getByRole("button", { name: "add" }));

    // After adding, the attribute appears as an editable field
    expect(screen.getByDisplayValue("production")).toBeInTheDocument();
    // The key/value inputs should be cleared
    expect(screen.getByLabelText("Attribute key")).toHaveValue("");
    expect(screen.getByLabelText("Attribute value")).toHaveValue("");

    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    const submittedMessage = mockSubmit.mock.calls[0][0];
    expect(JSON.parse(submittedMessage.messageAttributes.CustomAttributes)).toEqual({
      env: "production",
    });
  });

  it("ignores add when attribute key is empty", () => {
    const mockSubmit = jest.fn();
    render(
      <SendMessageDialog disabled={false} onSubmit={mockSubmit} queue={standardQueue} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    fireEvent.change(screen.getByLabelText("Attribute key"), {
      target: { value: "  " },
    });
    fireEvent.change(screen.getByLabelText("Attribute value"), {
      target: { value: "value" },
    });
    fireEvent.click(screen.getByRole("button", { name: "add" }));

    // Submit and verify no custom attributes were included
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    const submitted = mockSubmit.mock.calls[0][0];
    expect(submitted.messageAttributes.CustomAttributes).toBeUndefined();
  });

  it("deletes a custom attribute", () => {
    render(
      <SendMessageDialog disabled={false} onSubmit={() => {}} queue={standardQueue} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Send message" }));

    fireEvent.change(screen.getByLabelText("Attribute key"), {
      target: { value: "myKey" },
    });
    fireEvent.change(screen.getByLabelText("Attribute value"), {
      target: { value: "myVal" },
    });
    fireEvent.click(screen.getByRole("button", { name: "add" }));
    expect(screen.getByDisplayValue("myVal")).toBeInTheDocument();

    const deleteIcon = screen.getByTestId("DeleteIcon");
    fireEvent.click(deleteIcon);
    expect(screen.queryByDisplayValue("myVal")).not.toBeInTheDocument();
  });

  it("submits FIFO message with MessageGroupId", () => {
    const mockSubmit = jest.fn();
    render(
      <SendMessageDialog disabled={false} onSubmit={mockSubmit} queue={fifoQueue} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Send message" }));
    fireEvent.change(screen.getByLabelText("Message-Body"), {
      target: { value: "fifo message" },
    });
    const groupIdInput = document.getElementById("messageGroupId") as HTMLInputElement;
    fireEvent.change(groupIdInput, { target: { value: "group-1" } });

    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    expect(mockSubmit).toHaveBeenCalledTimes(1);
    const submitted = mockSubmit.mock.calls[0][0];
    expect(submitted.messageBody).toBe("fifo message");
    expect(submitted.messageAttributes.MessageGroupId).toBe("group-1");
  });
});

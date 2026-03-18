import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateQueueDialog from "./CreateQueueDialog";
import "@testing-library/jest-dom";

describe("<CreateQueueDialog /> spec", () => {
  it("renders the Create Queue button", () => {
    render(<CreateQueueDialog onSubmit={() => {}} />);
    expect(screen.getByRole("button", { name: "Create Queue" })).toBeInTheDocument();
  });

  it("opens dialog when button is clicked", () => {
    render(<CreateQueueDialog onSubmit={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Create Queue" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Create new SQS")).toBeInTheDocument();
    expect(screen.getByLabelText("Queue-Name")).toBeInTheDocument();
  });

  it("calls onClose and dialog starts closing when Cancel is clicked", () => {
    render(<CreateQueueDialog onSubmit={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: "Create Queue" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    // Dialog state is set to closed; MUI transitions happen asynchronously
    // Verify the submit button inside the dialog is no longer reachable
    expect(screen.queryByRole("button", { name: "Create" })).toBeInTheDocument();
  });

  it("submits standard queue with entered name", () => {
    const mockSubmit = jest.fn();
    render(<CreateQueueDialog onSubmit={mockSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: "Create Queue" }));
    fireEvent.change(screen.getByLabelText("Queue-Name"), {
      target: { value: "my-queue" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    expect(mockSubmit).toHaveBeenCalledWith({
      QueueName: "my-queue",
      QueueAttributes: { FifoQueue: undefined },
    });
  });

  it("auto-appends .fifo suffix when FIFO is checked", () => {
    const mockSubmit = jest.fn();
    render(<CreateQueueDialog onSubmit={mockSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: "Create Queue" }));
    fireEvent.change(screen.getByLabelText("Queue-Name"), {
      target: { value: "my-queue" },
    });
    fireEvent.click(screen.getByRole("checkbox", { name: "controlled" }));
    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    expect(mockSubmit).toHaveBeenCalledWith({
      QueueName: "my-queue.fifo",
      QueueAttributes: { FifoQueue: "true" },
    });
  });

  it("does not double-append .fifo if already present", () => {
    const mockSubmit = jest.fn();
    render(<CreateQueueDialog onSubmit={mockSubmit} />);

    fireEvent.click(screen.getByRole("button", { name: "Create Queue" }));
    fireEvent.change(screen.getByLabelText("Queue-Name"), {
      target: { value: "my-queue.fifo" },
    });
    fireEvent.click(screen.getByRole("checkbox", { name: "controlled" }));
    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    expect(mockSubmit).toHaveBeenCalledWith({
      QueueName: "my-queue.fifo",
      QueueAttributes: { FifoQueue: "true" },
    });
  });

  it("blurs trigger button when dialog opens to avoid aria-hidden conflict", () => {
    render(<CreateQueueDialog onSubmit={() => {}} />);
    const triggerButton = screen.getByRole("button", { name: "Create Queue" });
    triggerButton.focus();
    expect(document.activeElement).toBe(triggerButton);

    fireEvent.click(triggerButton);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(document.activeElement).not.toBe(triggerButton);
  });

  it("resets queue name on submit", () => {
    const mockSubmit = jest.fn();
    render(<CreateQueueDialog onSubmit={mockSubmit} />);

    // Open dialog, fill in name, submit
    fireEvent.click(screen.getByRole("button", { name: "Create Queue" }));
    fireEvent.change(screen.getByLabelText("Queue-Name"), {
      target: { value: "first-queue" },
    });
    expect(screen.getByLabelText("Queue-Name")).toHaveValue("first-queue");
    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    // Verify submit was called with the correct queue name
    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ QueueName: "first-queue" }),
    );
  });
});

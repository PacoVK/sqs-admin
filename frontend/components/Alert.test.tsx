import { render, screen, fireEvent } from "@testing-library/react";
import Alert from "./Alert";
import "@testing-library/jest-dom";

describe("<Alert /> spec", () => {
  it("renders the Alert with info severity", () => {
    const view = render(
      <Alert message={"Hello"} severity={"info"} onClose={() => {}} />,
    );
    expect(view).toMatchSnapshot();
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("renders the Alert with different severity levels", () => {
    const { rerender } = render(
      <Alert message={"Warning message"} severity={"warning"} onClose={() => {}} />,
    );
    expect(screen.getByText("Warning message")).toBeInTheDocument();
    
    rerender(<Alert message={"Error message"} severity={"error"} onClose={() => {}} />);
    expect(screen.getByText("Error message")).toBeInTheDocument();
    
    rerender(<Alert message={"Success message"} severity={"success"} onClose={() => {}} />);
    expect(screen.getByText("Success message")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const mockOnClose = jest.fn();
    render(
      <Alert message={"Close me"} severity={"info"} onClose={mockOnClose} />,
    );
    
    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("collapses when message is null", () => {
    const { container } = render(
      <Alert message={null} severity={"info"} onClose={() => {}} />,
    );
    
    // When collapsed, the content should not be visible
    expect(container.querySelector('.MuiCollapse-hidden')).not.toBeNull();
  });
});

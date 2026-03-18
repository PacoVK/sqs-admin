import { render, screen } from "@testing-library/react";
import TabPanel from "./TabPanel";
import "@testing-library/jest-dom";

describe("<TabPanel /> spec", () => {
  it("renders children when value matches index", () => {
    render(
      <TabPanel index={0} value={0}>
        <div>Visible content</div>
      </TabPanel>,
    );
    expect(screen.getByText("Visible content")).toBeInTheDocument();
  });

  it("hides content when value does not match index", () => {
    render(
      <TabPanel index={1} value={0}>
        <div>Hidden content</div>
      </TabPanel>,
    );
    expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
    const panel = screen.getByRole("tabpanel", { hidden: true });
    expect(panel).toHaveAttribute("hidden");
  });

  it("sets correct accessibility attributes", () => {
    render(
      <TabPanel index={2} value={2}>
        <div>Tab content</div>
      </TabPanel>,
    );
    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveAttribute("id", "simple-tabpanel-2");
    expect(panel).toHaveAttribute("aria-labelledby", "simple-tab-2");
  });
});

import { render } from "@testing-library/react";
import TabPanel from "./TabPanel";

describe("<TabPanel /> spec", () => {
  it("renders the TabPanel", () => {
    const view = render(
      <TabPanel index={0} value={0}>
        <div>Test</div>
      </TabPanel>,
    );
    expect(view).toMatchSnapshot();
  });
});

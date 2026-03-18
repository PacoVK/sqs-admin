import { render, act } from "@testing-library/react";
import Overview from "./Overview";

describe("<Overview /> spec", () => {
  it("renders the Overview", async () => {
    let view;
    await act(async () => {
      view = render(<Overview />);
    });
    expect(view).toMatchSnapshot();
  });
});

import { render } from "@testing-library/react";
import Overview from "./Overview";

describe("<Overview /> spec", () => {
    it("renders the Overview", () => {
        const view = render(<Overview />);
        expect(view).toMatchSnapshot();

    });
});

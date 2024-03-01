import { render } from "@testing-library/react";
import Overview from "./Overview";
import {act} from "react-dom/test-utils";

describe("<Overview /> spec", () => {
    it("renders the Overview", async () => {
        let view
        await act(async () => {
            view = render(<Overview />);
        });
        expect(view).toMatchSnapshot();
    });
});

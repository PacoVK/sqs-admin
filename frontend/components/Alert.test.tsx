import { render } from "@testing-library/react";
import Alert from "./Alert";

describe("<Alert /> spec", () => {
    it("renders the Alert", () => {
        const view = render(<Alert message={"Hello"} severity={"info"} onClose={() => {}} />);
        expect(view).toMatchSnapshot();

    });
});

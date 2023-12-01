import { render } from "@testing-library/react";
import CreateQueueDialog from "./CreateQueueDialog";

describe("<CreateQueueDialog /> spec", () => {
    it("renders the CreateQueueDialog", () => {
        const view = render(<CreateQueueDialog onSubmit={() => {}} />);
        expect(view).toMatchSnapshot();

    });
});

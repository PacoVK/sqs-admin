import { render } from "@testing-library/react";
import MessageItem from "./MessageItem";

describe("<MessageItem /> spec", () => {
    it("renders the MessageItem", () => {
        const view = render(<MessageItem data={{
            messageBody: "Hello",
            messageAttributes: {
                SentTimestamp: "2021-05-01T00:00:00.000Z",
            }
        }} />);
        expect(view).toMatchSnapshot();
    });
});

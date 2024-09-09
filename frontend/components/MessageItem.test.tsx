import { render } from "@testing-library/react";
import MessageItem from "./MessageItem";

describe("<MessageItem /> spec", () => {
  it("renders the MessageItem", () => {
    const view = render(
      <MessageItem
        data={{
          messageBody: "Hello",
          messageAttributes: {
            SentTimestamp: "fake",
          },
        }}
      />,
    );
    expect(view).toMatchSnapshot();
  });
});

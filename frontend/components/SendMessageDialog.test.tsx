import { render } from "@testing-library/react";
import SendMessageDialog from "./SendMessageDialog";
import {Queue} from "../types";

describe("<SendMessageDialog /> spec", () => {
    it("renders the SendMessageDialog", () => {
        const queue: Queue = {
            QueueName: "test"
        }
        const view = render(<div>
            <SendMessageDialog disabled={false} onSubmit={()=>{}} queue={queue} />
            <SendMessageDialog disabled={true} onSubmit={()=>{}} queue={queue} />
        </div>);
        expect(view).toMatchSnapshot();

    });
});

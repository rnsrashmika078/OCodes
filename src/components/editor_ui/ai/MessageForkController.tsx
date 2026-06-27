import {
  BaseStream,

} from "@langchain/langgraph-sdk/react";

import { ExtendedMessage } from "@/lib/types/type";

export function MessageWithForkControls({
  stream,
  message,
}: {
  stream: BaseStream;
  message: ExtendedMessage;
}) {
  //   const metadata = useMessageMetadata(stream, message.id);
  //   const checkpointId = metadata?.parentCheckpointId;
  //   const [editedText, setEditedText] = useState(message.text);

  // const checkpointer = message.additional_kwargs?
  console.log("checkpointer", message.additional_kwargs);
  return (
    <form
      onSubmit={(event) => {
        // event.preventDefault();
        // if (!checkpointId) return;
        // stream.submit(
        //   { messages: [{ type: "human", content: editedText }] },
        //   { forkFrom: { checkpointId } },
        // );
      }}
    >
      {/* <textarea
        value={editedText}
        onChange={(event) => setEditedText(event.target.value)}
      /> */}
      {/* <button disabled={!checkpointId || editedText === message.text}>
        Submit edited branch
      </button> */}
    </form>
  );
}

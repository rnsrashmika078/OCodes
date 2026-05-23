import { Interrupt } from "node_modules/@langchain/langgraph-sdk/dist/schema";
import { SubmitOptions } from "node_modules/@langchain/langgraph-sdk/dist/ui/types";
import { useState } from "react";
interface HITLRequest {
  actionRequests: ActionRequest[];
  reviewConfigs: ReviewConfig[];
}

interface ActionRequest {
  action: string;
  args: Record<string, unknown>;
  description?: string;
}

interface ReviewConfig {
  allowedDecisions: ("approve" | "reject" | "edit" | "respond")[];
}
interface HITLResponse {
  decision: "approve";
}
function ApprovalCard({
  interrupt,
  onRespond,
  submit,
}: {
  interrupt: Interrupt<unknown> | undefined;
  onRespond: (response: string) => void;
  submit: (
    values: Partial<Record<string, unknown>> | null | undefined,
    options?:
      | SubmitOptions<Record<string, unknown>, Record<string, unknown>>
      | undefined,
  ) => Promise<void>;
}) {
  const response: HITLResponse = {
    decision: "approve",
  };

  submit(null, { command: { resume: response } });
  const request = interrupt?.value;
  const [editedArgs, setEditedArgs] = useState(
    request?.actionRequests[0]?.args ?? {},
  );
  const [rejectReason, setRejectReason] = useState("");
  const [respondMessage, setRespondMessage] = useState("");
  const [mode, setMode] = useState<"review" | "edit" | "reject" | "respond">(
    "review",
  );

  const action = request.actionRequests[0];
  const config = request.reviewConfigs[0];

  if (!action || !config) return null;

  return (
    <div className="rounded-lg border-2 border-amber-300 bg-amber-50 p-4">
      <h3 className="font-semibold text-amber-800">Action Review Required</h3>
      <p className="mt-1 text-sm text-amber-700">
        {action.description ?? `The agent wants to perform: ${action.action}`}
      </p>

      <div className="mt-3 rounded bg-white p-3 font-mono text-sm">
        <pre>{JSON.stringify(action.args, null, 2)}</pre>
      </div>

      {mode === "review" && (
        <div className="mt-4 flex gap-2">
          {config.allowedDecisions.includes("approve") && (
            <button
              className="rounded bg-green-600 px-4 py-2 text-white"
              onClick={() => onRespond({ decision: "approve" })}
            >
              Approve
            </button>
          )}
          {config.allowedDecisions.includes("reject") && (
            <button
              className="rounded bg-red-600 px-4 py-2 text-white"
              onClick={() => setMode("reject")}
            >
              Reject
            </button>
          )}
          {config.allowedDecisions.includes("edit") && (
            <button
              className="rounded bg-blue-600 px-4 py-2 text-white"
              onClick={() => setMode("edit")}
            >
              Edit
            </button>
          )}
          {config.allowedDecisions.includes("respond") && (
            <button
              className="rounded bg-purple-600 px-4 py-2 text-white"
              onClick={() => setMode("respond")}
            >
              Respond
            </button>
          )}
        </div>
      )}

      {mode === "reject" && (
        <div className="mt-4 space-y-2">
          <textarea
            className="w-full rounded border p-2"
            placeholder="Reason for rejection..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <button
            className="rounded bg-red-600 px-4 py-2 text-white"
            onClick={() =>
              onRespond({ decision: "reject", reason: rejectReason })
            }
          >
            Confirm Rejection
          </button>
        </div>
      )}

      {mode === "edit" && (
        <div className="mt-4 space-y-2">
          <textarea
            className="w-full rounded border p-2 font-mono text-sm"
            value={JSON.stringify(editedArgs, null, 2)}
            onChange={(e) => {
              try {
                setEditedArgs(JSON.parse(e.target.value));
              } catch {
                // allow invalid JSON while editing
              }
            }}
          />
          <button
            className="rounded bg-blue-600 px-4 py-2 text-white"
            onClick={() => onRespond({ decision: "edit", args: editedArgs })}
          >
            Submit Edits
          </button>
        </div>
      )}

      {mode === "respond" && (
        <div className="mt-4 space-y-2">
          <textarea
            className="w-full rounded border p-2"
            placeholder="Your response..."
            value={respondMessage}
            onChange={(e) => setRespondMessage(e.target.value)}
          />
          <button
            className="rounded bg-purple-600 px-4 py-2 text-white"
            onClick={() =>
              onRespond({ decision: "respond", message: respondMessage })
            }
          >
            Send Response
          </button>
        </div>
      )}
    </div>
  );
}
export default ApprovalCard;

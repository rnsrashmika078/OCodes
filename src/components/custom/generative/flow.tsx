import ReactFlow, {
  Background,
  Controls,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [
  {
    id: "1",
    position: { x: 100, y: 100 },
    data: { label: "Start Node 🚀" },
  },
  {
    id: "2",
    position: { x: 300, y: 200 },
    data: { label: "Second Node 🔥" },
  },
];

const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
  },
];

export default function FlowExample() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow nodes={initialNodes} edges={initialEdges}>
        <MiniMap />
        <Controls />
        <Background />/
      </ReactFlow>
    </div>
  );
}
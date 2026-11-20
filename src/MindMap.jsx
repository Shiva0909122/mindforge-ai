import React, { useMemo } from "react";
import { ReactFlow, Background, Controls, MiniMap, Handle, Position } from "@xyflow/react";

function TopicNode({ data }) {
  return <div className="topic-node">
    <Handle type="target" position={Position.Top} />
    <strong>{data.label}</strong>
    {data.detail && <small>{data.detail}</small>}
    <Handle type="source" position={Position.Bottom} />
  </div>;
}
const nodeTypes = { topic: TopicNode };

export default function MindMap({ summary }) {
  const { nodes, edges } = useMemo(() => {
    const center = [{ id: "root", type: "topic", position: { x: 350, y: 30 }, data: { label: summary.title || "Main Topic", detail: "Central idea" }, className: "root-node" }];
    const branchNodes = (summary.branches || []).map((branch, i) => ({
      id: `branch-${i}`, type: "topic",
      position: { x: 65 + (i % 3) * 235, y: 190 + Math.floor(i / 3) * 220 },
      data: { label: branch.name, detail: branch.details?.[0] || "Subtopic" }
    }));
    return {
      nodes: [...center, ...branchNodes],
      edges: branchNodes.map((node, i) => ({ id: `edge-${i}`, source: "root", target: node.id, animated: false }))
    };
  }, [summary]);
  return <div className="mindmap-canvas">
    <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.25 }}>
      <Background gap={22} size={1} />
      <MiniMap pannable zoomable />
      <Controls />
    </ReactFlow>
  </div>;
}

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  X,
  Shuffle,
  RotateCcw,
  Check,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";

interface GraphNode {
  id: string;
  label: string;
  position: { x: number; y: number };
}

interface GraphEdge {
  id: string;
  from: string;
  to: string;
}

interface GraphInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyGraph: (nodes: GraphNode[], edges: GraphEdge[]) => void;
  currentNodes: GraphNode[];
  currentEdges: GraphEdge[];
  title?: string;
}

const GraphInputModal = ({
  isOpen,
  onClose,
  onApplyGraph,
  currentNodes,
  currentEdges,
  title = "Customize Graph",
}: GraphInputModalProps) => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [error, setError] = useState("");
  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [selectedFromNode, setSelectedFromNode] = useState<string>("");
  const [selectedToNode, setSelectedToNode] = useState<string>("");

  // preset graphs with cycles and without cycles
  const presetGraphs = useMemo(
    () => [
      {
        name: "Simple Cycle",
        nodes: [
          { id: "A", label: "A", position: { x: 100, y: 100 } },
          { id: "B", label: "B", position: { x: 250, y: 100 } },
          { id: "C", label: "C", position: { x: 175, y: 200 } },
        ],
        edges: [
          { id: "AB", from: "A", to: "B" },
          { id: "BC", from: "B", to: "C" },
          { id: "CA", from: "C", to: "A" },
        ],
      },
      {
        name: "No Cycle (Tree)",
        nodes: [
          { id: "A", label: "A", position: { x: 175, y: 50 } },
          { id: "B", label: "B", position: { x: 100, y: 150 } },
          { id: "C", label: "C", position: { x: 250, y: 150 } },
          { id: "D", label: "D", position: { x: 50, y: 250 } },
          { id: "E", label: "E", position: { x: 150, y: 250 } },
        ],
        edges: [
          { id: "AB", from: "A", to: "B" },
          { id: "AC", from: "A", to: "C" },
          { id: "BD", from: "B", to: "D" },
          { id: "BE", from: "B", to: "E" },
        ],
      },
      {
        name: "Complex Cycle",
        nodes: [
          { id: "A", label: "A", position: { x: 100, y: 100 } },
          { id: "B", label: "B", position: { x: 300, y: 100 } },
          { id: "C", label: "C", position: { x: 500, y: 100 } },
          { id: "D", label: "D", position: { x: 200, y: 250 } },
          { id: "E", label: "E", position: { x: 400, y: 250 } },
        ],
        edges: [
          { id: "AB", from: "A", to: "B" },
          { id: "BC", from: "B", to: "C" },
          { id: "BD", from: "B", to: "D" },
          { id: "DE", from: "D", to: "E" },
          { id: "CE", from: "C", to: "E" },
        ],
      },
      {
        name: "Disconnected",
        nodes: [
          { id: "A", label: "A", position: { x: 100, y: 100 } },
          { id: "B", label: "B", position: { x: 200, y: 100 } },
          { id: "C", label: "C", position: { x: 350, y: 100 } },
          { id: "D", label: "D", position: { x: 450, y: 100 } },
        ],
        edges: [
          { id: "AB", from: "A", to: "B" },
          { id: "CD", from: "C", to: "D" },
        ],
      },
    ],
    []
  );

  // initialize values when modal opens
  useEffect(() => {
    if (isOpen) {
      setNodes([...currentNodes]);
      setEdges([...currentEdges]);
      setError("");
      setNewNodeLabel("");
      setSelectedFromNode("");
      setSelectedToNode("");
    }
  }, [isOpen, currentNodes, currentEdges]);

  // handle Esc key to close modal
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, handleKeyDown]);

  const validateGraph = (
    newNodes: GraphNode[],
    newEdges: GraphEdge[]
  ): boolean => {
    if (newNodes.length === 0) {
      setError("Graph must have at least one node");
      return false;
    }

    if (newNodes.length > 8) {
      setError("Maximum 8 nodes allowed for performance");
      return false;
    }

    if (newEdges.length > 12) {
      setError("Maximum 12 edges allowed");
      return false;
    }

    // check for duplicate node labels
    const labels = newNodes.map((n) => n.label);
    if (new Set(labels).size !== labels.length) {
      setError("Node labels must be unique");
      return false;
    }

    // validate edges reference existing nodes
    for (const edge of newEdges) {
      if (
        !newNodes.find((n) => n.id === edge.from) ||
        !newNodes.find((n) => n.id === edge.to)
      ) {
        setError("Invalid edge found");
        return false;
      }
    }

    setError("");
    return true;
  };

  const addNode = () => {
    if (!newNodeLabel.trim()) {
      setError("Node label cannot be empty");
      return;
    }

    if (nodes.find((n) => n.label === newNodeLabel.trim())) {
      setError("Node label must be unique");
      return;
    }

    const newNode: GraphNode = {
      id: newNodeLabel.trim(),
      label: newNodeLabel.trim(),
      position: {
        x: 100 + (nodes.length % 3) * 150,
        y: 100 + Math.floor(nodes.length / 3) * 120,
      },
    };

    const newNodes = [...nodes, newNode];
    if (validateGraph(newNodes, edges)) {
      setNodes(newNodes);
      setNewNodeLabel("");
    }
  };

  const removeNode = (nodeId: string) => {
    const newNodes = nodes.filter((n) => n.id !== nodeId);
    const newEdges = edges.filter((e) => e.from !== nodeId && e.to !== nodeId);

    if (validateGraph(newNodes, newEdges)) {
      setNodes(newNodes);
      setEdges(newEdges);
    }
  };

  const addEdge = () => {
    if (!selectedFromNode || !selectedToNode) {
      setError("Please select both nodes for the edge");
      return;
    }

    if (selectedFromNode === selectedToNode) {
      setError("Self-loops are not allowed");
      return;
    }

    // check if edge already exists (undirected)
    if (
      edges.find(
        (e) =>
          (e.from === selectedFromNode && e.to === selectedToNode) ||
          (e.from === selectedToNode && e.to === selectedFromNode)
      )
    ) {
      setError("Edge already exists");
      return;
    }

    const newEdge: GraphEdge = {
      id: `${selectedFromNode}${selectedToNode}`,
      from: selectedFromNode,
      to: selectedToNode,
    };

    const newEdges = [...edges, newEdge];
    if (validateGraph(nodes, newEdges)) {
      setEdges(newEdges);
      setSelectedFromNode("");
      setSelectedToNode("");
    }
  };

  const removeEdge = (edgeId: string) => {
    const newEdges = edges.filter((e) => e.id !== edgeId);
    setEdges(newEdges);
    setError("");
  };

  const generateRandomGraph = () => {
    const nodeCount = Math.floor(Math.random() * 3) + 4; // 4-6 nodes
    const newNodes: GraphNode[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const label = String.fromCharCode(65 + i); // A, B, C, etc.
      newNodes.push({
        id: label,
        label,
        position: {
          x: 80 + (i % 3) * 140 + Math.random() * 40,
          y: 80 + Math.floor(i / 3) * 120 + Math.random() * 40,
        },
      });
    }

    // generate random edges
    const newEdges: GraphEdge[] = [];
    const edgeCount = Math.floor(Math.random() * 3) + nodeCount - 1; // connected graph + some extra

    for (
      let i = 0;
      i < Math.min(edgeCount, (nodeCount * (nodeCount - 1)) / 2);
      i++
    ) {
      const from = newNodes[Math.floor(Math.random() * newNodes.length)];
      const to = newNodes[Math.floor(Math.random() * newNodes.length)];

      if (
        from.id !== to.id &&
        !newEdges.find(
          (e) =>
            (e.from === from.id && e.to === to.id) ||
            (e.from === to.id && e.to === from.id)
        )
      ) {
        newEdges.push({
          id: `${from.id}${to.id}`,
          from: from.id,
          to: to.id,
        });
      }
    }

    setNodes(newNodes);
    setEdges(newEdges);
    setError("");
  };

  const resetToDefault = () => {
    const defaultGraph = presetGraphs[2]; // complex cycle
    setNodes([...defaultGraph.nodes]);
    setEdges([...defaultGraph.edges]);
    setError("");
  };

  const selectPresetGraph = (preset: (typeof presetGraphs)[0]) => {
    setNodes([...preset.nodes]);
    setEdges([...preset.edges]);
    setError("");
  };

  const handleApply = () => {
    if (validateGraph(nodes, edges)) {
      onApplyGraph(nodes, edges);
      onClose();
    }
  };

  const availableFromNodes = nodes.filter((n) => n.id !== selectedToNode);
  const availableToNodes = nodes.filter((n) => n.id !== selectedFromNode);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12, ease: "easeOut" }}
        >
          {/* backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            onClick={onClose}
          />

          {/* modal content */}
          <motion.div
            className="relative w-full max-w-4xl bg-gray-900/90 border border-white/20 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 hover:border border-white/20 rounded-lg text-white hover:bg-white/5 transition-colors duration-150"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* left panel - graph builder */}
              <div className="space-y-6">
                {/* current graph display */}
                <div>
                  <label className="block text-white text-sm mb-3">
                    Current Graph ({nodes.length} nodes, {edges.length} edges)
                  </label>
                  <div className="h-64 p-4 bg-white/5 border border-white/30 rounded-lg relative overflow-hidden">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 400 240"
                      className="absolute inset-0"
                    >
                      {/* render edges */}
                      {edges.map((edge) => {
                        const fromNode = nodes.find((n) => n.id === edge.from);
                        const toNode = nodes.find((n) => n.id === edge.to);
                        if (!fromNode || !toNode) return null;

                        const scale = 0.7;
                        const x1 = fromNode.position.x * scale;
                        const y1 = fromNode.position.y * scale;
                        const x2 = toNode.position.x * scale;
                        const y2 = toNode.position.y * scale;

                        return (
                          <line
                            key={edge.id}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="#9333ea"
                            strokeWidth="2"
                            opacity="0.8"
                          />
                        );
                      })}

                      {/* render nodes */}
                      {nodes.map((node) => {
                        const scale = 0.7;
                        const x = node.position.x * scale;
                        const y = node.position.y * scale;

                        return (
                          <g key={node.id}>
                            <circle
                              cx={x}
                              cy={y}
                              r="15"
                              fill="rgb(59 130 246 / 0.3)"
                              stroke="rgb(59 130 246)"
                              strokeWidth="2"
                            />
                            <text
                              x={x}
                              y={y + 4}
                              textAnchor="middle"
                              fontSize="12"
                              fill="rgb(147 197 253)"
                              fontWeight="bold"
                            >
                              {node.label}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                  {error && (
                    <motion.p
                      className="text-red-400 text-xs mt-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.15 }}
                    >
                      {error}
                    </motion.p>
                  )}
                </div>

                {/* add node */}
                <div>
                  <label className="block text-white text-sm mb-2">
                    Add Node
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newNodeLabel}
                      onChange={(e) =>
                        setNewNodeLabel(e.target.value.toUpperCase())
                      }
                      onKeyPress={(e) => e.key === "Enter" && addNode()}
                      placeholder="Node label (A, B, C...)"
                      maxLength={2}
                      className="flex-1 px-4 py-2 bg-white/5 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-400/20 transition-colors duration-150"
                    />
                    <button
                      onClick={addNode}
                      disabled={!newNodeLabel.trim() || nodes.length >= 8}
                      className="flex items-center justify-center w-12 h-12 bg-emerald-600/30 border border-emerald-400/40 rounded-lg text-emerald-200 hover:bg-emerald-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* add edge */}
                <div>
                  <label className="block text-white text-sm mb-2">
                    Add Edge
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <select
                      value={selectedFromNode}
                      onChange={(e) => setSelectedFromNode(e.target.value)}
                      className="px-3 py-2 bg-white/5 border border-white/30 rounded-lg text-white focus:outline-none focus:border-blue-400/60"
                    >
                      <option value="">From Node</option>
                      {availableFromNodes.map((node) => (
                        <option
                          key={node.id}
                          value={node.id}
                          className="bg-gray-900"
                        >
                          {node.label}
                        </option>
                      ))}
                    </select>
                    <select
                      value={selectedToNode}
                      onChange={(e) => setSelectedToNode(e.target.value)}
                      className="px-3 py-2 bg-white/5 border border-white/30 rounded-lg text-white focus:outline-none focus:border-blue-400/60"
                    >
                      <option value="">To Node</option>
                      {availableToNodes.map((node) => (
                        <option
                          key={node.id}
                          value={node.id}
                          className="bg-gray-900"
                        >
                          {node.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={addEdge}
                    disabled={
                      !selectedFromNode || !selectedToNode || edges.length >= 12
                    }
                    className="w-full px-4 py-2 bg-purple-600/30 border border-purple-400/40 rounded-lg text-purple-200 hover:bg-purple-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 font-medium"
                  >
                    Add Edge
                  </button>
                </div>
              </div>

              {/* right panel - controls and presets */}
              <div className="space-y-6">
                {/* current nodes list */}
                <div>
                  <label className="block text-white text-sm mb-2">Nodes</label>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {nodes.map((node) => (
                      <div
                        key={node.id}
                        className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                      >
                        <span className="text-white font-mono">
                          {node.label}
                        </span>
                        <button
                          onClick={() => removeNode(node.id)}
                          className="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* current edges list */}
                <div>
                  <label className="block text-white text-sm mb-2">Edges</label>
                  <div className="space-y-1 max-h-24 overflow-y-auto">
                    {edges.map((edge) => (
                      <div
                        key={edge.id}
                        className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                      >
                        <span className="text-white font-mono text-sm">
                          {edge.from} ↔ {edge.to}
                        </span>
                        <button
                          onClick={() => removeEdge(edge.id)}
                          className="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* quick actions */}
                <div className="flex gap-2">
                  <button
                    onClick={generateRandomGraph}
                    className="flex items-center gap-2 px-3 py-2 bg-purple-600/10 border border-purple-400/40 rounded-lg text-purple-200 hover:bg-purple-600/40 transition-colors duration-150 font-medium text-xs flex-1"
                  >
                    <Shuffle size={14} />
                    Random
                  </button>
                  <button
                    onClick={resetToDefault}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-600/10 border border-gray-400/40 rounded-lg text-gray-200 hover:bg-gray-600/40 transition-colors duration-150 font-medium text-xs flex-1"
                  >
                    <RotateCcw size={14} />
                    Default
                  </button>
                </div>

                {/* preset graphs */}
                <div>
                  <h3 className="text-white text-sm mb-2">Preset Graphs:</h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {presetGraphs.map((preset, index) => (
                      <button
                        key={index}
                        onClick={() => selectPresetGraph(preset)}
                        className="w-full text-left p-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-colors duration-150 text-xs"
                      >
                        <div className="font-medium">{preset.name}</div>
                        <div className="text-gray-400">
                          {preset.nodes.length}N, {preset.edges.length}E
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* action buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-white/0 border border-white/30 rounded-lg text-white hover:bg-white/10 transition-colors duration-150 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={!!error || nodes.length === 0}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600/30 border border-emerald-400/40 rounded-lg text-emerald-200 hover:bg-emerald-600/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 font-medium text-sm"
              >
                <Check size={16} />
                Apply Graph
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GraphInputModal;

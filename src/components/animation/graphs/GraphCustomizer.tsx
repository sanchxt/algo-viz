import { Network } from "lucide-react";
import { motion } from "framer-motion";

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

interface GraphCustomizerProps {
  currentNodes: GraphNode[];
  currentEdges: GraphEdge[];
  onOpenModal: () => void;
}

const GraphCustomizer = ({
  currentNodes,
  currentEdges,
  onOpenModal,
}: GraphCustomizerProps) => {
  return (
    <motion.section
      className="max-w-6xl mx-auto mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
        <div className="flex-1 w-full">
          <h3 className="text-lg font-semibold text-white mb-4">
            Current Graph Structure
          </h3>

          {/* graph preview */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300 text-sm font-medium">
                  Nodes: {currentNodes.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-1 bg-purple-400"></div>
                <span className="text-gray-300 text-sm font-medium">
                  Edges: {currentEdges.length}
                </span>
              </div>
            </div>

            {/* visual representation */}
            <motion.div
              className="relative bg-gray-900/40 rounded-xl p-4 h-32 overflow-hidden"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 400 120"
                className="absolute inset-0"
              >
                {/* render edges */}
                {currentEdges.map((edge) => {
                  const fromNode = currentNodes.find((n) => n.id === edge.from);
                  const toNode = currentNodes.find((n) => n.id === edge.to);
                  if (!fromNode || !toNode) return null;

                  // scale positions to fit the preview
                  const scale = 0.6;
                  const offsetX = 50;
                  const offsetY = 20;

                  const x1 = fromNode.position.x * scale + offsetX;
                  const y1 = fromNode.position.y * scale + offsetY;
                  const x2 = toNode.position.x * scale + offsetX;
                  const y2 = toNode.position.y * scale + offsetY;

                  return (
                    <line
                      key={edge.id}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="#9333ea"
                      strokeWidth="2"
                      opacity="0.6"
                    />
                  );
                })}

                {/* render nodes */}
                {currentNodes.map((node) => {
                  const scale = 0.6;
                  const offsetX = 50;
                  const offsetY = 20;

                  const x = node.position.x * scale + offsetX;
                  const y = node.position.y * scale + offsetY;

                  return (
                    <g key={node.id}>
                      <circle
                        cx={x}
                        cy={y}
                        r="12"
                        fill="rgb(59 130 246 / 0.3)"
                        stroke="rgb(59 130 246 / 0.6)"
                        strokeWidth="2"
                      />
                      <text
                        x={x}
                        y={y + 4}
                        textAnchor="middle"
                        fontSize="10"
                        fill="rgb(147 197 253)"
                        fontWeight="bold"
                      >
                        {node.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </motion.div>

            {/* graph summary */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-lg px-3 py-2">
                <span className="text-blue-200 font-mono text-sm">
                  Nodes: {currentNodes.map((n) => n.label).join(", ")}
                </span>
              </div>
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-lg px-3 py-2">
                <span className="text-purple-200 font-mono text-sm">
                  Connections: {currentEdges.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={onOpenModal}
            className="flex items-center gap-2 px-4 py-3 text-sm active:scale-95 backdrop-blur-md bg-gradient-to-r from-emerald-500/15 to-blue-500/15 border border-emerald-400/30 rounded-xl text-emerald-200 hover:from-emerald-500/25 hover:to-blue-500/25 hover:scale-105 transition-all duration-200 font-medium shadow-lg"
          >
            <Network size={16} />
            Customize Graph
          </button>

          {/* quick stats */}
          <div className="text-center">
            <div className="text-gray-400 text-xs">Cycle Detection</div>
            <div className="text-cyan-400 font-bold text-lg">
              {currentNodes.length}V, {currentEdges.length}E
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default GraphCustomizer;

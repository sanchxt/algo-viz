import { motion } from "framer-motion";

const InOrderTraversalLegend = () => {
  const nodeStates = [
    {
      color: "from-blue-400 via-blue-500 to-blue-600 border-blue-300/60",
      label: "Current Node",
      description: "Currently being processed",
    },
    {
      color: "from-amber-400 via-amber-500 to-amber-600 border-amber-300/60",
      label: "Processing Node",
      description: "In traversal process",
    },
    {
      color:
        "from-emerald-400 via-emerald-500 to-emerald-600 border-emerald-300/60",
      label: "Visited Node",
      description: "Added to result",
    },
    {
      color:
        "from-purple-400 via-purple-500 to-purple-600 border-purple-300/60",
      label: "Completed Node",
      description: "Fully processed",
    },
    {
      color: "from-gray-400 via-gray-500 to-gray-600 border-gray-300/50",
      label: "Unvisited Node",
      description: "Not yet processed",
    },
  ];

  const callStackStates = [
    {
      color: "bg-blue-500/20 border-blue-400/50 text-blue-200",
      label: "Active Call",
      description: "Currently executing",
    },
    {
      color: "bg-amber-500/20 border-amber-400/50 text-amber-200",
      label: "Highlighted Call",
      description: "Focus of current step",
    },
    {
      color: "bg-red-500/20 border-red-400/50 text-red-200",
      label: "Base Case",
      description: "Null node reached",
    },
    {
      color: "bg-purple-500/20 border-purple-400/50 text-purple-200",
      label: "Returning Call",
      description: "Returning to parent",
    },
  ];

  const resultStates = [
    {
      color: "bg-emerald-500/30 border-emerald-400/60 text-emerald-200",
      label: "New Addition",
      description: "Just added to result",
    },
    {
      color: "bg-purple-500/30 border-purple-400/60 text-purple-200",
      label: "Final Result",
      description: "Complete traversal",
    },
    {
      color: "bg-blue-500/20 border-blue-400/40 text-blue-200",
      label: "Previous Values",
      description: "Already in result",
    },
  ];

  const traversalInfo = [
    {
      icon: "⬅️",
      label: "Left Subtree",
      description: "Process left children first",
    },
    {
      icon: "📍",
      label: "Root Node",
      description: "Visit current node",
    },
    {
      icon: "➡️",
      label: "Right Subtree",
      description: "Process right children last",
    },
  ];

  return (
    <motion.div
      className="mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* tree node states */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              🌳 Tree Nodes
            </h4>
            {nodeStates.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <div
                  className={`w-4 h-4 rounded-full bg-gradient-to-br border flex-shrink-0 mt-0.5 ${item.color}`}
                />
                <div>
                  <span className="text-gray-200 text-sm font-medium block">
                    {item.label}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {item.description}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* call stack states */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              📚 Call Stack
            </h4>
            {callStackStates.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <div
                  className={`w-4 h-4 rounded border flex-shrink-0 mt-0.5 ${item.color}`}
                />
                <div>
                  <span className="text-gray-200 text-sm font-medium block">
                    {item.label}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {item.description}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* result array states */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              📋 Result Array
            </h4>
            {resultStates.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <div
                  className={`w-4 h-4 rounded border-2 flex-shrink-0 mt-0.5 ${item.color}`}
                />
                <div>
                  <span className="text-gray-200 text-sm font-medium block">
                    {item.label}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {item.description}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* traversal order */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              🔄 Traversal Order
            </h4>
            {traversalInfo.map((item, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-lg flex-shrink-0 mt-0.5">
                  {item.icon}
                </span>
                <div>
                  <span className="text-gray-200 text-sm font-medium block">
                    {item.label}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {item.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* algorithm summary */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="text-center">
            <h5 className="text-white text-sm font-semibold mb-2">
              In-order Traversal Pattern
            </h5>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-300">
              <span className="flex items-center gap-1">
                <span className="text-blue-400">⬅️</span>
                Left
              </span>
              <span className="text-gray-500">→</span>
              <span className="flex items-center gap-1">
                <span className="text-emerald-400">📍</span>
                Root
              </span>
              <span className="text-gray-500">→</span>
              <span className="flex items-center gap-1">
                <span className="text-purple-400">➡️</span>
                Right
              </span>
            </div>
            <p className="text-gray-400 text-xs mt-2 max-w-md mx-auto">
              For Binary Search Trees, this produces values in sorted order
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InOrderTraversalLegend;

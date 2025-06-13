import { motion } from "framer-motion";

const BfsTraversalLegend = () => {
  const nodeStates = [
    {
      color: "from-blue-400 via-blue-500 to-blue-600 border-blue-300/60",
      label: "Current Node",
      description: "Being processed now",
    },
    {
      color: "from-amber-400 via-amber-500 to-amber-600 border-amber-300/60",
      label: "Highlighted Node",
      description: "Children being enqueued",
    },
    {
      color:
        "from-emerald-400 via-emerald-500 to-emerald-600 border-emerald-300/60",
      label: "Visited Node",
      description: "Dequeued and processed",
    },
    {
      color:
        "from-purple-400 via-purple-500 to-purple-600 border-purple-300/60",
      label: "Level Complete",
      description: "All nodes at this level done",
    },
    {
      color: "from-cyan-400 via-cyan-500 to-cyan-600 border-cyan-300/60",
      label: "Final Result",
      description: "All nodes processed",
    },
    {
      color: "from-gray-400 via-gray-500 to-gray-600 border-gray-300/50",
      label: "Unvisited Node",
      description: "Not yet processed",
    },
  ];

  const queueStates = [
    {
      color: "bg-blue-500/30 border-blue-400/60 text-blue-200",
      label: "Front Element",
      description: "Next to be dequeued",
    },
    {
      color: "bg-emerald-500/30 border-emerald-400/60 text-emerald-200",
      label: "Enqueued Element",
      description: "Just added to queue",
    },
    {
      color: "bg-red-500/30 border-red-400/60 text-red-200",
      label: "Dequeued Element",
      description: "Removed from front",
    },
    {
      color: "bg-white/10 border-white/30 text-gray-200",
      label: "Waiting in Queue",
      description: "Waiting to be processed",
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
      description: "Complete level-order",
    },
    {
      color: "bg-blue-500/20 border-blue-400/40 text-blue-200",
      label: "Previous Values",
      description: "Already in result",
    },
  ];

  const traversalInfo = [
    {
      icon: "0️⃣",
      label: "Level 0 (Root)",
      description: "Start with root node",
    },
    {
      icon: "1️⃣",
      label: "Level 1",
      description: "Root's direct children",
    },
    {
      icon: "2️⃣",
      label: "Level 2",
      description: "Grandchildren of root",
    },
    {
      icon: "⬇️",
      label: "Next Levels",
      description: "Continue level by level",
    },
  ];

  const queueOperations = [
    {
      icon: "⬅️",
      label: "Enqueue (Rear)",
      description: "Add children to back",
    },
    {
      icon: "👁️",
      label: "Peek (Front)",
      description: "Look at next node",
    },
    {
      icon: "➡️",
      label: "Dequeue (Front)",
      description: "Remove and process",
    },
    {
      icon: "🔄",
      label: "FIFO Order",
      description: "First In, First Out",
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
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

          {/* queue states */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              🚶‍♂️ Queue Elements
            </h4>
            {queueStates.map((item, index) => (
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

          {/* level order */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              📊 Level Order
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

          {/* queue operations */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              🔄 Queue Operations
            </h4>
            {queueOperations.map((item, index) => (
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
              BFS (Level-Order) Traversal Pattern
            </h5>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-300">
              <span className="flex items-center gap-1">
                <span className="text-blue-400">🏁</span>
                Start Root
              </span>
              <span className="text-gray-500">→</span>
              <span className="flex items-center gap-1">
                <span className="text-emerald-400">⬅️</span>
                Enqueue Children
              </span>
              <span className="text-gray-500">→</span>
              <span className="flex items-center gap-1">
                <span className="text-purple-400">➡️</span>
                Dequeue & Visit
              </span>
              <span className="text-gray-500">→</span>
              <span className="flex items-center gap-1">
                <span className="text-cyan-400">🔄</span>
                Repeat
              </span>
            </div>
            <p className="text-gray-400 text-xs mt-2 max-w-md mx-auto">
              Queue ensures level-by-level exploration using FIFO principle
            </p>
          </div>

          {/* key differences from DFS */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg">
              <h6 className="text-blue-300 text-sm font-semibold mb-1">
                BFS (Breadth-First)
              </h6>
              <div className="text-xs text-gray-300 space-y-1">
                <div>• Uses Queue (FIFO)</div>
                <div>• Explores level by level</div>
                <div>• Iterative approach</div>
                <div>• Great for shortest paths</div>
              </div>
            </div>
            <div className="text-center p-3 bg-purple-500/10 border border-purple-400/30 rounded-lg">
              <h6 className="text-purple-300 text-sm font-semibold mb-1">
                DFS (Depth-First)
              </h6>
              <div className="text-xs text-gray-300 space-y-1">
                <div>• Uses Stack/Recursion (LIFO)</div>
                <div>• Explores depth first</div>
                <div>• Recursive approach</div>
                <div>• Great for path finding</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BfsTraversalLegend;

import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, Calculator, TreePine } from "lucide-react";

const FactorialLegend = () => {
  const callStackItems = [
    {
      color: "from-blue-400 via-blue-500 to-blue-600 border-blue-300/60",
      label: "Active Call",
      description: "Currently executing function call",
    },
    {
      color:
        "from-emerald-400 via-emerald-500 to-emerald-600 border-emerald-300/60",
      label: "Base Case",
      description: "n ≤ 1, returns 1",
    },
    {
      color:
        "from-purple-400 via-purple-500 to-purple-600 border-purple-300/60",
      label: "Returning",
      description: "Call completed, returning value",
    },
    {
      color: "from-gray-400 via-gray-500 to-gray-600 border-gray-300/50",
      label: "Waiting",
      description: "Waiting for recursive call to complete",
    },
  ];

  const treeNodeItems = [
    {
      color: "from-blue-400 via-blue-500 to-blue-600 border-blue-300/60",
      label: "Active Node",
      description: "Function call being processed",
    },
    {
      color:
        "from-emerald-400 via-emerald-500 to-emerald-600 border-emerald-300/60",
      label: "Base Case Node",
      description: "Reached base condition (n ≤ 1)",
    },
    {
      color: "from-amber-400 via-amber-500 to-amber-600 border-amber-300/60",
      label: "Completed Node",
      description: "All recursive calls resolved",
    },
    {
      color:
        "from-purple-400 via-purple-500 to-purple-600 border-purple-300/60",
      label: "Returning Node",
      description: "Propagating return value upward",
    },
    {
      color: "from-gray-400 via-gray-500 to-gray-600 border-gray-300/50",
      label: "Pending Node",
      description: "Call created but not yet executed",
    },
  ];

  const flowItems = [
    {
      icon: <ArrowDown size={14} />,
      label: "Recursive Call",
      color: "text-cyan-400",
      description: "Function calls itself with smaller input",
    },
    {
      icon: <ArrowUp size={14} />,
      label: "Return Value",
      color: "text-amber-400",
      description: "Value bubbles back up the call stack",
    },
    {
      icon: <Calculator size={14} />,
      label: "Calculation",
      color: "text-purple-400",
      description: "n × factorial(n-1) computation",
    },
    {
      icon: <TreePine size={14} />,
      label: "Tree Connection",
      color: "text-gray-400",
      description: "Parent-child call relationship",
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* call stack states */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
              Call Stack States
            </h4>
            {callStackItems.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div
                  className={`w-4 h-4 rounded bg-gradient-to-br border flex-shrink-0 ${item.color}`}
                />
                <div className="flex-1">
                  <span className="text-sm text-gray-200 font-medium">
                    {item.label}
                  </span>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {item.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* tree node states */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded"></div>
              Tree Node States
            </h4>
            {treeNodeItems.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div
                  className={`w-4 h-4 rounded bg-gradient-to-br border flex-shrink-0 ${item.color}`}
                />
                <div className="flex-1">
                  <span className="text-sm text-gray-200 font-medium">
                    {item.label}
                  </span>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {item.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* flow indicators */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded"></div>
              Flow Indicators
            </h4>
            {flowItems.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div className={`flex-shrink-0 ${item.color}`}>{item.icon}</div>
                <div className="flex-1">
                  <span className="text-sm text-gray-200 font-medium">
                    {item.label}
                  </span>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {item.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* notes */}
        <motion.div
          className="mt-6 pt-6 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3">
              <h5 className="text-blue-200 font-semibold mb-1">
                📚 Call Stack
              </h5>
              <p className="text-gray-300 text-xs">
                Shows the sequence of function calls. New calls are pushed on
                top, and completed calls are popped off.
              </p>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-400/30 rounded-lg p-3">
              <h5 className="text-emerald-200 font-semibold mb-1">
                🌳 Recursion Tree
              </h5>
              <p className="text-gray-300 text-xs">
                Visualizes the recursive call structure. Each node represents a
                function call, connected to its recursive subcalls.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FactorialLegend;

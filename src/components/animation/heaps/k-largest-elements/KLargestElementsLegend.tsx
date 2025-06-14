import { motion } from "framer-motion";

const KLargestElementsLegend = () => {
  const inputStates = [
    {
      color: "rgb(59 130 246)", // blue
      fill: "rgb(59 130 246 / 0.3)",
      label: "Current Element",
      description: "Element being processed from input array",
    },
    {
      color: "rgb(34 197 94)", // green
      fill: "rgb(34 197 94 / 0.3)",
      label: "Added to Heap",
      description: "Element successfully added to heap",
    },
    {
      color: "rgb(239 68 68)", // red
      fill: "rgb(239 68 68 / 0.3)",
      label: "Rejected Element",
      description: "Element not added (smaller than heap min)",
    },
    {
      color: "rgb(156 163 175)", // gray
      fill: "rgb(156 163 175 / 0.2)",
      label: "Processed Element",
      description: "Already processed in previous steps",
    },
  ];

  const heapStates = [
    {
      color: "rgb(239 68 68)", // red
      fill: "rgb(239 68 68 / 0.8)",
      label: "Heap Minimum",
      description: "Root element (smallest in min-heap)",
      animated: true,
    },
    {
      color: "rgb(245 158 11)", // amber
      fill: "rgb(245 158 11 / 0.8)",
      label: "Comparison Node",
      description: "Node being compared with input",
    },
    {
      color: "rgb(59 130 246)", // blue
      fill: "rgb(59 130 246 / 0.8)",
      label: "Active Node",
      description: "Node involved in current operation",
    },
    {
      color: "rgb(34 197 94)", // green
      fill: "rgb(34 197 94 / 0.6)",
      label: "Heap Element",
      description: "Regular element in the heap",
    },
  ];

  const algorithmSteps = [
    {
      step: "1",
      title: "Check Heap Size",
      description: "If heap size < K, add element directly",
      color: "bg-blue-500/20 border-blue-400/30 text-blue-200",
    },
    {
      step: "2",
      title: "Compare with Min",
      description: "If heap full, compare with heap minimum",
      color: "bg-amber-500/20 border-amber-400/30 text-amber-200",
    },
    {
      step: "3",
      title: "Replace if Larger",
      description: "If current > min, remove min and add current",
      color: "bg-emerald-500/20 border-emerald-400/30 text-emerald-200",
    },
    {
      step: "4",
      title: "Skip if Smaller",
      description: "If current ≤ min, skip the current element",
      color: "bg-red-500/20 border-red-400/30 text-red-200",
    },
    {
      step: "5",
      title: "Maintain Heap",
      description: "Heapify to maintain min-heap property",
      color: "bg-purple-500/20 border-purple-400/30 text-purple-200",
    },
  ];

  const heapOperations = [
    {
      icon: "⬆️",
      label: "Push Operation",
      description: "Add element to heap and heapify up",
      example: "heap.push(element)",
      color: "bg-emerald-500/20 border-emerald-400/30 text-emerald-200",
    },
    {
      icon: "⬇️",
      label: "Pop Operation",
      description: "Remove minimum element and heapify down",
      example: "heap.pop()",
      color: "bg-red-500/20 border-red-400/30 text-red-200",
    },
    {
      icon: "👁️",
      label: "Peek Operation",
      description: "View minimum element without removing",
      example: "heap.peek()",
      color: "bg-blue-500/20 border-blue-400/30 text-blue-200",
    },
    {
      icon: "📏",
      label: "Size Check",
      description: "Check if heap has space for new elements",
      example: "heap.size() < k",
      color: "bg-purple-500/20 border-purple-400/30 text-purple-200",
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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* input array states */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              Input States
            </h4>
            {inputStates.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded border-2 flex-shrink-0"
                  style={{
                    backgroundColor: item.fill,
                    borderColor: item.color,
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[0.8rem] font-medium text-gray-200">
                    {item.label}
                  </div>
                  <div className="text-[0.7rem] text-gray-400">
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* heap node states */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-400 rounded"></div>
              Heap Nodes
            </h4>
            {heapStates.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <svg width="20" height="20" className="flex-shrink-0">
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    fill={item.fill}
                    stroke={item.color}
                    strokeWidth="2"
                    className={item.animated ? "animate-pulse" : ""}
                  />
                </svg>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.8rem] font-medium text-gray-200">
                    {item.label}
                  </div>
                  <div className="text-[0.7rem] text-gray-400">
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* heap operations */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-400 rounded"></div>
              Heap Operations
            </h4>
            {heapOperations.map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[0.8rem] font-medium text-gray-200">
                      {item.label}
                    </div>
                    <div className="text-[0.7rem] text-gray-400">
                      {item.description}
                    </div>
                  </div>
                </div>
                <div
                  className={`
                  px-2 py-1 rounded text-[0.65rem] font-mono border
                  ${item.color}
                `}
                >
                  {item.example}
                </div>
              </div>
            ))}
          </div>

          {/* algorithm steps */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-400 rounded"></div>
              Algorithm Steps
            </h4>
            {algorithmSteps.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {item.step}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[0.8rem] font-medium text-gray-200">
                    {item.title}
                  </div>
                  <div className="text-[0.7rem] text-gray-400">
                    {item.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default KLargestElementsLegend;

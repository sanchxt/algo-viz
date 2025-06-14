import { BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

interface HeapCustomizerProps {
  currentArray: number[];
  currentK: number;
  onOpenModal: () => void;
}

const HeapCustomizer = ({
  currentArray,
  currentK,
  onOpenModal,
}: HeapCustomizerProps) => {
  const arrayLength = currentArray.length;
  const maxElement = Math.max(...currentArray);
  const minElement = Math.min(...currentArray);

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
            Current Input Configuration
          </h3>

          {/* input preview */}
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <span className="text-gray-300 text-sm font-medium">
                  Array Length: {arrayLength}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
                <span className="text-gray-300 text-sm font-medium">
                  K Value: {currentK}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
                <span className="text-gray-300 text-sm font-medium">
                  Range: {minElement}-{maxElement}
                </span>
              </div>
            </div>

            {/* array preview */}
            <motion.div
              className="relative bg-gray-900/40 rounded-xl p-4 h-24 overflow-hidden"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-1 overflow-x-auto pb-2 h-full">
                {currentArray.slice(0, 20).map((value, index) => (
                  <div
                    key={index}
                    className="min-w-[32px] flex-shrink-0 text-center font-mono font-semibold text-xs py-1 px-1 rounded bg-purple-500/30 border border-purple-400/50 text-purple-200"
                    title={`Index ${index}: ${value}`}
                  >
                    {value}
                  </div>
                ))}
                {currentArray.length > 20 && (
                  <div className="min-w-[32px] flex-shrink-0 text-center font-mono text-xs py-1 px-1 text-gray-400">
                    +{currentArray.length - 20}
                  </div>
                )}
              </div>
            </motion.div>

            {/* algorithm info summary */}
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-400/30 rounded-lg px-3 py-2">
                <span className="text-purple-200 font-mono text-sm">
                  Find: {currentK} largest
                </span>
              </div>
              <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/30 rounded-lg px-3 py-2">
                <span className="text-emerald-200 font-mono text-sm">
                  Method: Min-Heap
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={onOpenModal}
            className="flex items-center gap-2 px-4 py-3 text-sm active:scale-95 backdrop-blur-md bg-gradient-to-r from-purple-500/15 to-blue-500/15 border border-purple-400/30 rounded-xl text-purple-200 hover:from-purple-500/25 hover:to-blue-500/25 hover:scale-105 transition-all duration-200 font-medium shadow-lg"
          >
            <BarChart3 size={16} />
            Customize Input
          </button>

          {/* complexity info */}
          <div className="text-center">
            <div className="text-gray-400 text-xs">Time Complexity</div>
            <div className="text-cyan-400 font-bold text-lg">O(n log k)</div>
            <div className="text-gray-400 text-xs">Space: O(k)</div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default HeapCustomizer;

import { Calculator, RotateCcw, Shuffle } from "lucide-react";
import { motion } from "framer-motion";

interface MinCostCustomizerProps {
  currentArray: number[];
  onOpenModal: () => void;
  onGenerateRandom: () => void;
  onReset: () => void;
  expectedResult: number;
}

const MinCostCustomizer = ({
  currentArray,
  onOpenModal,
  onGenerateRandom,
  onReset,
  expectedResult,
}: MinCostCustomizerProps) => {
  const minElement = currentArray.length > 0 ? Math.min(...currentArray) : 0;
  const operationsNeeded = Math.max(0, currentArray.length - 1);

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
            Current Array Configuration
          </h3>

          {/* array preview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-violet-400 rounded-full"></div>
              <span className="text-gray-300 text-sm font-medium">
                Elements: {currentArray.length}
              </span>
            </div>

            {/* visual array representation */}
            <motion.div
              className="flex items-center gap-2 overflow-x-auto pb-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {currentArray.map((value, index) => {
                const isMinElement = value === minElement;

                return (
                  <div key={index} className="flex items-center gap-2">
                    {/* element box */}
                    <div
                      className={`relative flex-shrink-0 w-14 h-14 rounded-lg flex items-center justify-center border-2 transition-all duration-200 ${
                        isMinElement
                          ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/50 ring-2 ring-green-400/30"
                          : "bg-gradient-to-r from-violet-500/20 to-purple-500/20 border-violet-400/30"
                      }`}
                    >
                      <span
                        className={`font-mono font-semibold text-sm ${
                          isMinElement ? "text-green-200" : "text-violet-200"
                        }`}
                      >
                        {value}
                      </span>

                      {/* min label */}
                      {isMinElement && (
                        <div className="absolute -top-2 -right-2 px-1.5 py-0.5 bg-green-600 rounded-full text-xs font-bold text-white">
                          MIN
                        </div>
                      )}
                    </div>

                    {/* separator */}
                    {index < currentArray.length - 1 && (
                      <div className="flex-shrink-0 text-gray-400 text-sm">
                        •
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>

            {/* array as text notation */}
            <div className="text-center mt-4">
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-lg">
                <span className="text-purple-200 font-mono text-sm">
                  [{currentArray.join(", ")}]
                </span>
              </div>
            </div>

            {/* strategy preview */}
            <div className="mt-4 space-y-2">
              <div className="text-center">
                <div className="inline-block px-3 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-lg">
                  <span className="text-green-200 font-mono text-sm">
                    Strategy: Use min element ({minElement}) for all{" "}
                    {operationsNeeded} operations
                  </span>
                </div>
              </div>

              <div className="text-center">
                <div className="inline-block px-3 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 rounded-lg">
                  <span className="text-cyan-200 font-mono text-sm">
                    Expected total cost: {operationsNeeded} × {minElement} ={" "}
                    {expectedResult}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          {/* main customization button */}
          <button
            onClick={onOpenModal}
            className="flex items-center gap-2 px-4 py-3 text-sm active:scale-95 backdrop-blur-md bg-gradient-to-r from-violet-500/15 to-purple-500/15 border border-violet-400/30 rounded-xl text-violet-200 hover:from-violet-500/25 hover:to-purple-500/25 hover:scale-105 transition-all duration-200 font-medium shadow-lg"
          >
            <Calculator size={16} />
            Customize Array
          </button>

          {/* quick action buttons */}
          <div className="flex gap-2">
            <button
              onClick={onGenerateRandom}
              className="flex items-center gap-2 px-3 py-2 bg-amber-600/20 border border-amber-400/40 rounded-lg text-amber-200 hover:bg-amber-600/30 transition-colors duration-150 font-medium text-xs"
            >
              <Shuffle size={14} />
              Random
            </button>
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-3 py-2 bg-gray-600/20 border border-gray-400/40 rounded-lg text-gray-200 hover:bg-gray-600/30 transition-colors duration-150 font-medium text-xs"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>

          {/* quick stats */}
          <div className="text-center space-y-1">
            <div className="text-gray-400 text-xs">Operations needed</div>
            <div className="text-cyan-400 font-bold text-lg">
              {operationsNeeded}
            </div>
            <div className="text-gray-400 text-xs">
              Min element: {minElement}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default MinCostCustomizer;

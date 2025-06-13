import { Coins } from "lucide-react";
import { motion } from "framer-motion";

interface CoinChangeCustomizerProps {
  currentCoins: number[];
  currentAmount: number;
  onOpenModal: () => void;
}

const CoinChangeCustomizer = ({
  currentCoins,
  currentAmount,
  onOpenModal,
}: CoinChangeCustomizerProps) => {
  // calculate some quick stats
  const minCoinValue = Math.min(...currentCoins);
  const maxCoinValue = Math.max(...currentCoins);
  const canGreedySolve = currentCoins.includes(1); // greedy works if we have coin 1

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
            Current Problem Configuration
          </h3>

          {/* problem preview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-gray-300 text-sm font-medium">
                Coins: {currentCoins.length} denominations
              </span>
              <div className="w-3 h-3 bg-blue-400 rounded-full ml-4"></div>
              <span className="text-gray-300 text-sm font-medium">
                Target: {currentAmount}
              </span>
            </div>

            {/* visual representation */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* coins display */}
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm font-medium w-16">
                  Coins:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {currentCoins.map((coin, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-400/30 rounded-full flex items-center justify-center"
                    >
                      <span className="text-yellow-200 font-mono font-semibold text-sm">
                        {coin}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* target amount */}
              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm font-medium w-16">
                  Target:
                </span>
                <div className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-lg">
                  <span className="text-blue-200 font-mono font-bold text-lg">
                    {currentAmount}
                  </span>
                </div>
              </div>

              {/* problem equation */}
              <div className="text-center mt-4">
                <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-lg">
                  <span className="text-purple-200 font-mono text-sm">
                    Find min coins from [{currentCoins.join(", ")}] to make{" "}
                    {currentAmount}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={onOpenModal}
            className="flex items-center gap-2 px-4 py-3 text-sm active:scale-95 backdrop-blur-md bg-gradient-to-r from-yellow-500/15 to-orange-500/15 border border-yellow-400/30 rounded-xl text-yellow-200 hover:from-yellow-500/25 hover:to-orange-500/25 hover:scale-105 transition-all duration-200 font-medium shadow-lg"
          >
            <Coins size={16} />
            Customize Problem
          </button>

          {/* quick stats */}
          <div className="text-center space-y-1">
            <div className="text-gray-400 text-xs">Problem Stats</div>
            <div className="text-cyan-400 font-bold text-sm">
              {currentCoins.length} coins, range {minCoinValue}-{maxCoinValue}
            </div>
            <div className="text-gray-500 text-xs">
              {canGreedySolve ? "Greedy works" : "Greedy may fail"}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default CoinChangeCustomizer;

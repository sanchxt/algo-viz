import { Link } from "lucide-react";
import { motion } from "framer-motion";

interface LinkedListCustomizerProps {
  currentValues: number[];
  onOpenModal: () => void;
}

const LinkedListCustomizer = ({
  currentValues,
  onOpenModal,
}: LinkedListCustomizerProps) => {
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
            Current Linked List
          </h3>

          {/* linked list preview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-gray-300 text-sm font-medium">
                Nodes: {currentValues.length}
              </span>
            </div>

            {/* visual representation */}
            <motion.div
              className="flex items-center gap-2 overflow-x-auto pb-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {currentValues.map((value, index) => (
                <div key={index} className="flex items-center gap-2">
                  {/* node */}
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-lg flex items-center justify-center">
                    <span className="text-blue-200 font-mono font-semibold text-sm">
                      {value}
                    </span>
                  </div>

                  {/* arrow */}
                  {index < currentValues.length - 1 && (
                    <div className="flex-shrink-0 text-gray-400 text-lg">→</div>
                  )}
                </div>
              ))}

              {/* null terminator */}
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 text-gray-400 text-lg">→</div>
                <div className="flex-shrink-0 px-3 py-2 bg-gray-500/20 border border-gray-400/30 rounded-lg">
                  <span className="text-gray-400 font-mono text-xs">null</span>
                </div>
              </div>
            </motion.div>

            {/* list as array notation */}
            <div className="text-center mt-4">
              <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-lg">
                <span className="text-purple-200 font-mono text-sm">
                  [{currentValues.join(", ")}]
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
            <Link size={16} />
            Customize List
          </button>

          {/* quick stats */}
          <div className="text-center">
            <div className="text-gray-400 text-xs">Nodes to reverse</div>
            <div className="text-cyan-400 font-bold text-lg">
              {currentValues.length}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default LinkedListCustomizer;

import { motion } from "framer-motion";
import { Type } from "lucide-react";

interface StringCustomizerProps {
  currentString1: string;
  currentString2: string;
  onOpenModal: () => void;
}

const StringCustomizer = ({
  currentString1,
  currentString2,
  onOpenModal,
}: StringCustomizerProps) => {
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
            Current Strings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* string 1 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300 text-sm font-medium">
                  String 1:
                </span>
              </div>
              <motion.div
                className="px-4 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-blue-200 font-mono font-semibold">
                  "{currentString1}"
                </span>
                <div className="text-blue-300/70 text-xs mt-1">
                  {currentString1.length} character
                  {currentString1.length !== 1 ? "s" : ""}
                </div>
              </motion.div>
            </div>

            {/* string 2 */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <span className="text-gray-300 text-sm font-medium">
                  String 2:
                </span>
              </div>
              <motion.div
                className="px-4 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                <span className="text-purple-200 font-mono font-semibold">
                  "{currentString2}"
                </span>
                <div className="text-purple-300/70 text-xs mt-1">
                  {currentString2.length} character
                  {currentString2.length !== 1 ? "s" : ""}
                </div>
              </motion.div>
            </div>
          </div>

          {/* length comparison */}
          <div className="mt-4 flex items-center justify-center">
            <div
              className={`px-3 py-1 rounded-lg text-xs font-medium ${
                currentString1.length === currentString2.length
                  ? "bg-emerald-500/20 border border-emerald-400/30 text-emerald-200"
                  : "bg-amber-500/20 border border-amber-400/30 text-amber-200"
              }`}
            >
              Length{" "}
              {currentString1.length === currentString2.length
                ? "Match"
                : "Mismatch"}
              : {currentString1.length} vs {currentString2.length}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={onOpenModal}
            className="flex items-center gap-2 px-4 py-3 text-sm active:scale-95 backdrop-blur-md bg-gradient-to-r from-emerald-500/15 to-blue-500/15 border border-emerald-400/30 rounded-xl text-emerald-200 hover:from-emerald-500/25 hover:to-blue-500/25 hover:scale-105 transition-all duration-200 font-medium shadow-lg"
          >
            <Type size={16} />
            Customize Strings
          </button>

          {/* quick indicator */}
          <div className="text-center">
            <div className="text-gray-400 text-xs">Potential anagrams?</div>
            <div
              className={`text-xs font-bold ${
                currentString1
                  .toLowerCase()
                  .replace(/\s+/g, "")
                  .split("")
                  .sort()
                  .join("") ===
                currentString2
                  .toLowerCase()
                  .replace(/\s+/g, "")
                  .split("")
                  .sort()
                  .join("")
                  ? "text-emerald-400"
                  : "text-red-400"
              }`}
            >
              {currentString1
                .toLowerCase()
                .replace(/\s+/g, "")
                .split("")
                .sort()
                .join("") ===
              currentString2
                .toLowerCase()
                .replace(/\s+/g, "")
                .split("")
                .sort()
                .join("")
                ? "Likely YES"
                : "Likely NO"}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default StringCustomizer;

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import type { EnhancedAlgorithmStep } from "@/types/algorithm";

interface AnagramDetectionCanvasProps {
  currentStep: EnhancedAlgorithmStep;
  initialString1: string;
  initialString2: string;
  speed?: number;
}

const AnagramDetectionCanvas = ({
  currentStep,
  initialString1,
  initialString2,
}: AnagramDetectionCanvasProps) => {
  // Refs for scrollable containers
  const frequencyMap1Ref = useRef<HTMLDivElement>(null);
  const frequencyMap2Ref = useRef<HTMLDivElement>(null);

  // Extract data structures from current step
  const string1Data =
    currentStep.dataStructures.string1?.data || initialString1.split("");
  const string2Data =
    currentStep.dataStructures.string2?.data || initialString2.split("");
  const frequencyMap1Data =
    currentStep.dataStructures.frequencyMap1?.data || {};
  const frequencyMap2Data =
    currentStep.dataStructures.frequencyMap2?.data || {};

  // Helper functions to extract highlighting information
  const getHighlightsByStyle = (dsKey: string, style: string): number[] => {
    const highlights = currentStep.highlights[dsKey] || [];
    const matching = highlights.find((h) => h.style === style);
    return matching?.values || [];
  };

  const getStringHighlights = (stringKey: string) => ({
    current: getHighlightsByStyle(stringKey, "current"),
    active: getHighlightsByStyle(stringKey, "active"),
    match: getHighlightsByStyle(stringKey, "match"),
    mismatch: getHighlightsByStyle(stringKey, "mismatch"),
  });

  const getHashmapHighlights = (hashmapKey: string) => ({
    highlight: getHighlightsByStyle(hashmapKey, "highlight"),
    match: getHighlightsByStyle(hashmapKey, "match"),
    mismatch: getHighlightsByStyle(hashmapKey, "mismatch"),
  });

  const string1Highlights = getStringHighlights("string1");
  const string2Highlights = getStringHighlights("string2");
  const hashmap1Highlights = getHashmapHighlights("frequencyMap1");
  const hashmap2Highlights = getHashmapHighlights("frequencyMap2");

  // auto-scroll to highlighted characters in frequency maps
  useEffect(() => {
    const scrollToHighlightedChar = (
      containerRef: React.RefObject<HTMLDivElement | null>,
      highlights: any,
      mapData: Record<string, number>
    ) => {
      if (!containerRef.current || !highlights.highlight?.length) return;

      const highlightedChar = highlights.highlight[0];
      const charIndex = Object.keys(mapData).indexOf(highlightedChar);

      if (charIndex === -1) return;

      // calculate the position of the highlighted character
      // each character entry is approximately 56px tall (48px + 8px gap)
      const itemHeight = 56;
      const scrollPosition = charIndex * itemHeight;

      // Smooth scroll to the highlighted character
      containerRef.current.scrollTo({
        top: scrollPosition,
        behavior: "smooth",
      });
    };

    // scroll to highlighted characters in both frequency maps
    scrollToHighlightedChar(
      frequencyMap1Ref,
      hashmap1Highlights,
      frequencyMap1Data
    );
    scrollToHighlightedChar(
      frequencyMap2Ref,
      hashmap2Highlights,
      frequencyMap2Data
    );
  }, [
    hashmap1Highlights,
    hashmap2Highlights,
    frequencyMap1Data,
    frequencyMap2Data,
  ]);

  // character styling helper
  const getCharacterStyle = (index: number, highlights: any): string => {
    if (highlights.match?.includes(index)) {
      return "from-emerald-400 via-emerald-500 to-emerald-600 border-emerald-300/50";
    }
    if (highlights.mismatch?.includes(index)) {
      return "from-red-400 via-red-500 to-red-600 border-red-300/50";
    }
    if (highlights.current?.includes(index)) {
      return "from-yellow-400 via-yellow-500 to-yellow-600 border-yellow-300/50";
    }
    if (highlights.active?.includes(index)) {
      return "from-blue-400 via-blue-500 to-blue-600 border-blue-300/50";
    }
    return "from-gray-400 via-gray-500 to-gray-600 border-gray-300/30";
  };

  // hashmap key styling helper
  const getHashmapKeyStyle = (key: string, highlights: any): string => {
    if (highlights.match?.includes(key)) {
      return "bg-emerald-500/30 border-emerald-400/50 text-emerald-200";
    }
    if (highlights.mismatch?.includes(key)) {
      return "bg-red-500/30 border-red-400/50 text-red-200";
    }
    if (highlights.highlight?.includes(key)) {
      return "bg-yellow-500/30 border-yellow-400/50 text-yellow-200";
    }
    return "bg-white/10 border-white/20 text-white";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 120, damping: 12 },
    },
  };

  return (
    <div className="relative pb-8">
      {/* result display */}
      {currentStep.variables?.isAnagram !== undefined &&
        currentStep.variables?.isAnagram !== null && (
          <motion.div
            className="flex justify-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div
              className={`px-6 py-3 rounded-xl border font-bold text-lg ${
                currentStep.variables.isAnagram
                  ? "bg-emerald-500/20 border-emerald-400/30 text-emerald-200"
                  : "bg-red-500/20 border-red-400/30 text-red-200"
              }`}
            >
              {currentStep.variables.isAnagram
                ? "✓ ANAGRAMS!"
                : "✗ NOT ANAGRAMS"}
            </div>
          </motion.div>
        )}

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* left Column - strings */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* string 1 */}
          <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              String 1: "{initialString1}"
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {string1Data.map((char: string, index: number) => (
                <motion.div
                  key={`s1-${index}-${char}`}
                  className={`
                    relative flex items-center justify-center w-12 h-12 rounded-lg
                    bg-gradient-to-br border backdrop-blur-sm font-mono font-bold text-white
                    ${getCharacterStyle(index, string1Highlights)}
                  `}
                  animate={{
                    scale:
                      string1Highlights.current?.includes(index) ||
                      string1Highlights.active?.includes(index)
                        ? 1.1
                        : 1,
                    y: string1Highlights.current?.includes(index) ? -3 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {char}
                  <span className="absolute -bottom-6 text-xs text-gray-400 font-medium">
                    {index}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* string 2 */}
          <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              String 2: "{initialString2}"
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {string2Data.map((char: string, index: number) => (
                <motion.div
                  key={`s2-${index}-${char}`}
                  className={`
                    relative flex items-center justify-center w-12 h-12 rounded-lg
                    bg-gradient-to-br border backdrop-blur-sm font-mono font-bold text-white
                    ${getCharacterStyle(index, string2Highlights)}
                  `}
                  animate={{
                    scale:
                      string2Highlights.current?.includes(index) ||
                      string2Highlights.active?.includes(index)
                        ? 1.1
                        : 1,
                    y: string2Highlights.current?.includes(index) ? -3 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {char}
                  <span className="absolute -bottom-6 text-xs text-gray-400 font-medium">
                    {index}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* right Column - frequency maps */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* frequency map 1 */}
          <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              Frequency Map 1
            </h3>
            <div
              ref={frequencyMap1Ref}
              className="h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
            >
              <div className="space-y-2 min-h-full">
                {Object.keys(frequencyMap1Data).length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-400 italic">
                    Building frequency map...
                  </div>
                ) : (
                  Object.entries(frequencyMap1Data).map(([key, value]) => (
                    <motion.div
                      key={`fm1-${key}`}
                      className={`
                        flex items-center justify-between p-3 rounded-lg border
                        ${getHashmapKeyStyle(key, hashmap1Highlights)}
                      `}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="font-mono font-bold">'{key}'</span>
                      <span className="font-mono font-bold text-lg">
                        {value as number}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* frequency map 2 */}
          <div className="backdrop-blur-md bg-white/5 border border-white/20 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              Frequency Map 2
            </h3>
            <div
              ref={frequencyMap2Ref}
              className="h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
            >
              <div className="space-y-2 min-h-full">
                {Object.keys(frequencyMap2Data).length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-400 italic">
                    Building frequency map...
                  </div>
                ) : (
                  Object.entries(frequencyMap2Data).map(([key, value]) => (
                    <motion.div
                      key={`fm2-${key}`}
                      className={`
                        flex items-center justify-between p-3 rounded-lg border
                        ${getHashmapKeyStyle(key, hashmap2Highlights)}
                      `}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="font-mono font-bold">'{key}'</span>
                      <span className="font-mono font-bold text-lg">
                        {value as number}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* processing indicator */}
      {currentStep.variables?.processingString && (
        <motion.div
          className="flex justify-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3 px-4 py-2 bg-amber-500/20 border border-amber-400/30 rounded-lg">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            <span className="text-amber-200 text-sm font-medium">
              Processing String {currentStep.variables.processingString}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AnagramDetectionCanvas;

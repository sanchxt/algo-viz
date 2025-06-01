import { useState } from "react";
import { motion } from "framer-motion";
import { SkipBack, Play, Pause, SkipForward, RotateCcw } from "lucide-react";

import SpeedControl from "./SpeedControl";

interface PlaybackControlsProps {
  currentStepIndex: number;
  totalSteps: number;
  isAutoPlaying: boolean;
  playbackSpeed: number;
  onPreviousStep: () => void;
  onNextStep: () => void;
  onToggleAutoPlay: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

const PlaybackControls = ({
  currentStepIndex,
  totalSteps,
  isAutoPlaying,
  playbackSpeed,
  onPreviousStep,
  onNextStep,
  onToggleAutoPlay,
  onReset,
  onSpeedChange,
}: PlaybackControlsProps) => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  const isAtStart = currentStepIndex === 0;
  const isAtEnd = currentStepIndex >= totalSteps - 1;

  return (
    <motion.div
      className="flex items-center justify-center gap-4 mb-8 relative z-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
    >
      {/* previous button */}
      <div className="relative">
        <button
          onClick={onPreviousStep}
          disabled={isAtStart}
          onMouseEnter={() => setHoveredButton("previous")}
          onMouseLeave={() => setHoveredButton(null)}
          className="flex items-center justify-center w-10 h-10 text-xs bg-white/5 border border-white/20 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/15 hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
        >
          <SkipBack size={16} />
        </button>
        {hoveredButton === "previous" && !isAtStart && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg shadow-lg border border-gray-700 whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-200">
            Previous Step
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
          </div>
        )}
      </div>

      {/* play/pause button */}
      <div className="relative">
        <button
          onClick={onToggleAutoPlay}
          onMouseEnter={() => setHoveredButton("play")}
          onMouseLeave={() => setHoveredButton(null)}
          className="flex items-center justify-center w-14 h-12 text-xs bg-white/10 border border-white/20 rounded-lg text-white font-semibold hover:bg-white/15 hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
        >
          {isAutoPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
        {hoveredButton === "play" && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg shadow-lg border border-gray-700 whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-200">
            {isAutoPlaying ? "Pause" : isAtEnd ? "Restart" : "Auto Play"}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
          </div>
        )}
      </div>

      {/* next button */}
      <div className="relative">
        <button
          onClick={onNextStep}
          disabled={isAtEnd}
          onMouseEnter={() => setHoveredButton("next")}
          onMouseLeave={() => setHoveredButton(null)}
          className="flex items-center justify-center w-10 h-10 text-xs bg-white/5 border border-white/20 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/15 hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
        >
          <SkipForward size={20} />
        </button>
        {hoveredButton === "next" && !isAtEnd && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg shadow-lg border border-gray-700 whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-200">
            Next Step
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>

      {/* reset button */}
      <div className="relative">
        <button
          onClick={onReset}
          onMouseEnter={() => setHoveredButton("reset")}
          onMouseLeave={() => setHoveredButton(null)}
          className="flex items-center justify-center w-10 h-10 text-xs bg-white/0 border border-white/20 rounded-lg text-white font-semibold hover:bg-white/15 hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 ml-2"
        >
          <RotateCcw size={20} />
        </button>
        {hoveredButton === "reset" && (
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg shadow-lg border border-gray-700 whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-200">
            Reset
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        )}
      </div>

      {/* speed control */}
      <SpeedControl
        playbackSpeed={playbackSpeed}
        onSpeedChange={onSpeedChange}
      />
    </motion.div>
  );
};

export default PlaybackControls;

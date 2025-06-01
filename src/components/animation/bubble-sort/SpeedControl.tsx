import { useState } from "react";

interface SpeedControlProps {
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
}

const SpeedControl = ({ playbackSpeed, onSpeedChange }: SpeedControlProps) => {
  const [hoveredSpeedControl, setHoveredSpeedControl] = useState(false);

  return (
    <div className="relative ml-6">
      <div
        className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/20 rounded-lg"
        onMouseEnter={() => setHoveredSpeedControl(true)}
        onMouseLeave={() => setHoveredSpeedControl(false)}
      >
        {/* speed label */}
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium">Speed:</span>
          <span className="text-white text-sm font-semibold w-8 text-center">
            {playbackSpeed}x
          </span>
        </div>

        {/* speed slider */}
        <div className="flex items-center gap-2">
          <span className="text-gray-300 text-xs">0.25x</span>
          <input
            type="range"
            min="0.25"
            max="3"
            step="0.25"
            value={playbackSpeed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
            className="w-20 h-2 bg-white/20 rounded-lg appearance-none cursor-pointer speed-slider"
          />
          <span className="text-gray-300 text-xs">3x</span>
        </div>
      </div>

      {/* speed control tooltip */}
      {hoveredSpeedControl && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg shadow-lg border border-gray-700 whitespace-nowrap animate-in fade-in slide-in-from-bottom-2 duration-200">
          Adjust playback speed
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
        </div>
      )}

      {/* CSS for speed slider */}
      <style>
        {`
        .speed-slider::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: rgb(var(--color-primary-400));
          border: 2px solid white;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.15s ease;
        }
        .speed-slider::-webkit-slider-thumb:hover {
          background: rgb(var(--color-primary-300));
          transform: scale(1.1);
        }
        .speed-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: rgb(var(--color-primary-400));
          border: 2px solid white;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          border: none;
        }
        .speed-slider::-moz-range-track {
          background: rgba(255, 255, 255, 0.2);
          height: 8px;
          border-radius: 4px;
        }
      `}
      </style>
    </div>
  );
};

export default SpeedControl;

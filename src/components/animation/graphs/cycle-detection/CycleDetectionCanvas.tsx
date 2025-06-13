import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState, useMemo, useCallback } from "react";

import type { EnhancedAlgorithmStep } from "@/types/algorithm";

interface GraphNode {
  id: string;
  label: string;
  position: { x: number; y: number };
}

interface GraphEdge {
  id: string;
  from: string;
  to: string;
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  visited: string[];
  currentPath: string[];
  cycleEdges: string[];
  currentNode: string | null;
  parentMap: { [nodeId: string]: string | null };
  currentComponent: number;
  adjacencyList: { [nodeId: string]: string[] };
}

interface CycleDetectionCanvasProps {
  currentStep: EnhancedAlgorithmStep;
  initialNodes: GraphNode[];
  initialEdges: GraphEdge[];
}

// layout constants
const NODE_RADIUS = 25;
const MOBILE_BREAKPOINT = 768;
const MIN_CANVAS_WIDTH = 600;
const MIN_CANVAS_HEIGHT = 400;

// calculate canvas dimensions based on graph
const calculateCanvasDimensions = (nodes: GraphNode[], isMobile: boolean) => {
  if (nodes.length === 0) {
    return { width: MIN_CANVAS_WIDTH, height: MIN_CANVAS_HEIGHT };
  }

  const padding = 100;
  const maxX = Math.max(...nodes.map((n) => n.position.x));
  const maxY = Math.max(...nodes.map((n) => n.position.y));
  const minX = Math.min(...nodes.map((n) => n.position.x));
  const minY = Math.min(...nodes.map((n) => n.position.y));

  const baseWidth = Math.max(MIN_CANVAS_WIDTH, maxX - minX + padding * 2);
  const baseHeight = Math.max(MIN_CANVAS_HEIGHT, maxY - minY + padding * 2);

  if (isMobile) {
    return {
      width: Math.min(baseWidth, window.innerWidth - 40),
      height: Math.min(baseHeight, 500),
    };
  }

  return {
    width: baseWidth,
    height: baseHeight,
  };
};

// visited set component
const VisitedSetVisualization = ({
  visited,
  currentNode,
  currentPath,
  allNodes,
  isMobile,
}: {
  visited: string[];
  currentNode: string | null;
  currentPath: string[];
  allNodes: GraphNode[];
  isMobile: boolean;
}) => {
  return (
    <motion.div
      className={`
        backdrop-blur-md bg-gray-900/60 border border-white/20 rounded-xl p-4
        ${isMobile ? "w-full mt-4" : "w-48 h-fit"}
      `}
      initial={{ opacity: 0, x: isMobile ? 0 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-3 h-3 bg-emerald-400 rounded border border-emerald-300"></div>
        <h4 className="text-white font-semibold text-sm">Visited Set</h4>
      </div>

      {/* set visualization */}
      <div className="space-y-2">
        <div className="text-gray-300 text-xs mb-2">
          Size: {visited.length} / {allNodes.length}
        </div>

        {/* visited nodes in set format */}
        <div
          className={`
          ${isMobile ? "flex flex-wrap gap-2" : "grid grid-cols-2 gap-2"}
          max-h-40 overflow-y-auto
        `}
        >
          {allNodes.map((node) => {
            const isVisited = visited.includes(node.id);
            const isCurrent = currentNode === node.id;
            const isInPath = currentPath.includes(node.id);

            return (
              <motion.div
                key={node.id}
                className={`
                  px-2 py-1 rounded-lg border text-xs font-mono font-bold text-center
                  transition-all duration-300
                  ${
                    isVisited
                      ? isCurrent
                        ? "bg-blue-500/30 border-blue-400/50 text-blue-200 scale-110"
                        : isInPath
                        ? "bg-purple-500/30 border-purple-400/50 text-purple-200"
                        : "bg-emerald-500/30 border-emerald-400/50 text-emerald-200"
                      : "bg-gray-600/20 border-gray-500/30 text-gray-400"
                  }
                `}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: isVisited ? (isCurrent ? 1.1 : 1) : 0.9,
                  opacity: isVisited ? 1 : 0.5,
                }}
                transition={{ duration: 0.3 }}
              >
                {node.label}
              </motion.div>
            );
          })}
        </div>

        {/* set operations indicator */}
        <AnimatePresence>
          {currentNode && (
            <motion.div
              className="mt-3 p-2 bg-blue-500/20 border border-blue-400/30 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-blue-200 text-xs font-medium">
                visited.add("{currentNode}")
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* current path indicator */}
        {currentPath.length > 0 && (
          <div className="mt-3 p-2 bg-purple-500/20 border border-purple-400/30 rounded-lg">
            <div className="text-purple-200 text-xs font-medium mb-1">
              DFS Path:
            </div>
            <div className="text-purple-200 text-xs font-mono">
              [{currentPath.join(" → ")}]
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const CycleDetectionCanvas = ({
  currentStep,
  initialNodes,
  initialEdges,
}: CycleDetectionCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // responsive handler
  const updateDimensions = useCallback(() => {
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  // canvas dimensions
  const canvasDimensions = useMemo(() => {
    return calculateCanvasDimensions(initialNodes, isMobile);
  }, [initialNodes, isMobile]);

  // extract graph data from current step
  const graphData: GraphData = useMemo(() => {
    return (
      currentStep.dataStructures.graph?.data || {
        nodes: initialNodes,
        edges: initialEdges,
        visited: [],
        currentPath: [],
        cycleEdges: [],
        currentNode: null,
        parentMap: {},
        currentComponent: 0,
        adjacencyList: {},
      }
    );
  }, [currentStep.dataStructures.graph?.data, initialNodes, initialEdges]);

  const { nodes, edges, visited, currentPath, cycleEdges, currentNode } =
    graphData;

  // extract highlights from current step
  const highlights = useMemo(() => {
    const highlightsData = currentStep.highlights.graph || [];
    const getHighlightByStyle = (style: string) =>
      highlightsData.find((h) => h.style === style)?.values || [];

    return {
      currentNodes: getHighlightByStyle("current"),
      visitedNodes: getHighlightByStyle("visited"),
      exploringNodes: getHighlightByStyle("exploring"),
      cycleNodes: getHighlightByStyle("cycle"),
      pathNodes: getHighlightByStyle("path"),
      backtrackNodes: getHighlightByStyle("backtrack"),
      exploringEdges: getHighlightByStyle("exploring"),
      cycleEdges: getHighlightByStyle("cycle"),
    };
  }, [currentStep.highlights.graph]);

  // node style calculator
  const getNodeStyle = useCallback(
    (nodeId: string) => {
      if (highlights.cycleNodes.includes(nodeId)) {
        return {
          fill: "rgb(239 68 68 / 0.8)", // red
          stroke: "rgb(239 68 68)",
          strokeWidth: "3",
          class: "animate-pulse",
        };
      }
      if (highlights.currentNodes.includes(nodeId)) {
        return {
          fill: "rgb(59 130 246 / 0.8)", // blue
          stroke: "rgb(59 130 246)",
          strokeWidth: "3",
          class: "",
        };
      }
      if (highlights.exploringNodes.includes(nodeId)) {
        return {
          fill: "rgb(245 158 11 / 0.8)", // amber
          stroke: "rgb(245 158 11)",
          strokeWidth: "3",
          class: "",
        };
      }
      if (highlights.backtrackNodes.includes(nodeId)) {
        return {
          fill: "rgb(156 163 175 / 0.6)", // gray
          stroke: "rgb(156 163 175)",
          strokeWidth: "2",
          class: "",
        };
      }
      if (highlights.pathNodes.includes(nodeId)) {
        return {
          fill: "rgb(139 92 246 / 0.7)", // violet
          stroke: "rgb(139 92 246)",
          strokeWidth: "2",
          class: "",
        };
      }
      if (highlights.visitedNodes.includes(nodeId)) {
        return {
          fill: "rgb(34 197 94 / 0.6)", // green
          stroke: "rgb(34 197 94)",
          strokeWidth: "2",
          class: "",
        };
      }
      return {
        fill: "rgb(75 85 99 / 0.4)", // gray default
        stroke: "rgb(156 163 175)",
        strokeWidth: "2",
        class: "",
      };
    },
    [highlights]
  );

  // edge style calculator
  const getEdgeStyle = useCallback(
    (edgeId: string) => {
      if (
        highlights.cycleEdges.includes(edgeId) ||
        cycleEdges.includes(edgeId)
      ) {
        return {
          stroke: "rgb(239 68 68)", // red
          strokeWidth: "4",
          class: "animate-pulse",
          opacity: "1",
        };
      }
      if (highlights.exploringEdges.includes(edgeId)) {
        return {
          stroke: "rgb(245 158 11)", // amber
          strokeWidth: "3",
          class: "",
          opacity: "0.9",
        };
      }
      return {
        stroke: "rgb(139 92 246)", // violet default
        strokeWidth: "2",
        class: "",
        opacity: "0.6",
      };
    },
    [highlights, cycleEdges]
  );

  // scale positions for canvas
  const scalePosition = useCallback(
    (position: { x: number; y: number }) => {
      const scale = isMobile ? 0.8 : 1;
      const offsetX = 50;
      const offsetY = 50;

      return {
        x: position.x * scale + offsetX,
        y: position.y * scale + offsetY,
      };
    },
    [isMobile]
  );

  // calculate edge path
  const calculateEdgePath = useCallback(
    (edge: GraphEdge) => {
      const fromNode = nodes.find((n) => n.id === edge.from);
      const toNode = nodes.find((n) => n.id === edge.to);

      if (!fromNode || !toNode) return "";

      const fromPos = scalePosition(fromNode.position);
      const toPos = scalePosition(toNode.position);

      // calculate edge points (from edge of circles, not centers)
      const dx = toPos.x - fromPos.x;
      const dy = toPos.y - fromPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance === 0) return "";

      const unitX = dx / distance;
      const unitY = dy / distance;

      const startX = fromPos.x + unitX * NODE_RADIUS;
      const startY = fromPos.y + unitY * NODE_RADIUS;
      const endX = toPos.x - unitX * NODE_RADIUS;
      const endY = toPos.y - unitY * NODE_RADIUS;

      return `M ${startX} ${startY} L ${endX} ${endY}`;
    },
    [nodes, scalePosition]
  );

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-full overflow-x-auto overflow-y-auto pb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <div
          className={`flex ${
            isMobile ? "flex-col" : "flex-row"
          } gap-6 items-start`}
        >
          {/* main graph container */}
          <div
            ref={containerRef}
            className="relative bg-gray-900/30 rounded-xl p-8 border border-white/10 flex-1"
            style={{
              width: isMobile ? "100%" : canvasDimensions.width,
              height: canvasDimensions.height,
              minWidth: isMobile ? "auto" : MIN_CANVAS_WIDTH,
            }}
          >
            {/* SVG visualization */}
            <svg
              className="absolute top-0 left-0 w-full h-full"
              style={{ zIndex: 1 }}
              viewBox={`0 0 ${canvasDimensions.width} ${canvasDimensions.height}`}
            >
              <defs>
                {/* arrowhead markers for directed edges if needed */}
                <marker
                  id="arrowhead"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="rgb(139 92 246)" />
                </marker>
                <marker
                  id="arrowhead-cycle"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="rgb(239 68 68)" />
                </marker>
              </defs>

              {/* render edges */}
              <AnimatePresence>
                {edges.map((edge) => {
                  const path = calculateEdgePath(edge);
                  const style = getEdgeStyle(edge.id);

                  if (!path) return null;

                  return (
                    <motion.path
                      key={`edge-${edge.id}`}
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{
                        pathLength: 1,
                        opacity: style.opacity,
                      }}
                      exit={{ opacity: 0 }}
                      transition={{
                        pathLength: { duration: 0.6, ease: "easeInOut" },
                        opacity: { duration: 0.3 },
                      }}
                      d={path}
                      stroke={style.stroke}
                      strokeWidth={style.strokeWidth}
                      fill="none"
                      className={style.class}
                    />
                  );
                })}
              </AnimatePresence>

              {/* render nodes */}
              <AnimatePresence>
                {nodes.map((node) => {
                  const position = scalePosition(node.position);
                  const style = getNodeStyle(node.id);

                  return (
                    <motion.g
                      key={`node-${node.id}`}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: 1,
                        scale: highlights.currentNodes.includes(node.id)
                          ? 1.2
                          : 1,
                      }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                    >
                      <circle
                        cx={position.x}
                        cy={position.y}
                        r={NODE_RADIUS}
                        fill={style.fill}
                        stroke={style.stroke}
                        strokeWidth={style.strokeWidth}
                        className={style.class}
                      />
                      <text
                        x={position.x}
                        y={position.y + 6}
                        textAnchor="middle"
                        fontSize="16"
                        fontWeight="bold"
                        fill="white"
                        className="select-none"
                      >
                        {node.label}
                      </text>
                    </motion.g>
                  );
                })}
              </AnimatePresence>

              {/* current path indicator */}
              {currentPath.length > 1 && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                >
                  {currentPath.slice(0, -1).map((nodeId, index) => {
                    const fromNode = nodes.find((n) => n.id === nodeId);
                    const toNode = nodes.find(
                      (n) => n.id === currentPath[index + 1]
                    );

                    if (!fromNode || !toNode) return null;

                    const fromPos = scalePosition(fromNode.position);
                    const toPos = scalePosition(toNode.position);

                    return (
                      <line
                        key={`path-${index}`}
                        x1={fromPos.x}
                        y1={fromPos.y}
                        x2={toPos.x}
                        y2={toPos.y}
                        stroke="rgb(168 85 247)"
                        strokeWidth="6"
                        strokeDasharray="8 4"
                        opacity="0.6"
                      />
                    );
                  })}
                </motion.g>
              )}
            </svg>

            {/* statistics overlay */}
            <motion.div
              className="absolute top-4 right-4 backdrop-blur-md bg-black/20 rounded-lg p-3 text-white text-sm space-y-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Nodes: {nodes.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-0.5 bg-purple-400"></div>
                <span>Edges: {edges.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Visited: {visited.length}</span>
              </div>
              {cycleEdges.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span>Cycle Found!</span>
                </div>
              )}
            </motion.div>
          </div>

          {/* visited set visualization - desktop right side, mobile bottom */}
          {!isMobile && (
            <VisitedSetVisualization
              visited={visited}
              currentNode={currentNode}
              currentPath={currentPath}
              allNodes={nodes}
              isMobile={isMobile}
            />
          )}
        </div>

        {/* visited set visualization - mobile bottom */}
        {isMobile && (
          <VisitedSetVisualization
            visited={visited}
            currentNode={currentNode}
            currentPath={currentPath}
            allNodes={nodes}
            isMobile={isMobile}
          />
        )}
      </div>

      {/* step explanation */}
      <motion.div
        className="mt-4 text-center text-gray-300 w-full max-w-4xl"
        key={currentStep.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm font-medium tracking-wide leading-relaxed">
          {currentStep.explanation}
        </p>
      </motion.div>
    </div>
  );
};

export default CycleDetectionCanvas;

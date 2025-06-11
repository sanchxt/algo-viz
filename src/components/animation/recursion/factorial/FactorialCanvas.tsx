import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState, useMemo, useCallback } from "react";

import type { EnhancedAlgorithmStep } from "@/types/algorithm";

interface CallFrame {
  id: string;
  n: number;
  returnValue?: number;
  isActive: boolean;
  level: number;
  parentId?: string;
}

interface RecursionTreeNode {
  id: string;
  n: number;
  returnValue?: number;
  level: number;
  parentId?: string;
  children: string[];
  position: { x: number; y: number };
  status: "pending" | "active" | "completed";
}

interface FactorialCanvasProps {
  currentStep: EnhancedAlgorithmStep;
  initialN: number;
  speed?: number;
}

const MOBILE_BREAKPOINT = 768;
const CALL_STACK_WIDTH = 300;
const NODE_SIZE = 60;

const FactorialCanvas = ({ currentStep }: FactorialCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // handle responsive layout
  const updateDimensions = useCallback(() => {
    const screenWidth = window.innerWidth;
    setIsMobile(screenWidth < MOBILE_BREAKPOINT);
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [updateDimensions]);

  // extract data from current step
  const callStackData: CallFrame[] = useMemo(() => {
    return currentStep.dataStructures.callStack?.data || [];
  }, [currentStep.dataStructures.callStack?.data]);

  const recursionTreeData: { [id: string]: RecursionTreeNode } = useMemo(() => {
    return currentStep.dataStructures.recursionTree?.data || {};
  }, [currentStep.dataStructures.recursionTree?.data]);

  // extract highlights
  const highlights = useMemo(() => {
    const callStackHighlights = currentStep.highlights.callStack || [];
    const treeHighlights = currentStep.highlights.recursionTree || [];

    const getHighlightStyle = (highlights: any[], style: string) =>
      highlights.find((h) => h.style === style)?.values || [];

    return {
      activeCallFrames: getHighlightStyle(callStackHighlights, "active"),
      baseCallFrames: getHighlightStyle(callStackHighlights, "base_case"),
      returningCallFrames: getHighlightStyle(callStackHighlights, "returning"),
      activeTreeNodes: getHighlightStyle(treeHighlights, "active"),
      baseTreeNodes: getHighlightStyle(treeHighlights, "base_case"),
      returningTreeNodes: getHighlightStyle(treeHighlights, "returning"),
      matchTreeNodes: getHighlightStyle(treeHighlights, "match"),
    };
  }, [currentStep.highlights]);

  // get return value display text
  const getReturnValueDisplay = useCallback((callFrame: CallFrame) => {
    if (!callFrame.returnValue) return "";

    // base case (n <= 1) just returns 1
    if (callFrame.n <= 1) {
      return `returns: 1`;
    }

    return `returns: ${callFrame.n} × factorial(${callFrame.n - 1}) = ${
      callFrame.returnValue
    }`;
  }, []);

  // get tree node return value display
  const getTreeNodeReturnDisplay = useCallback((node: RecursionTreeNode) => {
    if (!node.returnValue) return "";

    return `${node.returnValue}`;
  }, []);

  // determine if return value should be visible for call frame
  const shouldShowCallFrameReturnValue = useCallback(
    (callFrame: CallFrame) => {
      const isBaseCase = highlights.baseCallFrames.includes(callFrame.id);
      const isReturning = highlights.returningCallFrames.includes(callFrame.id);
      const stepType = currentStep.stepType;

      // only show return values during specific step types
      return (
        callFrame.returnValue !== undefined &&
        (stepType === "base_case_reached" ||
          stepType === "recursive_return" ||
          stepType === "call_stack_pop" ||
          stepType === "return" ||
          isBaseCase ||
          isReturning)
      );
    },
    [highlights, currentStep.stepType]
  );

  // call stack styling
  const getCallFrameStyle = useCallback(
    (callFrame: CallFrame) => {
      if (highlights.baseCallFrames.includes(callFrame.id)) {
        return "from-emerald-400 via-emerald-500 to-emerald-600 border-emerald-300/70 ring-2 ring-emerald-300/50";
      }
      if (highlights.returningCallFrames.includes(callFrame.id)) {
        return "from-purple-400 via-purple-500 to-purple-600 border-purple-300/70 ring-2 ring-purple-300/50";
      }
      if (highlights.activeCallFrames.includes(callFrame.id)) {
        return "from-blue-400 via-blue-500 to-blue-600 border-blue-300/70 ring-2 ring-blue-300/50";
      }
      return "from-gray-400 via-gray-500 to-gray-600 border-gray-300/50";
    },
    [highlights]
  );

  // determine if return value should be visible for tree node
  const shouldShowTreeNodeReturnValue = useCallback(
    (node: RecursionTreeNode) => {
      const isBaseCase = highlights.baseTreeNodes.includes(node.id);
      const isReturning = highlights.returningTreeNodes.includes(node.id);
      const isCompleted = highlights.matchTreeNodes.includes(node.id);
      const stepType = currentStep.stepType;

      // only show return values during specific step types
      return (
        node.returnValue !== undefined &&
        (stepType === "base_case_reached" ||
          stepType === "recursive_return" ||
          stepType === "call_stack_pop" ||
          stepType === "return" ||
          isBaseCase ||
          isReturning ||
          isCompleted)
      );
    },
    [highlights, currentStep.stepType]
  );

  // tree node styling
  const getTreeNodeStyle = useCallback(
    (nodeId: string) => {
      if (highlights.baseTreeNodes.includes(nodeId)) {
        return "from-emerald-400 via-emerald-500 to-emerald-600 border-emerald-300/70 ring-2 ring-emerald-300/50";
      }
      if (highlights.returningTreeNodes.includes(nodeId)) {
        return "from-purple-400 via-purple-500 to-purple-600 border-purple-300/70 ring-2 ring-purple-300/50";
      }
      if (highlights.activeTreeNodes.includes(nodeId)) {
        return "from-blue-400 via-blue-500 to-blue-600 border-blue-300/70 ring-2 ring-blue-300/50";
      }
      if (highlights.matchTreeNodes.includes(nodeId)) {
        return "from-amber-400 via-amber-500 to-amber-600 border-amber-300/70 ring-2 ring-amber-300/50";
      }
      return "from-gray-400 via-gray-500 to-gray-600 border-gray-300/50";
    },
    [highlights]
  );

  // tree connections
  const treeConnections = useMemo(() => {
    const connections: {
      from: { x: number; y: number };
      to: { x: number; y: number };
      parentId: string;
      childId: string;
    }[] = [];

    Object.values(recursionTreeData).forEach((node) => {
      if (node.parentId && recursionTreeData[node.parentId]) {
        const parent = recursionTreeData[node.parentId];
        connections.push({
          from: {
            x: parent.position.x + NODE_SIZE / 2,
            y: parent.position.y + NODE_SIZE,
          },
          to: { x: node.position.x + NODE_SIZE / 2, y: node.position.y },
          parentId: node.parentId,
          childId: node.id,
        });
      }
    });

    return connections;
  }, [recursionTreeData]);

  // container dimensions
  const containerDimensions = useMemo(() => {
    if (isMobile) {
      return {
        width: "100%",
        height: "auto",
        minHeight: "600px",
      };
    }

    const treeNodes = Object.values(recursionTreeData);
    if (treeNodes.length === 0) {
      return { width: "100%", height: "400px", minHeight: "400px" };
    }

    const maxX = Math.max(...treeNodes.map((n) => n.position.x)) + NODE_SIZE;
    const maxY = Math.max(...treeNodes.map((n) => n.position.y)) + NODE_SIZE;

    return {
      width: Math.max(800, CALL_STACK_WIDTH + maxX + 100),
      height: Math.max(400, maxY + 100),
      minHeight: "400px",
    };
  }, [isMobile, recursionTreeData]);

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-full overflow-auto pb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <div
          ref={containerRef}
          className="relative bg-gray-900/30 rounded-xl p-6 border border-white/10 mx-auto"
          style={containerDimensions}
        >
          {isMobile ? (
            // mobile layout: stacked vertically
            <div className="flex flex-col gap-8">
              {/* call stack */}
              <div className="w-full">
                <h3 className="text-white text-lg font-semibold mb-4 text-center">
                  Call Stack
                </h3>
                <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
                  <AnimatePresence>
                    {callStackData.map((callFrame, index) => (
                      <motion.div
                        key={callFrame.id}
                        layoutId={`call-frame-${callFrame.id}`}
                        className={`relative p-4 rounded-lg border-2 bg-gradient-to-r text-white font-bold shadow-lg ${getCallFrameStyle(
                          callFrame
                        )}`}
                        initial={{ opacity: 0, scale: 0.8, y: -20 }}
                        animate={{
                          opacity: 1,
                          scale: callFrame.isActive ? 1.05 : 1,
                          y: 0,
                        }}
                        exit={{ opacity: 0, scale: 0.8, y: -20 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                          delay: index * 0.1,
                        }}
                      >
                        <div className="text-center">
                          <div className="text-sm font-mono">
                            factorial({callFrame.n})
                          </div>
                          {shouldShowCallFrameReturnValue(callFrame) && (
                            <motion.div
                              className="text-xs mt-1 font-mono"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ delay: 0.2 }}
                            >
                              {getReturnValueDisplay(callFrame)}
                            </motion.div>
                          )}
                        </div>
                        {/* level indicator */}
                        <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white/50 rounded-r"></div>
                        <div className="absolute -left-4 top-1/2 transform -translate-y-1/2 text-xs text-gray-300">
                          {callFrame.level}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* recursion tree */}
              <div className="w-full">
                <h3 className="text-white text-lg font-semibold mb-4 text-center">
                  Recursion Tree
                </h3>
                <div className="relative bg-gray-800/30 rounded-lg p-4 min-h-64">
                  {/* SVG for connections */}
                  <svg
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    style={{ zIndex: 0 }}
                  >
                    <defs>
                      <marker
                        id="arrowhead"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto"
                      >
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#9ca3af" />
                      </marker>
                    </defs>
                    <AnimatePresence>
                      {treeConnections.map((connection, index) => (
                        <motion.line
                          key={`${connection.parentId}-${connection.childId}`}
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 0.7 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          x1={connection.from.x}
                          y1={connection.from.y}
                          x2={connection.to.x}
                          y2={connection.to.y}
                          stroke="#9ca3af"
                          strokeWidth="2"
                          markerEnd="url(#arrowhead)"
                        />
                      ))}
                    </AnimatePresence>
                  </svg>

                  {/* tree nodes */}
                  <AnimatePresence>
                    {Object.values(recursionTreeData).map((node, index) => (
                      <motion.div
                        key={node.id}
                        layoutId={`tree-node-${node.id}`}
                        className={`absolute flex flex-col items-center justify-center bg-gradient-to-br rounded-lg border-2 text-white font-bold shadow-lg z-10 ${getTreeNodeStyle(
                          node.id
                        )}`}
                        style={{
                          left: node.position.x,
                          top: node.position.y,
                          width: NODE_SIZE,
                          height: NODE_SIZE,
                        }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{
                          opacity: 1,
                          scale: highlights.activeTreeNodes.includes(node.id)
                            ? 1.15
                            : 1,
                        }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                          delay: index * 0.05,
                        }}
                      >
                        <div className="text-xs font-mono text-center">
                          f({node.n})
                        </div>
                        {shouldShowTreeNodeReturnValue(node) && (
                          <motion.div
                            className="text-[10px] font-mono text-center mt-1"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ delay: 0.2 }}
                          >
                            {getTreeNodeReturnDisplay(node)}
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ) : (
            // desktop layout: side by side
            <div className="flex gap-8 h-full">
              {/* call stack - left side */}
              <div
                className="flex-shrink-0"
                style={{ width: CALL_STACK_WIDTH }}
              >
                <h3 className="text-white text-lg font-semibold mb-4 text-center">
                  Call Stack
                </h3>
                <div className="flex flex-col gap-2 max-h-full overflow-y-auto">
                  <AnimatePresence>
                    {callStackData.map((callFrame, index) => (
                      <motion.div
                        key={callFrame.id}
                        layoutId={`call-frame-${callFrame.id}`}
                        className={`relative p-4 rounded-lg border-2 bg-gradient-to-r text-white font-bold shadow-lg ${getCallFrameStyle(
                          callFrame
                        )}`}
                        initial={{ opacity: 0, scale: 0.8, x: -20 }}
                        animate={{
                          opacity: 1,
                          scale: callFrame.isActive ? 1.05 : 1,
                          x: 0,
                        }}
                        exit={{ opacity: 0, scale: 0.8, x: -20 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                          delay: index * 0.1,
                        }}
                      >
                        <div className="text-center">
                          <div className="text-sm font-mono">
                            factorial({callFrame.n})
                          </div>
                          {shouldShowCallFrameReturnValue(callFrame) && (
                            <motion.div
                              className="text-xs mt-1 font-mono"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ delay: 0.2 }}
                            >
                              {getReturnValueDisplay(callFrame)}
                            </motion.div>
                          )}
                        </div>
                        {/* level indicator */}
                        <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white/50 rounded-r"></div>
                        <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 text-xs text-gray-300">
                          L{callFrame.level}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* recursion tree - right side */}
              <div className="flex-1 relative">
                <h3 className="text-white text-lg font-semibold mb-4 text-center">
                  Recursion Tree
                </h3>
                <div className="relative bg-gray-800/30 rounded-lg p-4 h-full min-h-64">
                  {/* SVG for connections */}
                  <svg
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    style={{ zIndex: 0 }}
                  >
                    <defs>
                      <marker
                        id="arrowhead"
                        viewBox="0 0 10 10"
                        refX="8"
                        refY="5"
                        markerWidth="6"
                        markerHeight="6"
                        orient="auto"
                      >
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#9ca3af" />
                      </marker>
                    </defs>
                    <AnimatePresence>
                      {treeConnections.map((connection, index) => (
                        <motion.line
                          key={`${connection.parentId}-${connection.childId}`}
                          initial={{ pathLength: 0, opacity: 0 }}
                          animate={{ pathLength: 1, opacity: 0.7 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          x1={connection.from.x}
                          y1={connection.from.y}
                          x2={connection.to.x}
                          y2={connection.to.y}
                          stroke="#9ca3af"
                          strokeWidth="2"
                          markerEnd="url(#arrowhead)"
                        />
                      ))}
                    </AnimatePresence>
                  </svg>

                  {/* tree nodes */}
                  <AnimatePresence>
                    {Object.values(recursionTreeData).map((node, index) => (
                      <motion.div
                        key={node.id}
                        layoutId={`tree-node-${node.id}`}
                        className={`absolute flex flex-col items-center justify-center bg-gradient-to-br rounded-lg border-2 text-white font-bold shadow-lg z-10 ${getTreeNodeStyle(
                          node.id
                        )}`}
                        style={{
                          left: node.position.x,
                          top: node.position.y,
                          width: NODE_SIZE,
                          height: NODE_SIZE,
                        }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{
                          opacity: 1,
                          scale: highlights.activeTreeNodes.includes(node.id)
                            ? 1.15
                            : 1,
                        }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                          delay: index * 0.05,
                        }}
                      >
                        <div className="text-xs font-mono text-center">
                          f({node.n})
                        </div>
                        {shouldShowTreeNodeReturnValue(node) && (
                          <motion.div
                            className="text-[10px] font-mono text-center mt-1"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ delay: 0.2 }}
                          >
                            {node.returnValue}
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* explanation */}
      <motion.div
        className="mt-4 text-center text-gray-300 w-full"
        key={currentStep.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm font-medium tracking-wide">
          {currentStep.explanation}
        </p>
      </motion.div>
    </div>
  );
};

export default FactorialCanvas;

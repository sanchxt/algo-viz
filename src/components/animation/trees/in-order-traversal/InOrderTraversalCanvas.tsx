import { motion, AnimatePresence } from "framer-motion";
import {
  useRef,
  useEffect,
  useState,
  useMemo,
  useCallback,
  memo,
  type JSX,
} from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

import type { EnhancedAlgorithmStep } from "@/types/algorithm";

interface TreeNode {
  id: string;
  value: number;
  left: string | null;
  right: string | null;
  position?: { x: number; y: number };
}

interface CallStackFrame {
  id: string;
  nodeId: string | null;
  phase: "entering" | "left_done" | "visiting" | "right_done" | "returning";
  parentCallId?: string;
  depth: number;
}

interface TreeData {
  nodes: TreeNode[];
  root: string | null;
}

interface InOrderTraversalCanvasProps {
  currentStep: EnhancedAlgorithmStep;
  speed?: number;
}

const NODE_SIZE = 50;
const HORIZONTAL_SPACING = 80;
const VERTICAL_SPACING = 80;
const MOBILE_BREAKPOINT = 768;
const CALL_STACK_WIDTH = 250;

const calculateTreeHeight = (
  nodes: TreeNode[],
  nodeId: string | null
): number => {
  if (!nodeId) return 0;
  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return 0;

  const leftHeight = calculateTreeHeight(nodes, node.left);
  const rightHeight = calculateTreeHeight(nodes, node.right);

  return 1 + Math.max(leftHeight, rightHeight);
};

const getSubtreeWidth = (nodes: TreeNode[], nodeId: string | null): number => {
  if (!nodeId) return 0;
  const node = nodes.find((n) => n.id === nodeId);
  if (!node) return 0;

  const leftWidth = getSubtreeWidth(nodes, node.left);
  const rightWidth = getSubtreeWidth(nodes, node.right);

  return Math.max(
    NODE_SIZE,
    leftWidth +
      rightWidth +
      (leftWidth > 0 && rightWidth > 0 ? HORIZONTAL_SPACING : 0)
  );
};

const calculateTreeLayout = (
  nodes: TreeNode[],
  rootId: string | null,
  containerWidth: number
) => {
  if (!rootId || nodes.length === 0)
    return { positions: new Map(), treeWidth: 0, treeHeight: 0 };

  const positions = new Map<string, { x: number; y: number }>();

  const positionNode = (
    nodeId: string | null,
    x: number,
    y: number,
    availableWidth: number
  ): void => {
    if (!nodeId) return;
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    const leftWidth = getSubtreeWidth(nodes, node.left);
    positions.set(nodeId, { x: x + availableWidth / 2 - NODE_SIZE / 2, y });

    if (node.left) {
      positionNode(node.left, x, y + VERTICAL_SPACING, leftWidth);
    }

    if (node.right) {
      const rightX = x + leftWidth + (leftWidth > 0 ? HORIZONTAL_SPACING : 0);
      const rightAvailableWidth =
        availableWidth - leftWidth - (leftWidth > 0 ? HORIZONTAL_SPACING : 0);
      positionNode(
        node.right,
        rightX,
        y + VERTICAL_SPACING,
        rightAvailableWidth
      );
    }
  };

  const totalTreeWidth = getSubtreeWidth(nodes, rootId);
  // canvas height is based on tree height
  const treeHeight =
    calculateTreeHeight(nodes, rootId) * VERTICAL_SPACING + NODE_SIZE;
  const startX = Math.max(0, (containerWidth - totalTreeWidth) / 2);

  positionNode(rootId, startX, 40, totalTreeWidth);

  return { positions, treeWidth: totalTreeWidth, treeHeight: treeHeight };
};

const MemoizedTreeNode = memo(
  ({
    node,
    position,
    styleClasses,
    isScaled,
    index,
  }: {
    node: TreeNode;
    position: { x: number; y: number };
    styleClasses: string;
    isScaled: boolean;
    index: number;
  }) => (
    <motion.div
      key={node.id}
      layoutId={`tree-node-${node.id}`}
      className={`absolute flex items-center justify-center bg-gradient-to-br rounded-full text-white font-bold text-lg shadow-lg border-2 z-10 ${styleClasses}`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        left: position.x,
        top: position.y,
        width: NODE_SIZE,
        height: NODE_SIZE,
        opacity: 1,
        scale: isScaled ? 1.15 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        delay: index * 0.05,
      }}
    >
      {node.value}
    </motion.div>
  )
);

const MemoizedCallStackFrame = memo(
  ({
    frame,
    styleClasses,
    index,
  }: {
    frame: CallStackFrame;
    styleClasses: string;
    index: number;
  }) => (
    <motion.div
      key={frame.id}
      layoutId={`call-frame-${frame.id}`}
      className={`p-2 rounded-lg border text-xs font-mono ${styleClasses}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="font-semibold">inOrder({frame.nodeId || "null"})</div>
      <div className="text-xs opacity-75 mt-1">Phase: {frame.phase}</div>
      <div className="text-xs opacity-75">Depth: {frame.depth}</div>
    </motion.div>
  )
);

const MemoizedResultItem = memo(
  ({
    value,
    index,
    styleClasses,
    isScaled,
  }: {
    value: number;
    index: number;
    styleClasses: string;
    isScaled: boolean;
  }) => (
    <motion.div
      key={`result-${index}`}
      layoutId={`result-value-${index}`}
      className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold border-2 ${styleClasses}`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{
        opacity: 1,
        scale: isScaled ? 1.1 : 1,
      }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      {value}
    </motion.div>
  )
);

const InOrderTraversalCanvas = ({
  currentStep,
}: InOrderTraversalCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const treeContainerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isCallStackCollapsed, setIsCallStackCollapsed] = useState(false);
  const [treeContainerWidth, setTreeContainerWidth] = useState(600);

  // resize handler
  const updateDimensions = useCallback(() => {
    const screenWidth = window.innerWidth;
    setIsMobile(screenWidth < MOBILE_BREAKPOINT);
    if (treeContainerRef.current) {
      setTreeContainerWidth(treeContainerRef.current.offsetWidth);
    }
  }, []);

  useEffect(() => {
    updateDimensions();

    let timeoutId: NodeJS.Timeout;
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDimensions, 150);
    };

    window.addEventListener("resize", debouncedUpdate);
    return () => {
      window.removeEventListener("resize", debouncedUpdate);
      clearTimeout(timeoutId);
    };
  }, [updateDimensions]);

  // data extraction
  const treeData: TreeData = currentStep.dataStructures.tree?.data || {
    nodes: [],
    root: null,
  };
  const callStackData: CallStackFrame[] =
    currentStep.dataStructures.callStack?.data || [];
  const resultData: number[] = currentStep.dataStructures.result?.data || [];

  // tree layout
  const treeLayout = useMemo(() => {
    return calculateTreeLayout(
      treeData.nodes,
      treeData.root,
      treeContainerWidth
    );
  }, [treeData.nodes, treeData.root, treeContainerWidth, isMobile]);

  // highlights processing
  const highlights = useMemo(() => {
    const treeHighlights = currentStep.highlights.tree || [];
    const callStackHighlights = currentStep.highlights.callStack || [];
    const resultHighlights = currentStep.highlights.result || [];

    const getHighlightStyle = (highlights: any[], style: string) =>
      highlights.find((h) => h.style === style)?.values || [];

    return {
      tree: {
        current: getHighlightStyle(treeHighlights, "current"),
        visited: getHighlightStyle(treeHighlights, "visited"),
        processing: getHighlightStyle(treeHighlights, "processing"),
        match: getHighlightStyle(treeHighlights, "match"),
      },
      callStack: {
        highlight: getHighlightStyle(callStackHighlights, "highlight"),
        active: getHighlightStyle(callStackHighlights, "active"),
        baseCase: getHighlightStyle(callStackHighlights, "base_case"),
        returning: getHighlightStyle(callStackHighlights, "returning"),
      },
      result: {
        highlight: getHighlightStyle(resultHighlights, "highlight"),
        match: getHighlightStyle(resultHighlights, "match"),
      },
    };
  }, [currentStep.highlights]);

  // node style calculation
  const getNodeStyle = useCallback(
    (nodeId: string) => {
      if (highlights.tree.current.includes(nodeId)) {
        return "from-blue-400 via-blue-500 to-blue-600 border-blue-300/70 ring-4 ring-blue-300/50";
      }
      if (highlights.tree.processing.includes(nodeId)) {
        return "from-amber-400 via-amber-500 to-amber-600 border-amber-300/70 ring-2 ring-amber-300/40";
      }
      if (highlights.tree.visited.includes(nodeId)) {
        return "from-emerald-400 via-emerald-500 to-emerald-600 border-emerald-300/70";
      }
      if (highlights.tree.match.includes(nodeId)) {
        return "from-purple-400 via-purple-500 to-purple-600 border-purple-300/70 ring-2 ring-purple-300/40";
      }
      return "from-gray-400 via-gray-500 to-gray-600 border-gray-300/50";
    },
    [highlights.tree]
  );

  const getResultStyle = useCallback(
    (index: number) => {
      if (highlights.result.highlight.includes(index)) {
        return "bg-emerald-500/30 border-emerald-400/60 text-emerald-200 ring-2 ring-emerald-400/40";
      }
      if (highlights.result.match.includes(index)) {
        return "bg-purple-500/30 border-purple-400/60 text-purple-200";
      }
      return "bg-blue-500/20 border-blue-400/40 text-blue-200";
    },
    [highlights.result]
  );

  // call stack frame style
  const getCallStackFrameStyle = useCallback(
    (frameId: string) => {
      if (highlights.callStack.active.includes(frameId)) {
        return "bg-blue-500/20 border-blue-400/50 text-blue-200";
      }
      if (highlights.callStack.highlight.includes(frameId)) {
        return "bg-amber-500/20 border-amber-400/50 text-amber-200";
      }
      if (highlights.callStack.baseCase.includes(frameId)) {
        return "bg-red-500/20 border-red-400/50 text-red-200";
      }
      if (highlights.callStack.returning.includes(frameId)) {
        return "bg-purple-500/20 border-purple-400/50 text-purple-200";
      }
      return "bg-white/5 border-white/20 text-gray-300";
    },
    [highlights.callStack]
  );

  // tree connections rendering
  const renderTreeConnections = useMemo(() => {
    if (!treeData.root || treeLayout.positions.size === 0) return null;

    const connections: JSX.Element[] = [];

    treeData.nodes.forEach((node) => {
      const nodePos = treeLayout.positions.get(node.id);
      if (!nodePos) return;

      const nodeCenterX = nodePos.x + NODE_SIZE / 2;
      const nodeCenterY = nodePos.y + NODE_SIZE / 2;

      // left child connection
      if (node.left) {
        const leftPos = treeLayout.positions.get(node.left);
        if (leftPos) {
          const leftCenterX = leftPos.x + NODE_SIZE / 2;
          const leftCenterY = leftPos.y + NODE_SIZE / 2;

          connections.push(
            <motion.line
              key={`${node.id}-${node.left}`}
              x1={nodeCenterX}
              y1={nodeCenterY}
              x2={leftCenterX}
              y2={leftCenterY}
              stroke="#6b7280"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          );
        }
      }

      // right child connection
      if (node.right) {
        const rightPos = treeLayout.positions.get(node.right);
        if (rightPos) {
          const rightCenterX = rightPos.x + NODE_SIZE / 2;
          const rightCenterY = rightPos.y + NODE_SIZE / 2;

          connections.push(
            <motion.line
              key={`${node.id}-${node.right}`}
              x1={nodeCenterX}
              y1={nodeCenterY}
              x2={rightCenterX}
              y2={rightCenterY}
              stroke="#6b7280"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            />
          );
        }
      }
    });

    return connections;
  }, [treeData.nodes, treeData.root, treeLayout.positions]);

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <div
          ref={containerRef}
          className="mx-auto flex w-full max-w-7xl flex-col rounded-xl border border-white/10 bg-gray-900/30 p-4 md:flex-row md:gap-x-4"
          style={{
            minWidth: isMobile ? 350 : 800,
          }}
        >
          {/* left column */}
          <div className="flex flex-1 flex-col gap-y-4">
            {/* tree visualization */}
            <div
              ref={treeContainerRef}
              className="relative rounded-lg bg-black/10 p-2"
              style={{
                width: "100%",
                height: treeLayout.treeHeight + NODE_SIZE,
                minHeight: 250,
              }}
            >
              <h3 className="absolute top-2 left-3 text-white font-semibold text-sm">
                Binary Tree
              </h3>
              <svg
                className="absolute top-0 left-0 w-full h-full"
                style={{ zIndex: 0 }}
              >
                <AnimatePresence>{renderTreeConnections}</AnimatePresence>
              </svg>

              <AnimatePresence>
                {treeData.nodes.map((node, index) => {
                  const position = treeLayout.positions.get(node.id);
                  if (!position) return null;

                  const styleClasses = getNodeStyle(node.id);
                  const isScaled = highlights.tree.current.includes(node.id);

                  return (
                    <MemoizedTreeNode
                      key={node.id}
                      node={node}
                      position={position}
                      styleClasses={styleClasses}
                      isScaled={isScaled}
                      index={index}
                    />
                  );
                })}
              </AnimatePresence>
            </div>

            {/* result array visualization */}
            <div className="w-full">
              <h3 className="text-white font-semibold text-sm mb-3">
                Traversal Result
              </h3>
              <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/20 rounded-lg min-h-[70px] overflow-x-auto">
                {resultData.length === 0 ? (
                  <div className="text-gray-400 text-xs italic">
                    No values yet...
                  </div>
                ) : (
                  <AnimatePresence>
                    {resultData.map((value, index) => {
                      const styleClasses = getResultStyle(index);
                      const isScaled =
                        highlights.result.highlight.includes(index);
                      return (
                        <MemoizedResultItem
                          key={`result-${index}`}
                          value={value}
                          index={index}
                          styleClasses={styleClasses}
                          isScaled={isScaled}
                        />
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
            </div>
          </div>

          {/* right column */}
          <div
            className="mt-6 flex-shrink-0 md:mt-0"
            style={{
              width: isMobile ? "100%" : CALL_STACK_WIDTH,
            }}
          >
            <div className="rounded-lg bg-black/10 p-3 h-full">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-semibold text-sm">Call Stack</h3>
                <button
                  onClick={() => setIsCallStackCollapsed(!isCallStackCollapsed)}
                  className="flex items-center justify-center w-6 h-6 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors"
                >
                  {isCallStackCollapsed ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronUp size={14} />
                  )}
                </button>
              </div>

              <AnimatePresence>
                {!isCallStackCollapsed && (
                  <motion.div
                    className="space-y-2 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {callStackData.length === 0 ? (
                      <div className="text-gray-400 text-xs italic text-center py-4">
                        No active calls
                      </div>
                    ) : (
                      callStackData
                        .slice()
                        .reverse()
                        .map((frame, index) => {
                          const styleClasses = getCallStackFrameStyle(frame.id);
                          return (
                            <MemoizedCallStackFrame
                              key={frame.id}
                              frame={frame}
                              styleClasses={styleClasses}
                              index={index}
                            />
                          );
                        })
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

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

export default InOrderTraversalCanvas;

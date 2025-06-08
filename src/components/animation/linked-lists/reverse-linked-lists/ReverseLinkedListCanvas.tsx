import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState, useMemo, useCallback } from "react";

import type { EnhancedAlgorithmStep } from "@/types/algorithm";

interface LinkedListNode {
  id: string;
  value: number;
  next: string | null;
}

interface LinkedListData {
  nodes: LinkedListNode[];
  head: string | null;
  reversedLinks: string[];
  reversingMeta?: {
    from: string;
    to: string | null;
    originalNext: string | null;
  };
}

interface ReverseLinkedListCanvasProps {
  currentStep: EnhancedAlgorithmStep;
  initialValues: number[];
  speed?: number;
}

// layout constants
const NODE_SIZE = 60;
const HORIZONTAL_SPACING = 120;
const VERTICAL_SPACING = 100;
const MOBILE_BREAKPOINT = 768;

// dimension calculations
const calculateDimensions = (nodeCount: number, isMobile: boolean) => {
  if (isMobile) {
    const requiredHeight = (nodeCount - 1) * VERTICAL_SPACING + NODE_SIZE + 200;
    const requiredWidth = Math.max(350, NODE_SIZE + 200);
    return { width: requiredWidth, height: requiredHeight };
  } else {
    const nodesWidth = (nodeCount - 1) * HORIZONTAL_SPACING + NODE_SIZE;
    const paddingForPointers = 120;
    const nullTextSpace = 60;
    const requiredWidth = nodesWidth + paddingForPointers + nullTextSpace;
    const requiredHeight = 320;
    return { width: Math.max(600, requiredWidth), height: requiredHeight };
  }
};

// position calculations
const getNodePosition = (
  index: number,
  isMobile: boolean,
  containerDimensions: { width: number; height: number }
) => {
  if (isMobile) {
    return {
      x: containerDimensions.width / 2 - NODE_SIZE / 2,
      y: 80 + index * VERTICAL_SPACING,
    };
  } else {
    const leftPadding = 80;
    return {
      x: leftPadding + index * HORIZONTAL_SPACING,
      y: containerDimensions.height / 2 - NODE_SIZE / 2,
    };
  }
};

const ReverseLinkedListCanvas = ({
  currentStep,
  initialValues,
}: ReverseLinkedListCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // container dimensions calculation
  const containerDimensions = useMemo(() => {
    const nodeCount = initialValues.length;
    return calculateDimensions(nodeCount, isMobile);
  }, [initialValues.length, isMobile]);

  // resize handler
  const updateDimensions = useCallback(() => {
    const screenWidth = window.innerWidth;
    const isMobileView = screenWidth < MOBILE_BREAKPOINT;
    setIsMobile(isMobileView);
  }, []);

  useEffect(() => {
    updateDimensions();

    // debounce resize events
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

  // linked list data extraction
  const linkedListData: LinkedListData = useMemo(() => {
    return (
      currentStep.dataStructures.linkedList?.data || {
        nodes: [],
        head: null,
        reversedLinks: [],
      }
    );
  }, [currentStep.dataStructures.linkedList?.data]);

  const { nodes, head, reversedLinks, reversingMeta } = linkedListData;

  // variables extraction
  const { prevPointer, currentPointer, nextPointer } = useMemo(
    () => ({
      prevPointer: currentStep.variables?.prev,
      currentPointer: currentStep.variables?.current,
      nextPointer: currentStep.variables?.next,
    }),
    [currentStep.variables]
  );

  // highlights processing
  const highlights = useMemo(() => {
    const highlightsData = currentStep.highlights.linkedList || [];
    const getHighlightStyle = (style: string) =>
      highlightsData.find((h) => h.style === style)?.values || [];

    return {
      activeNodes: getHighlightStyle("active"),
      visitedNodes: getHighlightStyle("visited"),
      currentNodes: getHighlightStyle("current"),
      matchNodes: getHighlightStyle("match"),
    };
  }, [currentStep.highlights.linkedList]);

  // node index lookup
  const getNodeIndex = useCallback(
    (nodeId: string | null): number => {
      if (!nodeId) return -1;
      return nodes.findIndex((n) => n.id === nodeId);
    },
    [nodes]
  );

  // node style calculation
  const getNodeStyle = useCallback(
    (nodeId: string) => {
      if (highlights.activeNodes.includes(nodeId)) {
        return "from-amber-400 via-amber-500 to-amber-600 border-amber-300/70 ring-4 ring-amber-300/50";
      }
      if (highlights.currentNodes.includes(nodeId)) {
        return "from-blue-400 via-blue-500 to-blue-600 border-blue-300/70 ring-4 ring-blue-300/50";
      }
      if (highlights.visitedNodes.includes(nodeId)) {
        return "from-purple-400 via-purple-500 to-purple-600 border-purple-300/70";
      }
      if (highlights.matchNodes.includes(nodeId)) {
        return "from-emerald-400 via-emerald-500 to-emerald-600 border-emerald-300/70 ring-2 ring-emerald-300/40";
      }
      if (head === nodeId) {
        return "from-emerald-400 via-emerald-500 to-emerald-600 border-emerald-300/70 ring-3 ring-emerald-300/60";
      }
      return "from-gray-400 via-gray-500 to-gray-600 border-gray-300/50";
    },
    [head, highlights]
  );

  // position calculator
  const getNodePositionMemo = useCallback(
    (index: number) => {
      return getNodePosition(index, isMobile, containerDimensions);
    },
    [isMobile, containerDimensions]
  );

  // pointer rendering
  const renderPointers = useMemo(() => {
    const pointers = [];
    const pointerStyle =
      "absolute text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-lg";

    const getPointerPosition = (
      nodeId: string | null,
      offset: { x: number; y: number }
    ) => {
      const index = getNodeIndex(nodeId);
      if (index === -1) return { opacity: 0, scale: 0 };

      const nodePos = getNodePositionMemo(index);
      return {
        left: nodePos.x + NODE_SIZE / 2 + offset.x,
        top: nodePos.y + offset.y,
        x: "-50%", // Use transform for centering
        opacity: 1,
        scale: 1,
      };
    };

    if (prevPointer !== undefined) {
      const offset = isMobile ? { x: -70, y: NODE_SIZE / 2 } : { x: 0, y: -30 };
      pointers.push(
        <motion.div
          key="prev-pointer"
          className={`${pointerStyle} bg-purple-500`}
          layoutId="prev-pointer"
          initial={{ opacity: 0, scale: 0 }}
          animate={getPointerPosition(prevPointer, offset)}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          prev
        </motion.div>
      );
    }

    if (currentPointer !== undefined) {
      const offset = isMobile
        ? { x: 70, y: NODE_SIZE / 2 }
        : { x: 0, y: NODE_SIZE + 15 };
      pointers.push(
        <motion.div
          key="current-pointer"
          className={`${pointerStyle} bg-blue-500`}
          layoutId="current-pointer"
          initial={{ opacity: 0, scale: 0 }}
          animate={getPointerPosition(currentPointer, offset)}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          current
        </motion.div>
      );
    }

    if (nextPointer !== undefined) {
      const offset = isMobile ? { x: -70, y: -15 } : { x: 0, y: -30 };
      pointers.push(
        <motion.div
          key="next-pointer"
          className={`${pointerStyle} bg-amber-500`}
          layoutId="next-pointer"
          initial={{ opacity: 0, scale: 0 }}
          animate={getPointerPosition(nextPointer, offset)}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          next
        </motion.div>
      );
    }

    return <AnimatePresence>{pointers}</AnimatePresence>;
  }, [
    prevPointer,
    currentPointer,
    nextPointer,
    isMobile,
    getNodeIndex,
    getNodePositionMemo,
  ]);

  // null indicator
  const renderNullIndicator = useMemo(() => {
    const lastNodeIndex = nodes.length - 1;
    if (lastNodeIndex < 0) return null;

    const lastNodePos = getNodePositionMemo(lastNodeIndex);

    const positionStyle = isMobile
      ? {
          left: lastNodePos.x + NODE_SIZE / 2,
          top: lastNodePos.y + NODE_SIZE + 50,
          transform: "translateX(-50%)",
        }
      : {
          left: lastNodePos.x + NODE_SIZE + 20,
          top: lastNodePos.y + NODE_SIZE / 2 - 10,
        };

    return (
      <motion.div
        className="absolute text-gray-400 font-mono text-sm"
        style={positionStyle}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: nodes.length * 0.1 }}
      >
        null
      </motion.div>
    );
  }, [nodes.length, getNodePositionMemo, isMobile]);

  // arrow paths
  const arrowPaths = useMemo(() => {
    return nodes.map((node, i) => {
      const isReversed = reversedLinks.some((l) => l.startsWith(node.id));
      const isReversing = reversingMeta?.from === node.id;

      let path = "";
      let arrowMarker = "url(#arrowhead-gray)";
      let strokeColor = "#6b7280";

      const fromPos = getNodePositionMemo(i);

      if (isMobile) {
        const arrowStartY = fromPos.y + NODE_SIZE;
        const arrowStartX = fromPos.x + NODE_SIZE / 2;

        if (isReversing) {
          const toIndex = getNodeIndex(reversingMeta?.to ?? null);
          if (toIndex !== -1) {
            const toPos = getNodePositionMemo(toIndex);
            const toY = toPos.y + NODE_SIZE / 2;
            const toX = toPos.x;
            path = `M ${arrowStartX} ${arrowStartY} C ${arrowStartX - 60} ${
              arrowStartY + 30
            }, ${toX - 60} ${toY}, ${toX} ${toY}`;
            arrowMarker = "url(#arrowhead-emerald)";
            strokeColor = "#34d399";
          }
        } else if (isReversed) {
          const reversedLink = reversedLinks.find((l) => l.startsWith(node.id));
          const toNodeId = reversedLink?.split("-")[1] || null;
          const toIndex = getNodeIndex(toNodeId);
          if (toIndex !== -1) {
            const toPos = getNodePositionMemo(toIndex);
            const toY = toPos.y + NODE_SIZE / 2;
            const toX = toPos.x;
            path = `M ${arrowStartX} ${arrowStartY} C ${arrowStartX - 50} ${
              arrowStartY + 20
            }, ${toX - 50} ${toY}, ${toX} ${toY}`;
            arrowMarker = "url(#arrowhead-emerald)";
            strokeColor = "#34d399";
          }
        } else if (node.next) {
          const toIndex = getNodeIndex(node.next);
          if (toIndex !== -1) {
            const toPos = getNodePositionMemo(toIndex);
            const toY = toPos.y;
            const toX = toPos.x + NODE_SIZE / 2;
            path = `M ${arrowStartX} ${arrowStartY} L ${toX} ${toY}`;
          }
        }
      } else {
        // horizontal layout logic
        const arrowStartX = fromPos.x + NODE_SIZE;
        const arrowY = fromPos.y + NODE_SIZE / 2;

        if (isReversing) {
          const toIndex = getNodeIndex(reversingMeta?.to ?? null);
          if (toIndex !== -1) {
            const toPos = getNodePositionMemo(toIndex);
            const toX = toPos.x + NODE_SIZE;
            path = `M ${fromPos.x} ${arrowY} C ${arrowStartX} ${
              arrowY + 50
            }, ${toX} ${arrowY + 50}, ${toPos.x + NODE_SIZE} ${arrowY}`;
            arrowMarker = "url(#arrowhead-emerald)";
            strokeColor = "#34d399";
          }
        } else if (isReversed) {
          const reversedLink = reversedLinks.find((l) => l.startsWith(node.id));
          const toNodeId = reversedLink?.split("-")[1] || null;
          const toIndex = getNodeIndex(toNodeId);
          if (toIndex !== -1) {
            const toPos = getNodePositionMemo(toIndex);
            const toX = toPos.x + NODE_SIZE;
            path = `M ${fromPos.x} ${arrowY} C ${arrowStartX} ${
              arrowY + 40
            }, ${toX} ${arrowY + 40}, ${toX} ${arrowY}`;
            arrowMarker = "url(#arrowhead-emerald)";
            strokeColor = "#34d399";
          }
        } else if (node.next) {
          const toIndex = getNodeIndex(node.next);
          if (toIndex !== -1) {
            const toPos = getNodePositionMemo(toIndex);
            path = `M ${arrowStartX} ${arrowY} L ${toPos.x} ${arrowY}`;
          }
        }
      }

      return { path, arrowMarker, strokeColor, nodeId: node.id };
    });
  }, [
    nodes,
    reversedLinks,
    reversingMeta,
    isMobile,
    getNodePositionMemo,
    getNodeIndex,
  ]);

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-full overflow-x-auto overflow-y-auto pb-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <div
          ref={containerRef}
          className="relative bg-gray-900/30 rounded-xl p-8 border border-white/10 mx-auto"
          style={{
            width: containerDimensions.width,
            height: containerDimensions.height,
            minWidth: isMobile ? 350 : 600,
            maxWidth: isMobile ? "100vw" : "none",
          }}
        >
          {/* svg paths */}
          <svg
            className="absolute top-0 left-0 w-full h-full"
            style={{ zIndex: 0 }}
          >
            <defs>
              <marker
                id="arrowhead-gray"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#9ca3af" />
              </marker>
              <marker
                id="arrowhead-emerald"
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#34d399" />
              </marker>
            </defs>
            <AnimatePresence>
              {arrowPaths.map(({ path, arrowMarker, strokeColor, nodeId }) =>
                path ? (
                  <motion.path
                    key={`arrow-${nodeId}`}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      default: { duration: 0.5 },
                      opacity: { duration: 0.2 },
                    }}
                    d={path}
                    stroke={strokeColor}
                    strokeWidth="2"
                    fill="none"
                    markerEnd={arrowMarker}
                  />
                ) : null
              )}
            </AnimatePresence>
          </svg>

          {/* node rendering */}
          {nodes.map((node, index) => {
            const position = getNodePositionMemo(index);
            return (
              <motion.div
                key={node.id}
                layoutId={`node-${node.id}`}
                className={`absolute flex items-center justify-center bg-gradient-to-br rounded-full text-white font-bold text-lg shadow-lg border-2 z-10 ${getNodeStyle(
                  node.id
                )}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  left: position.x,
                  top: position.y,
                  width: NODE_SIZE,
                  height: NODE_SIZE,
                  opacity: 1,
                  scale: highlights.activeNodes.includes(node.id) ? 1.15 : 1,
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
            );
          })}

          {renderPointers}
          {renderNullIndicator}
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

export default ReverseLinkedListCanvas;

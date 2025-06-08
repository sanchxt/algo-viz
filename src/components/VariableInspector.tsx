import { useState, useMemo } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import type {
  EnhancedAlgorithmStep,
  DataStructureState,
  HighlightInfo,
} from "@/types/algorithm";

interface VariableInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep?: EnhancedAlgorithmStep;
  previousStep?: EnhancedAlgorithmStep;
  className?: string;
}

interface ExpandedSections {
  variables: boolean;
  [key: string]: boolean;
}

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

const VariableInspector = ({
  isOpen,
  onClose,
  currentStep,
  previousStep,
  className = "",
}: VariableInspectorProps) => {
  const getInitialExpandedSections = (): ExpandedSections => {
    const sections: ExpandedSections = { variables: true };
    if (currentStep?.dataStructures) {
      Object.keys(currentStep.dataStructures).forEach((key) => {
        sections[key] = true;
      });
    }
    return sections;
  };

  const [expandedSections, setExpandedSections] = useState<ExpandedSections>(
    getInitialExpandedSections()
  );

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // helper function to get array data from any DS
  const getArrayData = (
    dataStructure: DataStructureState | undefined
  ): number[] => {
    if (!dataStructure) return [];
    if (dataStructure.type === "array") {
      return dataStructure.data || [];
    }
    return [];
  };

  // helper function to get linked list data
  const getLinkedListData = (
    dataStructure: DataStructureState | undefined
  ): LinkedListData | null => {
    if (!dataStructure) return null;
    if (dataStructure.type === "linkedlist") {
      return dataStructure.data as LinkedListData;
    }
    return null;
  };

  // helper function to get highlights for a specific DS
  const getHighlightsByStyle = (
    highlights: HighlightInfo[] | undefined,
    style: string
  ): string[] => {
    if (!highlights) return [];
    const matching = highlights.find((h) => h.style === style);
    return matching?.values || [];
  };

  // helper function to get all highlights for arrays
  const getAllHighlights = (
    highlights: HighlightInfo[] | undefined
  ): {
    highlighted: number[];
    compared: number[];
    swapped: number[];
    found: number[];
    middle: number[];
    searchRange: number[];
    leftBoundary: number[];
    rightBoundary: number[];
    sorted: number[];
  } => {
    return {
      highlighted: getHighlightsByStyle(highlights, "highlight").map(Number),
      compared: getHighlightsByStyle(highlights, "compare").map(Number),
      swapped: getHighlightsByStyle(highlights, "swap").map(Number),
      found: getHighlightsByStyle(highlights, "match").map(Number),
      middle: getHighlightsByStyle(highlights, "current").map(Number),
      searchRange: getHighlightsByStyle(highlights, "active").map(Number),
      leftBoundary: getHighlightsByStyle(highlights, "highlight").map(Number),
      rightBoundary: getHighlightsByStyle(highlights, "visited").map(Number),
      sorted: getHighlightsByStyle(highlights, "match").map(Number),
    };
  };

  // helper function to get all highlights for linked lists
  const getLinkedListHighlights = (
    highlights: HighlightInfo[] | undefined
  ): {
    activeNodes: string[];
    visitedNodes: string[];
    currentNodes: string[];
    matchNodes: string[];
    reversedLinks: string[];
  } => {
    return {
      activeNodes: getHighlightsByStyle(highlights, "active"),
      visitedNodes: getHighlightsByStyle(highlights, "visited"),
      currentNodes: getHighlightsByStyle(highlights, "current"),
      matchNodes: getHighlightsByStyle(highlights, "match"),
      reversedLinks: getHighlightsByStyle(highlights, "reversed"),
    };
  };

  const variables = currentStep?.variables || {};
  const previousVariables = previousStep?.variables || {};

  const hasVariableChanged = (key: string): boolean => {
    return variables[key] !== previousVariables[key];
  };

  const hasDataStructureChanged = (key: string): boolean => {
    if (!previousStep || !currentStep) return false;

    const currentDS = currentStep.dataStructures[key];
    const previousDS = previousStep.dataStructures[key];

    if (!currentDS || !previousDS) return true;

    // compare based on data structure type
    if (currentDS.type === "array") {
      const currentData = getArrayData(currentDS);
      const previousData = getArrayData(previousDS);
      return JSON.stringify(currentData) !== JSON.stringify(previousData);
    } else if (currentDS.type === "linkedlist") {
      const currentData = getLinkedListData(currentDS);
      const previousData = getLinkedListData(previousDS);
      return JSON.stringify(currentData) !== JSON.stringify(previousData);
    }

    return JSON.stringify(currentDS.data) !== JSON.stringify(previousDS.data);
  };

  // get the display name for a DS
  const getDataStructureName = (key: string): string => {
    const commonNames: { [key: string]: string } = {
      searchArray: "Search Array",
      sortArray: "Sort Array",
      array: "Array",
      tree: "Tree",
      graph: "Graph",
      hashmap: "Hash Map",
      string: "String",
      linkedList: "Linked List",
    };
    return commonNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  // get appropriate color scheme for different DS
  const getColorScheme = (
    key: string
  ): { bg: string; border: string; dot: string } => {
    const colorSchemes: {
      [key: string]: { bg: string; border: string; dot: string };
    } = {
      searchArray: {
        bg: "bg-blue-500/20",
        border: "border-blue-400/30",
        dot: "bg-blue-400",
      },
      sortArray: {
        bg: "bg-purple-500/20",
        border: "border-purple-400/30",
        dot: "bg-purple-400",
      },
      array: {
        bg: "bg-purple-500/20",
        border: "border-purple-400/30",
        dot: "bg-purple-400",
      },
      tree: {
        bg: "bg-green-500/20",
        border: "border-green-400/30",
        dot: "bg-green-400",
      },
      graph: {
        bg: "bg-cyan-500/20",
        border: "border-cyan-400/30",
        dot: "bg-cyan-400",
      },
      hashmap: {
        bg: "bg-orange-500/20",
        border: "border-orange-400/30",
        dot: "bg-orange-400",
      },
      string: {
        bg: "bg-pink-500/20",
        border: "border-pink-400/30",
        dot: "bg-pink-400",
      },
      linkedList: {
        bg: "bg-emerald-500/20",
        border: "border-emerald-400/30",
        dot: "bg-emerald-400",
      },
    };
    return (
      colorSchemes[key] || {
        bg: "bg-gray-500/20",
        border: "border-gray-400/30",
        dot: "bg-gray-400",
      }
    );
  };

  // memoized data structures to prevent unnecessary re-renders
  const dataStructures = useMemo(() => {
    return currentStep?.dataStructures || {};
  }, [currentStep?.dataStructures]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* mobile overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* variable inspector content */}
          <motion.div
            initial={{
              opacity: 0,
              x: window.innerWidth >= 1024 ? 30 : 0,
              y: window.innerWidth < 1024 ? 50 : 0,
              scale: window.innerWidth < 1024 ? 0.95 : 1,
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              x: window.innerWidth >= 1024 ? 30 : 0,
              y: window.innerWidth < 1024 ? 50 : 0,
              scale: window.innerWidth < 1024 ? 0.95 : 1,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`
              ${className}
              lg:relative lg:z-auto lg:inset-auto lg:bg-transparent lg:border-0 lg:rounded-none lg:shadow-none lg:backdrop-blur-none
              fixed top-4 left-4 right-4 bottom-4 z-50 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden
            `}
          >
            {/* mobile close button */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                Variable Inspector
              </h3>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 backdrop-blur-md bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/15 transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <X size={16} />
              </button>
            </div>

            {/* desktop header */}
            <div className="hidden lg:flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                Variable Inspector
              </h3>
              {currentStep && (
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 rounded-lg border border-emerald-400/30">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-emerald-200 text-sm font-medium">
                    Step {currentStep.id + 1}
                  </span>
                </div>
              )}
            </div>

            {/* content */}
            <div className="p-6 overflow-y-auto" style={{ height: "500px" }}>
              {currentStep ? (
                <div className="space-y-6">
                  {/* variables section */}
                  <div>
                    <button
                      onClick={() => toggleSection("variables")}
                      className="flex items-center justify-between w-full mb-4 p-3 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="font-semibold">Variables</span>
                        {Object.keys(variables).some(hasVariableChanged) && (
                          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                        )}
                      </div>
                      <div
                        className={`${
                          expandedSections.variables ? "rotate-180" : "rotate-0"
                        } transition-transform duration-200`}
                      >
                        {expandedSections.variables ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </div>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        expandedSections.variables
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="space-y-3">
                        {Object.entries(variables).map(([key, value]) => {
                          const isChanged = hasVariableChanged(key);
                          return (
                            <motion.div
                              key={key}
                              className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                                isChanged
                                  ? "bg-yellow-500/20 border-yellow-400/30 shadow-lg shadow-yellow-400/10"
                                  : "bg-white/5 border-white/10"
                              }`}
                              animate={isChanged ? { scale: [1, 1.02, 1] } : {}}
                              transition={{ duration: 0.5 }}
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                                    isChanged ? "bg-yellow-400" : "bg-gray-500"
                                  }`}
                                />
                                <span className="text-gray-300 font-mono text-sm">
                                  {key}
                                </span>
                              </div>
                              <motion.span
                                className={`font-mono font-semibold transition-colors duration-200 ${
                                  isChanged ? "text-yellow-200" : "text-white"
                                }`}
                                animate={
                                  isChanged ? { scale: [1, 1.1, 1] } : {}
                                }
                                transition={{ duration: 0.3 }}
                              >
                                {String(value)}
                              </motion.span>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* data structures section */}
                  {Object.entries(dataStructures).map(
                    ([structureKey, structure]) => {
                      const hasChanged = hasDataStructureChanged(structureKey);
                      const colorScheme = getColorScheme(structureKey);
                      const displayName = getDataStructureName(structureKey);

                      // handle arrays
                      if (structure.type === "array") {
                        const arrayData = getArrayData(structure);
                        const highlights = currentStep.highlights[structureKey];
                        const allHighlights = getAllHighlights(highlights);

                        return (
                          <div key={structureKey}>
                            <button
                              onClick={() => toggleSection(structureKey)}
                              className="flex items-center justify-between w-full mb-4 p-3 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 ${colorScheme.dot} rounded-full`}
                                ></div>
                                <span className="font-semibold">
                                  {displayName}
                                </span>
                                {hasChanged && (
                                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                                )}
                              </div>
                              <div
                                className={`${
                                  expandedSections[structureKey]
                                    ? "rotate-180"
                                    : "rotate-0"
                                } transition-transform duration-200`}
                              >
                                {expandedSections[structureKey] ? (
                                  <EyeOff size={16} />
                                ) : (
                                  <Eye size={16} />
                                )}
                              </div>
                            </button>

                            <div
                              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                expandedSections[structureKey]
                                  ? "max-h-[500px] opacity-100"
                                  : "max-h-0 opacity-0"
                              }`}
                            >
                              <div
                                className={`p-4 rounded-xl border transition-all duration-300 ${
                                  hasChanged
                                    ? `${colorScheme.bg} ${colorScheme.border} shadow-lg`
                                    : "bg-white/5 border-white/10"
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="text-gray-300 text-sm font-medium">
                                    Length: {arrayData.length}
                                  </span>
                                  {hasChanged && (
                                    <span className="text-yellow-200 text-xs px-2 py-1 bg-yellow-500/20 rounded-lg border border-yellow-400/30 animate-in zoom-in duration-200">
                                      Modified
                                    </span>
                                  )}
                                </div>

                                <div className="grid grid-cols-1 gap-2">
                                  {/* array indices */}
                                  <div className="flex gap-1 mb-1 overflow-x-auto">
                                    {arrayData.map((_, index) => (
                                      <div
                                        key={`index-${index}`}
                                        className="min-w-[40px] flex-shrink-0 text-center text-xs text-gray-400 font-mono py-1"
                                      >
                                        [{index}]
                                      </div>
                                    ))}
                                  </div>

                                  {/* array values */}
                                  <div className="flex gap-1 overflow-x-auto pb-2">
                                    {arrayData.map(
                                      (value: number, index: number) => {
                                        const isComparing =
                                          allHighlights.compared.includes(
                                            index
                                          );
                                        const isSwapping =
                                          allHighlights.swapped.includes(index);
                                        const isFound =
                                          allHighlights.found.includes(index);
                                        const isSorted =
                                          allHighlights.sorted.includes(index);
                                        const isMiddle =
                                          allHighlights.middle.includes(index);
                                        const isInSearchRange =
                                          allHighlights.searchRange.includes(
                                            index
                                          );

                                        let bgColor = "bg-white/10";
                                        let textColor = "text-white";
                                        let borderColor = "border-white/20";

                                        if (isFound || isSorted) {
                                          bgColor = "bg-green-500/30";
                                          textColor = "text-green-200";
                                          borderColor = "border-green-400/40";
                                        } else if (isSwapping) {
                                          bgColor = "bg-red-500/30";
                                          textColor = "text-red-200";
                                          borderColor = "border-red-400/40";
                                        } else if (isComparing || isMiddle) {
                                          bgColor = "bg-yellow-500/30";
                                          textColor = "text-yellow-200";
                                          borderColor = "border-yellow-400/40";
                                        } else if (isInSearchRange) {
                                          bgColor = "bg-blue-500/30";
                                          textColor = "text-blue-200";
                                          borderColor = "border-blue-400/40";
                                        }

                                        return (
                                          <div
                                            key={`value-${index}-${value}`}
                                            className={`min-w-[40px] flex-shrink-0 text-center font-mono font-semibold text-sm py-2 px-1 rounded-lg border transition-all duration-200 ${bgColor} ${textColor} ${borderColor} ${
                                              isSwapping ||
                                              isComparing ||
                                              isFound ||
                                              isSorted ||
                                              isMiddle
                                                ? "scale-105"
                                                : "scale-100"
                                            } transition-all duration-150`}
                                          >
                                            {value}
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      // handle linked lists
                      if (structure.type === "linkedlist") {
                        const linkedListData = getLinkedListData(structure);
                        if (!linkedListData) return null;

                        const highlights = currentStep.highlights[structureKey];
                        const llHighlights =
                          getLinkedListHighlights(highlights);

                        return (
                          <div key={structureKey}>
                            <button
                              onClick={() => toggleSection(structureKey)}
                              className="flex items-center justify-between w-full mb-4 p-3 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                            >
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 ${colorScheme.dot} rounded-full`}
                                ></div>
                                <span className="font-semibold">
                                  {displayName}
                                </span>
                                {hasChanged && (
                                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                                )}
                              </div>
                              <div
                                className={`${
                                  expandedSections[structureKey]
                                    ? "rotate-180"
                                    : "rotate-0"
                                } transition-transform duration-200`}
                              >
                                {expandedSections[structureKey] ? (
                                  <EyeOff size={16} />
                                ) : (
                                  <Eye size={16} />
                                )}
                              </div>
                            </button>

                            <div
                              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                expandedSections[structureKey]
                                  ? "max-h-[500px] opacity-100"
                                  : "max-h-0 opacity-0"
                              }`}
                            >
                              <div
                                className={`p-4 rounded-xl border transition-all duration-300 ${
                                  hasChanged
                                    ? `${colorScheme.bg} ${colorScheme.border} shadow-lg`
                                    : "bg-white/5 border-white/10"
                                }`}
                              >
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="text-gray-300 text-sm font-medium">
                                    Nodes: {linkedListData.nodes.length}
                                  </span>
                                  <span className="text-gray-300 text-sm font-medium">
                                    Head: {linkedListData.head || "null"}
                                  </span>
                                  {hasChanged && (
                                    <span className="text-yellow-200 text-xs px-2 py-1 bg-yellow-500/20 rounded-lg border border-yellow-400/30 animate-in zoom-in duration-200">
                                      Modified
                                    </span>
                                  )}
                                </div>

                                {/* nodes display */}
                                <div className="space-y-2">
                                  <div className="text-gray-300 text-sm font-medium mb-2">
                                    Nodes:
                                  </div>
                                  <div className="grid grid-cols-1 gap-2">
                                    {linkedListData.nodes.map((node) => {
                                      const isActive =
                                        llHighlights.activeNodes.includes(
                                          node.id
                                        );
                                      const isVisited =
                                        llHighlights.visitedNodes.includes(
                                          node.id
                                        );
                                      const isCurrent =
                                        llHighlights.currentNodes.includes(
                                          node.id
                                        );
                                      const isMatch =
                                        llHighlights.matchNodes.includes(
                                          node.id
                                        );

                                      let bgColor = "bg-white/10";
                                      let textColor = "text-white";
                                      let borderColor = "border-white/20";

                                      if (isMatch) {
                                        bgColor = "bg-green-500/30";
                                        textColor = "text-green-200";
                                        borderColor = "border-green-400/40";
                                      } else if (isActive) {
                                        bgColor = "bg-amber-500/30";
                                        textColor = "text-amber-200";
                                        borderColor = "border-amber-400/40";
                                      } else if (isCurrent) {
                                        bgColor = "bg-blue-500/30";
                                        textColor = "text-blue-200";
                                        borderColor = "border-blue-400/40";
                                      } else if (isVisited) {
                                        bgColor = "bg-purple-500/30";
                                        textColor = "text-purple-200";
                                        borderColor = "border-purple-400/40";
                                      }

                                      return (
                                        <div
                                          key={node.id}
                                          className={`flex items-center justify-between p-2 rounded-lg border transition-all duration-200 ${bgColor} ${textColor} ${borderColor}`}
                                        >
                                          <div className="flex items-center gap-2">
                                            <span className="font-mono text-xs">
                                              {node.id}:
                                            </span>
                                            <span className="font-mono font-semibold">
                                              {node.value}
                                            </span>
                                          </div>
                                          <div className="text-xs">
                                            → {node.next || "null"}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* reversed links */}
                                {linkedListData.reversedLinks.length > 0 && (
                                  <div className="mt-4">
                                    <div className="text-gray-300 text-sm font-medium mb-2">
                                      Reversed Links:
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                      {linkedListData.reversedLinks.map(
                                        (link, index) => (
                                          <span
                                            key={index}
                                            className="px-2 py-1 bg-emerald-500/20 rounded border border-emerald-400/30 text-emerald-200 text-xs font-mono"
                                          >
                                            {link}
                                          </span>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* highlight status indicators */}
                                <div className="flex flex-wrap gap-2 mt-4 text-xs">
                                  {llHighlights.activeNodes.length > 0 && (
                                    <div className="flex items-center gap-1 px-2 py-1 bg-amber-500/20 rounded-lg border border-amber-400/30">
                                      <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                                      <span className="text-amber-200">
                                        Active:{" "}
                                        {llHighlights.activeNodes.join(", ")}
                                      </span>
                                    </div>
                                  )}
                                  {llHighlights.currentNodes.length > 0 && (
                                    <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 rounded-lg border border-blue-400/30">
                                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                      <span className="text-blue-200">
                                        Current:{" "}
                                        {llHighlights.currentNodes.join(", ")}
                                      </span>
                                    </div>
                                  )}
                                  {llHighlights.visitedNodes.length > 0 && (
                                    <div className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 rounded-lg border border-purple-400/30">
                                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                      <span className="text-purple-200">
                                        Visited:{" "}
                                        {llHighlights.visitedNodes.join(", ")}
                                      </span>
                                    </div>
                                  )}
                                  {llHighlights.matchNodes.length > 0 && (
                                    <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-lg border border-green-400/30">
                                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                      <span className="text-green-200">
                                        Completed:{" "}
                                        {llHighlights.matchNodes.join(", ")}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      return null;
                    }
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <div className="text-gray-400 text-center">
                    <Eye size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No step data available</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VariableInspector;

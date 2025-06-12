import { motion } from "framer-motion";
import { ChevronDown, TreePine } from "lucide-react";
import { useState, type JSX } from "react";

interface TreeNode {
  id: string;
  value: number;
  left: string | null;
  right: string | null;
}

interface TreeExample {
  name: string;
  description: string;
  nodes: TreeNode[];
  root: string;
  expectedResult: number[];
}

interface TreeCustomizerProps {
  currentTree: TreeExample;
  onTreeChange: (tree: TreeExample) => void;
  availableTrees: TreeExample[];
}

// simple tree visualization for preview
const TreePreview = ({ nodes, root }: { nodes: TreeNode[]; root: string }) => {
  const getNodeById = (id: string) => nodes.find((n) => n.id === id);

  const renderNode = (
    nodeId: string | null,
    level: number = 0
  ): JSX.Element | null => {
    if (!nodeId) return null;

    const node = getNodeById(nodeId);
    if (!node) return null;

    const hasChildren = node.left || node.right;

    return (
      <div key={node.id} className="flex flex-col items-center">
        <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-blue-400/40 rounded-full text-blue-200 text-xs font-bold">
          {node.value}
        </div>

        {hasChildren && (
          <div className="flex items-start gap-4 mt-2">
            <div className="flex flex-col items-center">
              {node.left && (
                <>
                  <div className="w-px h-3 bg-gray-400/50" />
                  {renderNode(node.left, level + 1)}
                </>
              )}
            </div>
            <div className="flex flex-col items-center">
              {node.right && (
                <>
                  <div className="w-px h-3 bg-gray-400/50" />
                  {renderNode(node.right, level + 1)}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex justify-center p-4 bg-gray-900/20 rounded-lg border border-gray-600/30">
      {renderNode(root)}
    </div>
  );
};

const TreeCustomizer = ({
  currentTree,
  onTreeChange,
  availableTrees,
}: TreeCustomizerProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleTreeSelect = (tree: TreeExample) => {
    onTreeChange(tree);
    setIsDropdownOpen(false);
  };

  return (
    <motion.section
      className="max-w-6xl mx-auto mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
    >
      <div className="flex flex-col lg:flex-row items-start justify-between gap-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
        {/* current tree info */}
        <div className="flex-1 w-full">
          <h3 className="text-lg font-semibold text-white mb-4">
            Current Binary Tree
          </h3>

          {/* tree metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-gray-300 text-sm font-medium">
                Nodes: {currentTree.nodes.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-400 rounded-full"></div>
              <span className="text-gray-300 text-sm font-medium">
                Height:{" "}
                {calculateTreeHeight(currentTree.nodes, currentTree.root)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              <span className="text-gray-300 text-sm font-medium">
                Type: {currentTree.name}
              </span>
            </div>
          </div>

          {/* tree preview */}
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <TreePreview nodes={currentTree.nodes} root={currentTree.root} />
          </motion.div>

          {/* expected result */}
          <div className="text-center">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-400/30 rounded-lg">
              <span className="text-emerald-200 font-mono text-sm">
                Expected: [{currentTree.expectedResult.join(", ")}]
              </span>
            </div>
          </div>
        </div>

        {/* controls */}
        <div className="flex flex-col items-center gap-4 min-w-[200px]">
          {/* tree selector dropdown */}
          <div className="relative w-full">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm backdrop-blur-md bg-gradient-to-r from-emerald-500/15 to-blue-500/15 border border-emerald-400/30 rounded-xl text-emerald-200 hover:from-emerald-500/25 hover:to-blue-500/25 hover:scale-105 transition-all duration-200 font-medium shadow-lg"
            >
              <div className="flex items-center gap-2">
                <TreePine size={16} />
                Select Tree
              </div>
              <ChevronDown
                size={16}
                className={`transform transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* dropdown menu */}
            {isDropdownOpen && (
              <>
                {/* click outside to close dropdown */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <motion.div
                  className="absolute top-full left-0 right-0 mt-2 bg-gray-900/95 border border-white/20 rounded-xl shadow-2xl backdrop-blur-md z-50 overflow-hidden"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {availableTrees.map((tree) => (
                    <button
                      key={tree.name}
                      onClick={() => handleTreeSelect(tree)}
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-white/10 transition-colors border-b border-white/10 last:border-b-0 ${
                        currentTree.name === tree.name
                          ? "bg-emerald-500/20 text-emerald-200"
                          : "text-gray-300"
                      }`}
                    >
                      <div className="font-medium">{tree.name}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {tree.description}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {tree.nodes.length} nodes • Result: [
                        {tree.expectedResult.join(", ")}]
                      </div>
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </div>

          {/* quick stats */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="text-center p-3 bg-white/5 border border-white/20 rounded-lg">
              <div className="text-gray-400 text-xs">Tree Height</div>
              <div className="text-cyan-400 font-bold text-lg">
                {calculateTreeHeight(currentTree.nodes, currentTree.root)}
              </div>
            </div>
            <div className="text-center p-3 bg-white/5 border border-white/20 rounded-lg">
              <div className="text-gray-400 text-xs">Node Count</div>
              <div className="text-purple-400 font-bold text-lg">
                {currentTree.nodes.length}
              </div>
            </div>
          </div>

          {/* tree description */}
          <div className="text-center p-3 bg-white/5 border border-white/20 rounded-lg w-full">
            <div className="text-gray-400 text-xs mb-1">Description</div>
            <div className="text-gray-300 text-xs">
              {currentTree.description}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

// helper function to calculate tree height
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

export default TreeCustomizer;

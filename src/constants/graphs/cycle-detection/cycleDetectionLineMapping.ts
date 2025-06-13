import type { AlgorithmLineMapping } from "@/types/algorithm";

export const cycleDetectionLineMapping: AlgorithmLineMapping = {
  initialization: {
    javascript: [14], // const visited = new Set();
    cpp: [35], // unordered_set<int> visited;
    python: [15], // visited = set()
    java: [24], // Set<Integer> visited = new HashSet<>();
    rust: [31], // let mut visited = HashSet::new();
    typescript: [24], // const visited = new Set<string>();
    go: [26], // visited := make(map[string]bool)
  },

  loop_condition: {
    javascript: [16, 17], // for (let vertex of graph.adjacencyList.keys()) { if (!visited.has(vertex)) {
    cpp: [37, 39], // for (auto& pair : graph.adjacencyList) { if (visited.find(vertex) == visited.end()) {
    python: [17, 18], // for vertex in graph.adjacency_list: if vertex not in visited:
    java: [26, 27], // for (int vertex : adjacencyList.keySet()) { if (!visited.contains(vertex)) {
    rust: [33, 34], // for &vertex in self.adjacency_list.keys() { if !visited.contains(&vertex) {
    typescript: [26, 27], // for (const vertex of graph.adjacencyList.keys()) { if (!visited.has(vertex)) {
    go: [28, 29], // for vertex := range g.adjacencyList { if !visited[vertex] {
  },

  graph_node_visit: {
    javascript: [25], // visited.add(vertex);
    cpp: [15], // visited.insert(vertex);
    python: [26], // visited.add(vertex)
    java: [44], // visited.add(vertex);
    rust: [52], // visited.insert(vertex);
    typescript: [44], // visited.add(vertex);
    go: [41], // visited[vertex] = true
  },

  graph_edge_explore: {
    javascript: [27, 28], // const neighbors = graph.adjacencyList.get(vertex) || []; for (let neighbor of neighbors) {
    cpp: [17], // for (int neighbor : graph.adjacencyList[vertex]) {
    python: [28], // for neighbor in graph.adjacency_list[vertex]:
    java: [46, 47], // List<Integer> neighbors = adjacencyList.getOrDefault(vertex, new ArrayList<>()); for (int neighbor : neighbors) {
    rust: [54, 55], // if let Some(neighbors) = self.adjacency_list.get(&vertex) { for &neighbor in neighbors {
    typescript: [46, 47], // const neighbors = graph.adjacencyList.get(vertex) || []; for (const neighbor of neighbors) {
    go: [43], // for _, neighbor := range g.adjacencyList[vertex] {
  },

  recursive_call: {
    javascript: [30, 31], // if (!visited.has(neighbor)) { if (dfsHasCycle(graph, neighbor, visited, vertex)) {
    cpp: [19, 20], // if (visited.find(neighbor) == visited.end()) { if (dfsHasCycle(graph, neighbor, visited, vertex)) {
    python: [30, 31], // if neighbor not in visited: if dfs_has_cycle(graph, neighbor, visited, vertex):
    java: [49, 50], // if (!visited.contains(neighbor)) { if (dfsHasCycle(neighbor, visited, vertex)) {
    rust: [57, 58], // if !visited.contains(&neighbor) { if self.dfs_has_cycle(neighbor, visited, Some(vertex)) {
    typescript: [49, 50], // if (!visited.has(neighbor)) { if (dfsHasCycle(graph, neighbor, visited, vertex)) {
    go: [45, 46], // if !visited[neighbor] { if g.dfsHasCycle(neighbor, visited, vertex) {
  },

  graph_cycle_detected: {
    javascript: [35, 36], // else if (neighbor !== parent) { return true;
    cpp: [25, 26], // else if (neighbor != parent) { return true;
    python: [34, 35], // elif neighbor != parent: return True
    java: [54, 55], // else if (neighbor != parent) { return true;
    rust: [62, 63], // else if Some(neighbor) != parent { return true;
    typescript: [54, 55], // else if (neighbor !== parent) { return true;
    go: [50, 51], // if neighbor != parent { return true
  },

  graph_backtrack: {
    javascript: [39], // return false;
    cpp: [29], // return false;
    python: [37], // return False
    java: [58], // return false;
    rust: [67], // false
    typescript: [58], // return false;
    go: [54], // return false
  },

  return: {
    javascript: [22], // return false;
    cpp: [46], // return false;
    python: [22], // return False
    java: [35], // return false;
    rust: [42], // false
    typescript: [35], // return false;
    go: [34], // return false
  },
};

// register the mapping
export const CYCLE_DETECTION_ALGORITHM_ID = "cycle-detection";

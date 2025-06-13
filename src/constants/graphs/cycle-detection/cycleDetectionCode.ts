export const cycleDetectionCodes = {
  javascript: `// Graph representation using adjacency list
class Graph {
  constructor() {
    this.adjacencyList = new Map();
  }
  
  addVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }
  
  addEdge(vertex1, vertex2) {
    this.adjacencyList.get(vertex1).push(vertex2);
    this.adjacencyList.get(vertex2).push(vertex1);
  }
}

function hasCycle(graph) {
  const visited = new Set();
  
  // Check all components for cycles
  for (let vertex of graph.adjacencyList.keys()) {
    if (!visited.has(vertex)) {
      if (dfsHasCycle(graph, vertex, visited, null)) {
        return true;
      }
    }
  }
  
  return false;
}

function dfsHasCycle(graph, vertex, visited, parent) {
  // Mark current vertex as visited
  visited.add(vertex);
  
  // Check all neighbors
  const neighbors = graph.adjacencyList.get(vertex) || [];
  for (let neighbor of neighbors) {
    // If neighbor is not visited, recursively check
    if (!visited.has(neighbor)) {
      if (dfsHasCycle(graph, neighbor, visited, vertex)) {
        return true;
      }
    } 
    // If neighbor is visited and not parent, cycle found
    else if (neighbor !== parent) {
      return true;
    }
  }
  
  return false;
}`,

  cpp: `#include <iostream>
#include <vector>
#include <unordered_set>
#include <unordered_map>
using namespace std;

class Graph {
public:
    unordered_map<int, vector<int>> adjacencyList;
    
    void addVertex(int vertex) {
        if (adjacencyList.find(vertex) == adjacencyList.end()) {
            adjacencyList[vertex] = vector<int>();
        }
    }
    
    void addEdge(int vertex1, int vertex2) {
        adjacencyList[vertex1].push_back(vertex2);
        adjacencyList[vertex2].push_back(vertex1);
    }
};

bool dfsHasCycle(Graph& graph, int vertex, unordered_set<int>& visited, int parent) {
    // Mark current vertex as visited
    visited.insert(vertex);
    
    // Check all neighbors
    for (int neighbor : graph.adjacencyList[vertex]) {
        // If neighbor is not visited, recursively check
        if (visited.find(neighbor) == visited.end()) {
            if (dfsHasCycle(graph, neighbor, visited, vertex)) {
                return true;
            }
        }
        // If neighbor is visited and not parent, cycle found
        else if (neighbor != parent) {
            return true;
        }
    }
    
    return false;
}

bool hasCycle(Graph& graph) {
    unordered_set<int> visited;
    
    // Check all components for cycles
    for (auto& pair : graph.adjacencyList) {
        int vertex = pair.first;
        if (visited.find(vertex) == visited.end()) {
            if (dfsHasCycle(graph, vertex, visited, -1)) {
                return true;
            }
        }
    }
    
    return false;
}`,

  python: `from collections import defaultdict

class Graph:
    def __init__(self):
        self.adjacency_list = defaultdict(list)
    
    def add_vertex(self, vertex):
        if vertex not in self.adjacency_list:
            self.adjacency_list[vertex] = []
    
    def add_edge(self, vertex1, vertex2):
        self.adjacency_list[vertex1].append(vertex2)
        self.adjacency_list[vertex2].append(vertex1)

def has_cycle(graph):
    visited = set()
    
    # Check all components for cycles
    for vertex in graph.adjacency_list:
        if vertex not in visited:
            if dfs_has_cycle(graph, vertex, visited, None):
                return True
    
    return False

def dfs_has_cycle(graph, vertex, visited, parent):
    # Mark current vertex as visited
    visited.add(vertex)
    
    # Check all neighbors
    for neighbor in graph.adjacency_list[vertex]:
        # If neighbor is not visited, recursively check
        if neighbor not in visited:
            if dfs_has_cycle(graph, neighbor, visited, vertex):
                return True
        # If neighbor is visited and not parent, cycle found
        elif neighbor != parent:
            return True
    
    return False`,

  java: `import java.util.*;

class Graph {
    private Map<Integer, List<Integer>> adjacencyList;
    
    public Graph() {
        this.adjacencyList = new HashMap<>();
    }
    
    public void addVertex(int vertex) {
        adjacencyList.putIfAbsent(vertex, new ArrayList<>());
    }
    
    public void addEdge(int vertex1, int vertex2) {
        adjacencyList.get(vertex1).add(vertex2);
        adjacencyList.get(vertex2).add(vertex1);
    }
    
    public boolean hasCycle() {
        Set<Integer> visited = new HashSet<>();
        
        // Check all components for cycles
        for (int vertex : adjacencyList.keySet()) {
            if (!visited.contains(vertex)) {
                if (dfsHasCycle(vertex, visited, -1)) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    private boolean dfsHasCycle(int vertex, Set<Integer> visited, int parent) {
        // Mark current vertex as visited
        visited.add(vertex);
        
        // Check all neighbors
        List<Integer> neighbors = adjacencyList.getOrDefault(vertex, new ArrayList<>());
        for (int neighbor : neighbors) {
            // If neighbor is not visited, recursively check
            if (!visited.contains(neighbor)) {
                if (dfsHasCycle(neighbor, visited, vertex)) {
                    return true;
                }
            }
            // If neighbor is visited and not parent, cycle found
            else if (neighbor != parent) {
                return true;
            }
        }
        
        return false;
    }
}`,

  rust: `use std::collections::{HashMap, HashSet};

struct Graph {
    adjacency_list: HashMap<i32, Vec<i32>>,
}

impl Graph {
    fn new() -> Self {
        Graph {
            adjacency_list: HashMap::new(),
        }
    }
    
    fn add_vertex(&mut self, vertex: i32) {
        self.adjacency_list.entry(vertex).or_insert_with(Vec::new);
    }
    
    fn add_edge(&mut self, vertex1: i32, vertex2: i32) {
        self.adjacency_list.entry(vertex1).or_default().push(vertex2);
        self.adjacency_list.entry(vertex2).or_default().push(vertex1);
    }
    
    fn has_cycle(&self) -> bool {
        let mut visited = HashSet::new();
        
        // Check all components for cycles
        for &vertex in self.adjacency_list.keys() {
            if !visited.contains(&vertex) {
                if self.dfs_has_cycle(vertex, &mut visited, None) {
                    return true;
                }
            }
        }
        
        false
    }
    
    fn dfs_has_cycle(
        &self,
        vertex: i32,
        visited: &mut HashSet<i32>,
        parent: Option<i32>,
    ) -> bool {
        // Mark current vertex as visited
        visited.insert(vertex);
        
        // Check all neighbors
        if let Some(neighbors) = self.adjacency_list.get(&vertex) {
            for &neighbor in neighbors {
                // If neighbor is not visited, recursively check
                if !visited.contains(&neighbor) {
                    if self.dfs_has_cycle(neighbor, visited, Some(vertex)) {
                        return true;
                    }
                }
                // If neighbor is visited and not parent, cycle found
                else if Some(neighbor) != parent {
                    return true;
                }
            }
        }
        
        false
    }
}`,

  typescript: `// Graph representation using adjacency list
interface GraphInterface {
  adjacencyList: Map<string, string[]>;
  addVertex(vertex: string): void;
  addEdge(vertex1: string, vertex2: string): void;
}

class Graph implements GraphInterface {
  adjacencyList: Map<string, string[]>;
  
  constructor() {
    this.adjacencyList = new Map();
  }
  
  addVertex(vertex: string): void {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }
  
  addEdge(vertex1: string, vertex2: string): void {
    this.adjacencyList.get(vertex1)?.push(vertex2);
    this.adjacencyList.get(vertex2)?.push(vertex1);
  }
}

function hasCycle(graph: Graph): boolean {
  const visited = new Set<string>();
  
  // Check all components for cycles
  for (const vertex of graph.adjacencyList.keys()) {
    if (!visited.has(vertex)) {
      if (dfsHasCycle(graph, vertex, visited, null)) {
        return true;
      }
    }
  }
  
  return false;
}

function dfsHasCycle(
  graph: Graph,
  vertex: string,
  visited: Set<string>,
  parent: string | null
): boolean {
  // Mark current vertex as visited
  visited.add(vertex);
  
  // Check all neighbors
  const neighbors = graph.adjacencyList.get(vertex) || [];
  for (const neighbor of neighbors) {
    // If neighbor is not visited, recursively check
    if (!visited.has(neighbor)) {
      if (dfsHasCycle(graph, neighbor, visited, vertex)) {
        return true;
      }
    }
    // If neighbor is visited and not parent, cycle found
    else if (neighbor !== parent) {
      return true;
    }
  }
  
  return false;
}`,

  go: `package main

import "fmt"

type Graph struct {
    adjacencyList map[string][]string
}

func NewGraph() *Graph {
    return &Graph{
        adjacencyList: make(map[string][]string),
    }
}

func (g *Graph) AddVertex(vertex string) {
    if _, exists := g.adjacencyList[vertex]; !exists {
        g.adjacencyList[vertex] = []string{}
    }
}

func (g *Graph) AddEdge(vertex1, vertex2 string) {
    g.adjacencyList[vertex1] = append(g.adjacencyList[vertex1], vertex2)
    g.adjacencyList[vertex2] = append(g.adjacencyList[vertex2], vertex1)
}

func (g *Graph) HasCycle() bool {
    visited := make(map[string]bool)
    
    // Check all components for cycles
    for vertex := range g.adjacencyList {
        if !visited[vertex] {
            if g.dfsHasCycle(vertex, visited, "") {
                return true
            }
        }
    }
    
    return false
}

func (g *Graph) dfsHasCycle(vertex string, visited map[string]bool, parent string) bool {
    // Mark current vertex as visited
    visited[vertex] = true
    
    // Check all neighbors
    for _, neighbor := range g.adjacencyList[vertex] {
        // If neighbor is not visited, recursively check
        if !visited[neighbor] {
            if g.dfsHasCycle(neighbor, visited, vertex) {
                return true
            }
        }
        // If neighbor is visited and not parent, cycle found
        if neighbor != parent {
            return true
        }
    }
    
    return false
}`,
};

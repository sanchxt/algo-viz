import type { AlgorithmLineMapping } from "@/types/algorithm";

export const anagramDetectionLineMapping: AlgorithmLineMapping = {
  initialization: {
    javascript: [2, 3], // const s1 = str1.toLowerCase().replace(/\s+/g, ''); const s2 = str2.toLowerCase().replace(/\s+/g, '');
    cpp: [6, 7, 8, 9], // transform and erase operations for normalization
    python: [2, 3], // s1 = str1.lower().replace(' ', ''); s2 = str2.lower().replace(' ', '')
    java: [4, 5], // String s1 = str1.toLowerCase().replaceAll("\\s+", ""); String s2 = str2.toLowerCase().replaceAll("\\s+", "");
    rust: [3, 4], // let s1: String = str1.to_lowercase()...; let s2: String = str2.to_lowercase()...
    typescript: [2, 3], // const s1: string = str1.toLowerCase().replace(/\s+/g, ''); const s2: string = str2.toLowerCase().replace(/\s+/g, '');
    go: [4, 5], // s1 := strings.ToLower(strings.ReplaceAll(str1, " ", "")); s2 := strings.ToLower(strings.ReplaceAll(str2, " ", ""))
  },

  string_comparison: {
    javascript: [5, 6, 7], // if (s1.length !== s2.length) { return false; }
    cpp: [11, 12, 13], // if (str1.length() != str2.length()) { return false; }
    python: [5, 6, 7], // if len(s1) != len(s2): return False
    java: [7, 8, 9], // if (s1.length() != s2.length()) { return false; }
    rust: [7, 8, 9], // if s1.len() != s2.len() { return false; }
    typescript: [5, 6, 7], // if (s1.length !== s2.length) { return false; }
    go: [7, 8, 9], // if len(s1) != len(s2) { return false }
  },

  hash_map_creation: {
    javascript: [10], // const frequencyMap = {};
    cpp: [15], // unordered_map<char, int> frequencyMap;
    python: [9], // frequency_map = {}
    java: [11], // Map<Character, Integer> frequencyMap = new HashMap<>();
    rust: [12], // let mut frequency_map: HashMap<char, i32> = HashMap::new();
    typescript: [9], // const frequencyMap: Map<string, number> = new Map();
    go: [12], // frequencyMap := make(map[rune]int)
  },

  string_iteration: {
    javascript: [11], // for (let i = 0; i < s1.length; i++) {
    cpp: [16], // for (char c : str1) {
    python: [10], // for char in s1:
    java: [12], // for (int i = 0; i < s1.length(); i++) {
    rust: [13], // for c in s1.chars() {
    typescript: [10], // for (let i = 0; i < s1.length; i++) {
    go: [13], // for _, char := range s1 {
  },

  character_access: {
    javascript: [12], // const char = s1[i];
    cpp: [16], // char c (in the for loop)
    python: [10], // char (in the for loop)
    java: [13], // char c = s1.charAt(i);
    rust: [13], // c (in the for loop)
    typescript: [11], // const char: string = s1[i];
    go: [13], // char (in the for loop)
  },

  frequency_count: {
    javascript: [13], // frequencyMap[char] = (frequencyMap[char] || 0) + 1;
    cpp: [17], // frequencyMap[c]++;
    python: [11], // frequency_map[char] = frequency_map.get(char, 0) + 1
    java: [14], // frequencyMap.put(c, frequencyMap.getOrDefault(c, 0) + 1);
    rust: [14], // *frequency_map.entry(c).or_insert(0) += 1;
    typescript: [12], // frequencyMap.set(char, (frequencyMap.get(char) || 0) + 1);
    go: [14], // frequencyMap[char]++
  },

  hash_map_comparison: {
    javascript: [17, 18, 19, 20, 21], // for loop checking second string against frequency map
    cpp: [20, 21, 22, 23, 24], // for loop checking second string against frequency map
    python: [14, 15, 16, 17], // for loop checking second string against frequency map
    java: [17, 18, 19, 20, 21], // for loop checking second string against frequency map
    rust: [17, 18, 19, 20], // for loop checking second string against frequency map
    typescript: [15, 16, 17, 18, 19, 20], // for loop checking second string against frequency map
    go: [17, 18, 19, 20], // for loop checking second string against frequency map
  },

  return_found: {
    javascript: [24], // return true;
    cpp: [26], // return true;
    python: [19], // return True
    java: [24], // return true;
    rust: [23], // true
    typescript: [23], // return true;
    go: [23], // return true
  },

  return_not_found: {
    javascript: [6, 20], // return false; (multiple locations)
    cpp: [12, 23], // return false; (multiple locations)
    python: [6, 16], // return False (multiple locations)
    java: [8, 20], // return false; (multiple locations)
    rust: [8, 19], // return false; (multiple locations)
    typescript: [6, 19], // return false; (multiple locations)
    go: [8, 19], // return false (multiple locations)
  },
};

// Register the mapping
export const ANAGRAM_DETECTION_ALGORITHM_ID = "anagram-detection";

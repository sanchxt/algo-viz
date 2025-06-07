export const anagramDetectionCodes = {
  javascript: `function areAnagrams(str1, str2) {
  // Normalize strings: lowercase and remove spaces
  const s1 = str1.toLowerCase().replace(/\\s+/g, '');
  const s2 = str2.toLowerCase().replace(/\\s+/g, '');
  
  // Quick length check
  if (s1.length !== s2.length) {
    return false;
  }
  
  // Create frequency map for first string
  const frequencyMap = {};
  for (let i = 0; i < s1.length; i++) {
    const char = s1[i];
    frequencyMap[char] = (frequencyMap[char] || 0) + 1;
  }
  
  // Check second string against frequency map
  for (let i = 0; i < s2.length; i++) {
    const char = s2[i];
    if (!frequencyMap[char]) {
      return false;
    }
    frequencyMap[char]--;
  }
  
  return true;
}`,

  cpp: `#include <iostream>
#include <unordered_map>
#include <string>
#include <algorithm>
using namespace std;

bool areAnagrams(string str1, string str2) {
    // Normalize strings: lowercase and remove spaces
    transform(str1.begin(), str1.end(), str1.begin(), ::tolower);
    transform(str2.begin(), str2.end(), str2.begin(), ::tolower);
    str1.erase(remove(str1.begin(), str1.end(), ' '), str1.end());
    str2.erase(remove(str2.begin(), str2.end(), ' '), str2.end());
    
    // Quick length check
    if (str1.length() != str2.length()) {
        return false;
    }
    
    // Create frequency map for first string
    unordered_map<char, int> frequencyMap;
    for (char c : str1) {
        frequencyMap[c]++;
    }
    
    // Check second string against frequency map
    for (char c : str2) {
        if (frequencyMap[c] == 0) {
            return false;
        }
        frequencyMap[c]--;
    }
    
    return true;
}`,

  python: `def are_anagrams(str1, str2):
    # Normalize strings: lowercase and remove spaces
    s1 = str1.lower().replace(' ', '')
    s2 = str2.lower().replace(' ', '')
    
    # Quick length check
    if len(s1) != len(s2):
        return False
    
    # Create frequency map for first string
    frequency_map = {}
    for char in s1:
        frequency_map[char] = frequency_map.get(char, 0) + 1
    
    # Check second string against frequency map
    for char in s2:
        if char not in frequency_map or frequency_map[char] == 0:
            return False
        frequency_map[char] -= 1
    
    return True`,

  java: `import java.util.HashMap;
import java.util.Map;

public class AnagramDetection {
    public static boolean areAnagrams(String str1, String str2) {
        // Normalize strings: lowercase and remove spaces
        String s1 = str1.toLowerCase().replaceAll("\\\\s+", "");
        String s2 = str2.toLowerCase().replaceAll("\\\\s+", "");
        
        // Quick length check
        if (s1.length() != s2.length()) {
            return false;
        }
        
        // Create frequency map for first string
        Map<Character, Integer> frequencyMap = new HashMap<>();
        for (int i = 0; i < s1.length(); i++) {
            char c = s1.charAt(i);
            frequencyMap.put(c, frequencyMap.getOrDefault(c, 0) + 1);
        }
        
        // Check second string against frequency map
        for (int i = 0; i < s2.length(); i++) {
            char c = s2.charAt(i);
            if (!frequencyMap.containsKey(c) || frequencyMap.get(c) == 0) {
                return false;
            }
            frequencyMap.put(c, frequencyMap.get(c) - 1);
        }
        
        return true;
    }
}`,

  rust: `use std::collections::HashMap;

fn are_anagrams(str1: &str, str2: &str) -> bool {
    // Normalize strings: lowercase and remove spaces
    let s1: String = str1.to_lowercase().chars()
        .filter(|c| !c.is_whitespace()).collect();
    let s2: String = str2.to_lowercase().chars()
        .filter(|c| !c.is_whitespace()).collect();
    
    // Quick length check
    if s1.len() != s2.len() {
        return false;
    }
    
    // Create frequency map for first string
    let mut frequency_map: HashMap<char, i32> = HashMap::new();
    for c in s1.chars() {
        *frequency_map.entry(c).or_insert(0) += 1;
    }
    
    // Check second string against frequency map
    for c in s2.chars() {
        match frequency_map.get_mut(&c) {
            Some(count) if *count > 0 => *count -= 1,
            _ => return false,
        }
    }
    
    true
}`,

  typescript: `function areAnagrams(str1: string, str2: string): boolean {
    // Normalize strings: lowercase and remove spaces
    const s1: string = str1.toLowerCase().replace(/\\s+/g, '');
    const s2: string = str2.toLowerCase().replace(/\\s+/g, '');
    
    // Quick length check
    if (s1.length !== s2.length) {
        return false;
    }
    
    // Create frequency map for first string
    const frequencyMap: Map<string, number> = new Map();
    for (let i = 0; i < s1.length; i++) {
        const char: string = s1[i];
        frequencyMap.set(char, (frequencyMap.get(char) || 0) + 1);
    }
    
    // Check second string against frequency map
    for (let i = 0; i < s2.length; i++) {
        const char: string = s2[i];
        const count: number = frequencyMap.get(char) || 0;
        if (count === 0) {
            return false;
        }
        frequencyMap.set(char, count - 1);
    }
    
    return true;
}`,

  go: `package main

func areAnagrams(str1, str2 string) bool {
    // Normalize strings: lowercase and remove spaces
    s1 := strings.ToLower(strings.ReplaceAll(str1, " ", ""))
    s2 := strings.ToLower(strings.ReplaceAll(str2, " ", ""))
    
    // Quick length check
    if len(s1) != len(s2) {
        return false
    }
    
    // Create frequency map for first string
    frequencyMap := make(map[rune]int)
    for _, char := range s1 {
        frequencyMap[char]++
    }
    
    // Check second string against frequency map
    for _, char := range s2 {
        if frequencyMap[char] == 0 {
            return false
        }
        frequencyMap[char]--
    }
    
    return true
}`,
};

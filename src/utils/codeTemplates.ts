// 代码模板管理工具

export interface Language {
  value: string
  label: string
  extension: string
  monacoLanguage: string
  icon: string
}

export interface CodeTemplate {
  language: string
  template: string
  description: string
  imports?: string[]
  mainFunction?: string
}

// 支持的编程语言
export const supportedLanguages: Language[] = [
  {
    value: 'cpp',
    label: 'C++',
    extension: '.cpp',
    monacoLanguage: 'cpp',
    icon: '🔧'
  },
  {
    value: 'c',
    label: 'C',
    extension: '.c',
    monacoLanguage: 'c',
    icon: '⚙️'
  },
  {
    value: 'java',
    label: 'Java',
    extension: '.java',
    monacoLanguage: 'java',
    icon: '☕'
  },
  {
    value: 'python',
    label: 'Python',
    extension: '.py',
    monacoLanguage: 'python',
    icon: '🐍'
  },
  {
    value: 'javascript',
    label: 'JavaScript',
    extension: '.js',
    monacoLanguage: 'javascript',
    icon: '🟨'
  },
  {
    value: 'typescript',
    label: 'TypeScript',
    extension: '.ts',
    monacoLanguage: 'typescript',
    icon: '🔷'
  },
  {
    value: 'go',
    label: 'Go',
    extension: '.go',
    monacoLanguage: 'go',
    icon: '🐹'
  },
  {
    value: 'rust',
    label: 'Rust',
    extension: '.rs',
    monacoLanguage: 'rust',
    icon: '🦀'
  },
  {
    value: 'php',
    label: 'PHP',
    extension: '.php',
    monacoLanguage: 'php',
    icon: '🐘'
  },
  {
    value: 'ruby',
    label: 'Ruby',
    extension: '.rb',
    monacoLanguage: 'ruby',
    icon: '💎'
  },
  {
    value: 'swift',
    label: 'Swift',
    extension: '.swift',
    monacoLanguage: 'swift',
    icon: '🦉'
  },
  {
    value: 'kotlin',
    label: 'Kotlin',
    extension: '.kt',
    monacoLanguage: 'kotlin',
    icon: '🎯'
  },
  {
    value: 'csharp',
    label: 'C#',
    extension: '.cs',
    monacoLanguage: 'csharp',
    icon: '🔷'
  }
]

// 代码模板
export const codeTemplates: Record<string, CodeTemplate> = {
  cpp: {
    language: 'cpp',
    description: 'C++ 基础模板',
    template: `#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
#include <map>
#include <set>
#include <queue>
#include <stack>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // TODO: 在这里实现你的算法
        
        return {};
    }
};

int main() {
    Solution solution;
    
    // 测试用例
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    
    vector<int> result = solution.twoSum(nums, target);
    
    cout << "Result: [";
    for (int i = 0; i < result.size(); i++) {
        cout << result[i];
        if (i < result.size() - 1) cout << ", ";
    }
    cout << "]" << endl;
    
    return 0;
}`,
    imports: ['iostream', 'vector', 'algorithm', 'string', 'map', 'set', 'queue', 'stack'],
    mainFunction: 'main'
  },

  c: {
    language: 'c',
    description: 'C 语言基础模板',
    template: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    // TODO: 在这里实现你的算法
    *returnSize = 2;
    int* result = (int*)malloc(2 * sizeof(int));
    
    return result;
}

int main() {
    int nums[] = {2, 7, 11, 15};
    int target = 9;
    int returnSize;
    
    int* result = twoSum(nums, 4, target, &returnSize);
    
    printf("Result: [%d, %d]\\n", result[0], result[1]);
    
    free(result);
    return 0;
}`,
    imports: ['stdio.h', 'stdlib.h', 'string.h'],
    mainFunction: 'main'
  },

  java: {
    language: 'java',
    description: 'Java 基础模板',
    template: `import java.util.*;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        // TODO: 在这里实现你的算法
        
        return new int[]{};
    }
}

public class Main {
    public static void main(String[] args) {
        Solution solution = new Solution();
        
        // 测试用例
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        
        int[] result = solution.twoSum(nums, target);
        
        System.out.println("Result: " + Arrays.toString(result));
    }
}`,
    imports: ['java.util.*'],
    mainFunction: 'main'
  },

  python: {
    language: 'python',
    description: 'Python 基础模板',
    template: `from typing import List, Dict, Set, Tuple, Optional
import collections
import heapq
import bisect

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        """
        TODO: 在这里实现你的算法
        
        Args:
            nums: 整数数组
            target: 目标值
            
        Returns:
            两个数的索引
        """
        pass

def main():
    solution = Solution()
    
    # 测试用例
    nums = [2, 7, 11, 15]
    target = 9
    
    result = solution.twoSum(nums, target)
    print(f"Result: {result}")

if __name__ == "__main__":
    main()`,
    imports: ['typing', 'collections', 'heapq', 'bisect'],
    mainFunction: 'main'
  },

  javascript: {
    language: 'javascript',
    description: 'JavaScript 基础模板',
    template: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // TODO: 在这里实现你的算法
    
    return [];
};

// 测试用例
function main() {
    const nums = [2, 7, 11, 15];
    const target = 9;
    
    const result = twoSum(nums, target);
    console.log('Result:', result);
}

main();`,
    mainFunction: 'main'
  },

  typescript: {
    language: 'typescript',
    description: 'TypeScript 基础模板',
    template: `function twoSum(nums: number[], target: number): number[] {
    // TODO: 在这里实现你的算法
    
    return [];
}

// 测试用例
function main(): void {
    const nums: number[] = [2, 7, 11, 15];
    const target: number = 9;
    
    const result: number[] = twoSum(nums, target);
    console.log('Result:', result);
}

main();`,
    mainFunction: 'main'
  },

  go: {
    language: 'go',
    description: 'Go 语言基础模板',
    template: `package main

import (
    "fmt"
    "sort"
)

func twoSum(nums []int, target int) []int {
    // TODO: 在这里实现你的算法
    
    return []int{}
}

func main() {
    // 测试用例
    nums := []int{2, 7, 11, 15}
    target := 9
    
    result := twoSum(nums, target)
    fmt.Printf("Result: %v\\n", result)
}`,
    imports: ['fmt', 'sort'],
    mainFunction: 'main'
  },

  rust: {
    language: 'rust',
    description: 'Rust 基础模板',
    template: `impl Solution {
    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
        // TODO: 在这里实现你的算法
        
        vec![]
    }
}

struct Solution;

fn main() {
    // 测试用例
    let nums = vec![2, 7, 11, 15];
    let target = 9;
    
    let result = Solution::two_sum(nums, target);
    println!("Result: {:?}", result);
}`,
    mainFunction: 'main'
  },

  php: {
    language: 'php',
    description: 'PHP 基础模板',
    template: `<?php

class Solution {
    /**
     * @param Integer[] $nums
     * @param Integer $target
     * @return Integer[]
     */
    function twoSum($nums, $target) {
        // TODO: 在这里实现你的算法
        
        return [];
    }
}

// 测试用例
function main() {
    $solution = new Solution();
    
    $nums = [2, 7, 11, 15];
    $target = 9;
    
    $result = $solution->twoSum($nums, $target);
    echo "Result: [" . implode(", ", $result) . "]\\n";
}

main();

?>`,
    mainFunction: 'main'
  },

  ruby: {
    language: 'ruby',
    description: 'Ruby 基础模板',
    template: `# @param {Integer[]} nums
# @param {Integer} target
# @return {Integer[]}
def two_sum(nums, target)
    # TODO: 在这里实现你的算法
    
    []
end

# 测试用例
def main
    nums = [2, 7, 11, 15]
    target = 9
    
    result = two_sum(nums, target)
    puts "Result: #{result}"
end

main`,
    mainFunction: 'main'
  },

  swift: {
    language: 'swift',
    description: 'Swift 基础模板',
    template: `class Solution {
    func twoSum(_ nums: [Int], _ target: Int) -> [Int] {
        // TODO: 在这里实现你的算法
        
        return []
    }
}

// 测试用例
func main() {
    let solution = Solution()
    
    let nums = [2, 7, 11, 15]
    let target = 9
    
    let result = solution.twoSum(nums, target)
    print("Result: \\(result)")
}

main()`,
    mainFunction: 'main'
  },

  kotlin: {
    language: 'kotlin',
    description: 'Kotlin 基础模板',
    template: `class Solution {
    fun twoSum(nums: IntArray, target: Int): IntArray {
        // TODO: 在这里实现你的算法
        
        return intArrayOf()
    }
}

fun main() {
    val solution = Solution()
    
    // 测试用例
    val nums = intArrayOf(2, 7, 11, 15)
    val target = 9
    
    val result = solution.twoSum(nums, target)
    println("Result: \${result.contentToString()}")
}`,
    mainFunction: 'main'
  },

  csharp: {
    language: 'csharp',
    description: 'C# 基础模板',
    template: `using System;
using System.Collections.Generic;
using System.Linq;

public class Solution {
    public int[] TwoSum(int[] nums, int target) {
        // TODO: 在这里实现你的算法
        
        return new int[] {};
    }
}

public class Program {
    public static void Main() {
        Solution solution = new Solution();
        
        // 测试用例
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        
        int[] result = solution.TwoSum(nums, target);
        Console.WriteLine($"Result: [{string.Join(", ", result)}]");
    }
}`,
    imports: ['System', 'System.Collections.Generic', 'System.Linq'],
    mainFunction: 'Main'
  }
}

// 获取语言信息
export function getLanguageInfo(languageValue: string): Language | undefined {
  return supportedLanguages.find(lang => lang.value === languageValue)
}

// 获取代码模板
export function getCodeTemplate(languageValue: string): string {
  const template = codeTemplates[languageValue]
  return template ? template.template : ''
}

// 获取模板描述
export function getTemplateDescription(languageValue: string): string {
  const template = codeTemplates[languageValue]
  return template ? template.description : ''
}

// 获取语言的 Monaco 标识符
export function getMonacoLanguage(languageValue: string): string {
  const language = getLanguageInfo(languageValue)
  return language ? language.monacoLanguage : 'plaintext'
}

// 获取语言图标
export function getLanguageIcon(languageValue: string): string {
  const language = getLanguageInfo(languageValue)
  return language ? language.icon : '📄'
}

// 获取文件扩展名
export function getFileExtension(languageValue: string): string {
  const language = getLanguageInfo(languageValue)
  return language ? language.extension : '.txt'
}

// 验证语言是否支持
export function isLanguageSupported(languageValue: string): boolean {
  return supportedLanguages.some(lang => lang.value === languageValue)
}

// 获取默认语言
export const getDefaultLanguage = (): string => {
  return 'cpp'
}

// 获取热门语言
export const getPopularLanguages = (): Language[] => {
  return supportedLanguages.filter(lang => 
    ['cpp', 'java', 'python', 'javascript', 'c'].includes(lang.value)
  )
}
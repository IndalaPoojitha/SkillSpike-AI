import { DSAProblem } from '../types';

export const DSA_CATEGORIES = [
  'All',
  'Arrays',
  'Strings',
  'Linked List',
  'Stack',
  'Queue',
  'Recursion',
  'Binary Search',
  'Trees',
  'BST',
  'Heap',
  'Hashing',
  'Graphs',
  'Dynamic Programming',
];

export const DSA_PROBLEMS: DSAProblem[] = [
  {
    id: 'dsa-1',
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    category: 'Arrays',
    companies: ['Amazon', 'Google', 'Microsoft', 'Meta', 'TCS'],
    acceptanceRate: '54.2%',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'nums[1] + nums[2] == 6, we return [1, 2].',
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    starterCode: {
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
}`,
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Write your solution here
        pass`,
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        return {};
    }
};`,
    },
    testCases: [
      { input: '[2,7,11,15], 9', expectedOutput: '[0, 1]' },
      { input: '[3,2,4], 6', expectedOutput: '[1, 2]' },
      { input: '[3,3], 6', expectedOutput: '[0, 1]' },
    ],
    hints: [
      'A brute force approach checks every pair with O(N^2) time.',
      'Can you use a HashMap/Dictionary to store the complement (target - nums[i]) as you iterate?',
      'With a HashMap, you can achieve O(N) time and O(N) space.',
    ],
    solutionExplanation: `### Optimal Approach: Hash Map (One-Pass)
1. Initialize an empty hash table/map \`seen\` to store numbers and their indices.
2. Iterate through \`nums\` with index \`i\`.
3. Compute the complement \`diff = target - nums[i]\`.
4. If \`diff\` is already in \`seen\`, return \`[seen[diff], i]\`.
5. Otherwise, store \`seen[nums[i]] = i\`.

**Time Complexity:** O(N) — Single pass through the array.
**Space Complexity:** O(N) — Storing up to N elements in the map.`,
  },
  {
    id: 'dsa-2',
    title: 'Valid Palindrome',
    slug: 'valid-palindrome',
    difficulty: 'Easy',
    category: 'Strings',
    companies: ['Amazon', 'Microsoft', 'Adobe', 'Infosys'],
    acceptanceRate: '46.8%',
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.`,
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: 'true',
        explanation: '"amanaplanacanalpanama" is a palindrome.',
      },
      {
        input: 's = "race a car"',
        output: 'false',
        explanation: '"raceacar" is not a palindrome.',
      },
      {
        input: 's = " "',
        output: 'true',
        explanation: 's is an empty string "" after removing non-alphanumeric characters, which is an empty palindrome.',
      },
    ],
    constraints: [
      '1 <= s.length <= 2 * 10^5',
      's consists only of printable ASCII characters.',
    ],
    starterCode: {
      java: `class Solution {
    public boolean isPalindrome(String s) {
        // Write your solution here
        return false;
    }
}`,
      python: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        # Write your solution here
        pass`,
      cpp: `#include <string>
#include <cctype>
using namespace std;

class Solution {
public:
    boolean isPalindrome(string s) {
        // Write your solution here
        return false;
    }
};`,
    },
    testCases: [
      { input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true' },
      { input: '"race a car"', expectedOutput: 'false' },
      { input: '" "', expectedOutput: 'true' },
    ],
    hints: [
      'Use two pointers: one starting from the left, one from the right.',
      'Skip characters that are not alphanumeric using helper functions like isLetterOrDigit.',
      'Compare characters in lowercase.',
    ],
    solutionExplanation: `### Optimal Approach: Two-Pointers (In-Place)
1. Initialize pointer \`left = 0\` and \`right = s.length() - 1\`.
2. While \`left < right\`:
   - If \`s[left]\` is not alphanumeric, increment \`left\`.
   - Else if \`s[right]\` is not alphanumeric, decrement \`right\`.
   - Else if \`toLowerCase(s[left]) != toLowerCase(s[right])\`, return \`false\`.
   - Otherwise, advance both pointers (\`left++\`, \`right--\`).
3. Return \`true\` if loop finishes.

**Time Complexity:** O(N)
**Space Complexity:** O(1) in-place without creating extra strings.`,
  },
  {
    id: 'dsa-3',
    title: 'Reverse Linked List',
    slug: 'reverse-linked-list',
    difficulty: 'Easy',
    category: 'Linked List',
    companies: ['Amazon', 'Google', 'Microsoft', 'Apple', 'Cognizant'],
    acceptanceRate: '75.9%',
    description: `Given the \`head\` of a singly linked list, reverse the list, and return the reversed list.`,
    examples: [
      {
        input: 'head = [1,2,3,4,5]',
        output: '[5,4,3,2,1]',
      },
      {
        input: 'head = [1,2]',
        output: '[2,1]',
      },
      {
        input: 'head = []',
        output: '[]',
      },
    ],
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 <= Node.val <= 5000',
    ],
    starterCode: {
      java: `/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int val) { this.val = val; }
 * }
 */
class Solution {
    public ListNode reverseList(ListNode head) {
        // Write your solution here
        return null;
    }
}`,
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        # Write your solution here
        pass`,
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode(int x) : val(x), next(nullptr) {}
 * };
 */
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        // Write your solution here
        return nullptr;
    }
};`,
    },
    testCases: [
      { input: '[1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]' },
      { input: '[1,2]', expectedOutput: '[2,1]' },
      { input: '[]', expectedOutput: '[]' },
    ],
    hints: [
      'Maintain three pointers: prev (initially null), curr (initially head), and next.',
      'Before changing curr.next, store next = curr.next to not lose reference.',
      'Point curr.next to prev, then advance prev = curr and curr = next.',
    ],
    solutionExplanation: `### Optimal Approach: Iterative 3-Pointers
\`\`\`
prev = null
curr = head
while curr != null:
    next = curr.next
    curr.next = prev
    prev = curr
    curr = next
return prev
\`\`\`

**Time Complexity:** O(N)
**Space Complexity:** O(1)`,
  },
  {
    id: 'dsa-4',
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    category: 'Stack',
    companies: ['Amazon', 'Google', 'Meta', 'Bloomberg', 'Wipro'],
    acceptanceRate: '40.6%',
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
      { input: 's = "([])"', output: 'true' },
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only "()[]{}".',
    ],
    starterCode: {
      java: `import java.util.Stack;

class Solution {
    public boolean isValid(String s) {
        // Write your solution here
        return false;
    }
}`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        # Write your solution here
        pass`,
      cpp: `#include <string>
#include <stack>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        // Write your solution here
        return false;
    }
};`,
    },
    testCases: [
      { input: '"()"', expectedOutput: 'true' },
      { input: '"()[]{}"', expectedOutput: 'true' },
      { input: '"(]"', expectedOutput: 'false' },
    ],
    hints: [
      'A Stack data structure represents LIFO order, ideal for nested bracket matching.',
      'When an opening bracket is seen, push it onto the stack.',
      'When a closing bracket is seen, check if stack is non-empty and top element matches.',
    ],
    solutionExplanation: `### Optimal Stack Approach
1. Initialize a stack.
2. Iterate through each character \`c\` in string \`s\`:
   - If \`c\` is \`'('\`, \`'['\`, or \`'{'\`, push onto stack.
   - If closing bracket, verify \`!stack.isEmpty()\` and top element matches pair. Pop from stack.
   - If no match or empty, return \`false\`.
3. Return \`stack.isEmpty()\` at the end.

**Time Complexity:** O(N)
**Space Complexity:** O(N)`,
  },
  {
    id: 'dsa-5',
    title: 'Binary Search',
    slug: 'binary-search',
    difficulty: 'Easy',
    category: 'Binary Search',
    companies: ['Amazon', 'Microsoft', 'Oracle', 'Capgemini'],
    acceptanceRate: '57.4%',
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    examples: [
      {
        input: 'nums = [-1,0,3,5,9,12], target = 9',
        output: '4',
        explanation: '9 exists in nums and its index is 4.',
      },
      {
        input: 'nums = [-1,0,3,5,9,12], target = 2',
        output: '-1',
        explanation: '2 does not exist in nums so return -1.',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^4',
      '-10^4 < nums[i], target < 10^4',
      'All the integers in nums are unique.',
      'nums is sorted in ascending order.',
    ],
    starterCode: {
      java: `class Solution {
    public int search(int[] nums, int target) {
        // Write your solution here
        return -1;
    }
}`,
      python: `class Solution:
    def search(self, nums: list[int], target: int) -> int:
        # Write your solution here
        pass`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int search(vector<int>& nums, int target) {
        // Write your solution here
        return -1;
    }
};`,
    },
    testCases: [
      { input: '[-1,0,3,5,9,12], 9', expectedOutput: '4' },
      { input: '[-1,0,3,5,9,12], 2', expectedOutput: '-1' },
    ],
    hints: [
      'Initialize low = 0, high = nums.length - 1.',
      'Calculate mid = low + (high - low) / 2 to avoid integer overflow.',
      'Compare nums[mid] with target.',
    ],
    solutionExplanation: `### Standard Binary Search Template
\`\`\`
int low = 0, high = nums.length - 1;
while (low <= high) {
    int mid = low + (high - low) / 2;
    if (nums[mid] == target) return mid;
    else if (nums[mid] < target) low = mid + 1;
    else high = mid - 1;
}
return -1;
\`\`\`
**Time:** O(log N) | **Space:** O(1)`,
  },
  {
    id: 'dsa-6',
    title: 'Maximum Subarray (Kadane Algorithm)',
    slug: 'maximum-subarray',
    difficulty: 'Medium',
    category: 'Arrays',
    companies: ['Amazon', 'Google', 'Microsoft', 'LinkedIn', 'Cisco'],
    acceptanceRate: '50.3%',
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.`,
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'The subarray [4,-1,2,1] has the largest sum 6.',
      },
      {
        input: 'nums = [1]',
        output: '1',
      },
      {
        input: 'nums = [5,4,-1,7,8]',
        output: '23',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
    ],
    starterCode: {
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        // Kadane's Algorithm
        return 0;
    }
}`,
      python: `class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        # Write your solution here
        pass`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        // Write your solution here
        return 0;
    }
};`,
    },
    testCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' },
      { input: '[1]', expectedOutput: '1' },
      { input: '[5,4,-1,7,8]', expectedOutput: '23' },
    ],
    hints: [
      'Kadane\'s algorithm keeps track of the maximum sum ending at the current index.',
      'currentSum = max(nums[i], currentSum + nums[i])',
      'maxSum = max(maxSum, currentSum)',
    ],
    solutionExplanation: `### Kadane's Dynamic Programming Algorithm
At each index, we decide whether to add \`nums[i]\` to the current running subarray, or start a fresh subarray at \`nums[i]\`.
\`\`\`
int currentSum = nums[0];
int maxSum = nums[0];
for (int i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
}
return maxSum;
\`\`\`
**Time:** O(N) | **Space:** O(1)`,
  },
  {
    id: 'dsa-7',
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    category: 'Strings',
    companies: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Uber'],
    acceptanceRate: '34.7%',
    description: `Given a string \`s\`, find the length of the longest substring without repeating characters.`,
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.',
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.',
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3.',
      },
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.',
    ],
    starterCode: {
      java: `import java.util.HashMap;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Sliding Window
        return 0;
    }
}`,
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # Sliding Window
        pass`,
      cpp: `#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        // Sliding Window
        return 0;
    }
};`,
    },
    testCases: [
      { input: '"abcabcbb"', expectedOutput: '3' },
      { input: '"bbbbb"', expectedOutput: '1' },
      { input: '"pwwkew"', expectedOutput: '3' },
    ],
    hints: [
      'Use the Sliding Window technique with two pointers (left and right).',
      'Store the last seen index of each character in a HashMap.',
      'When a duplicate is encountered, slide the left pointer past the duplicate\'s previous index.',
    ],
    solutionExplanation: `### Sliding Window with Last Seen Index Map
Maintain window \`[left, right]\`.
For each char \`c\` at \`right\`:
If \`c\` was seen at index >= \`left\`, set \`left = seen[c] + 1\`.
Update \`seen[c] = right\` and \`maxLen = max(maxLen, right - left + 1)\`.

**Time:** O(N) | **Space:** O(min(N, charset size))`,
  },
  {
    id: 'dsa-8',
    title: 'Invert Binary Tree',
    slug: 'invert-binary-tree',
    difficulty: 'Easy',
    category: 'Trees',
    companies: ['Google', 'Amazon', 'Microsoft', 'Twitter'],
    acceptanceRate: '76.2%',
    description: `Given the \`root\` of a binary tree, invert the tree, and return its root.`,
    examples: [
      {
        input: 'root = [4,2,7,1,3,6,9]',
        output: '[4,7,2,9,6,3,1]',
      },
      {
        input: 'root = [2,1,3]',
        output: '[2,3,1]',
      },
      {
        input: 'root = []',
        output: '[]',
      },
    ],
    constraints: [
      'The number of nodes in the tree is in the range [0, 100].',
      '-100 <= Node.val <= 100',
    ],
    starterCode: {
      java: `class Solution {
    public TreeNode invertTree(TreeNode root) {
        // Recursive inversion
        return null;
    }
}`,
      python: `class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        # Recursive inversion
        pass`,
      cpp: `class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        // Recursive inversion
        return nullptr;
    }
};`,
    },
    testCases: [
      { input: '[4,2,7,1,3,6,9]', expectedOutput: '[4,7,2,9,6,3,1]' },
      { input: '[2,1,3]', expectedOutput: '[2,3,1]' },
    ],
    hints: [
      'Base case: if root is null, return null.',
      'Swap the left child and right child of the current node.',
      'Recursively invert root.left and root.right.',
    ],
    solutionExplanation: `### Recursive DFS Approach
\`\`\`
if (root == null) return null;
TreeNode temp = root.left;
root.left = invertTree(root.right);
root.right = invertTree(temp);
return root;
\`\`\`
**Time:** O(N) | **Space:** O(H) where H is tree height (recursion stack).`,
  },
  {
    id: 'dsa-9',
    title: 'Validate Binary Search Tree',
    slug: 'validate-binary-search-tree',
    difficulty: 'Medium',
    category: 'BST',
    companies: ['Amazon', 'Meta', 'Microsoft', 'Bloomberg'],
    acceptanceRate: '32.6%',
    description: `Given the \`root\` of a binary tree, determine if it is a valid binary search tree (BST).

A valid BST is defined as follows:
- The left subtree of a node contains only nodes with keys less than the node's key.
- The right subtree of a node contains only nodes with keys greater than the node's key.
- Both the left and right subtrees must also be binary search trees.`,
    examples: [
      { input: 'root = [2,1,3]', output: 'true' },
      { input: 'root = [5,1,4,null,null,3,6]', output: 'false', explanation: 'The root node\'s value is 5 but its right child\'s value is 4.' },
    ],
    constraints: [
      'The number of nodes in the tree is in the range [1, 10^4].',
      '-2^31 <= Node.val <= 2^31 - 1',
    ],
    starterCode: {
      java: `class Solution {
    public boolean isValidBST(TreeNode root) {
        // Write your solution here
        return false;
    }
}`,
      python: `class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        # Write your solution here
        pass`,
      cpp: `class Solution {
public:
    bool isValidBST(TreeNode* root) {
        // Write your solution here
        return false;
    }
};`,
    },
    testCases: [
      { input: '[2,1,3]', expectedOutput: 'true' },
      { input: '[5,1,4,null,null,3,6]', expectedOutput: 'false' },
    ],
    hints: [
      'Checking only immediate children is insufficient. All nodes in left subtree must be less than root.',
      'Pass a valid range (min, max) down the recursion.',
      'Alternatively, an in-order traversal of a valid BST must produce strictly ascending values.',
    ],
    solutionExplanation: `### Range Validation (DFS)
\`\`\`
boolean validate(TreeNode node, Long min, Long max) {
    if (node == null) return true;
    if ((min != null && node.val <= min) || (max != null && node.val >= max)) {
        return false;
    }
    return validate(node.left, min, (long)node.val) && validate(node.right, (long)node.val, max);
}
\`\`\`
**Time:** O(N) | **Space:** O(H)`,
  },
  {
    id: 'dsa-10',
    title: 'Kth Largest Element in an Array',
    slug: 'kth-largest-element-in-an-array',
    difficulty: 'Medium',
    category: 'Heap',
    companies: ['Meta', 'Amazon', 'Microsoft', 'Google'],
    acceptanceRate: '66.8%',
    description: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\`-th largest element in the array.

Note that it is the \`k\`-th largest element in the sorted order, not the \`k\`-th distinct element.
Can you solve it without sorting?`,
    examples: [
      { input: 'nums = [3,2,1,5,6,4], k = 2', output: '5' },
      { input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4', output: '4' },
    ],
    constraints: [
      '1 <= k <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
    ],
    starterCode: {
      java: `import java.util.PriorityQueue;

class Solution {
    public int findKthLargest(int[] nums, int k) {
        // Use Min-Heap of size k
        return 0;
    }
}`,
      python: `import heapq

class Solution:
    def findKthLargest(self, nums: list[int], k: int) -> int:
        # Min-heap
        pass`,
      cpp: `#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        // PriorityQueue
        return 0;
    }
};`,
    },
    testCases: [
      { input: '[3,2,1,5,6,4], 2', expectedOutput: '5' },
      { input: '[3,2,3,1,2,4,5,5,6], 4', expectedOutput: '4' },
    ],
    hints: [
      'Maintain a Min-Heap of size k.',
      'When heap size exceeds k, pop the smallest element.',
      'The top of the min-heap at the end will be the kth largest element.',
    ],
    solutionExplanation: `### Min-Heap of Size K
1. Create a Min-Heap (PriorityQueue).
2. For each number in \`nums\`:
   - \`heap.add(num)\`
   - if \`heap.size() > k\`, \`heap.poll()\`
3. Return \`heap.peek()\`.

**Time Complexity:** O(N log K)
**Space Complexity:** O(K)`,
  },
  {
    id: 'dsa-11',
    title: 'Number of Islands',
    slug: 'number-of-islands',
    difficulty: 'Medium',
    category: 'Graphs',
    companies: ['Amazon', 'Google', 'Microsoft', 'Bloomberg', 'Meta'],
    acceptanceRate: '57.8%',
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`'1'\`s (land) and \`'0'\`s (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    examples: [
      {
        input: `grid = [
  ["1","1","1","1","0"],
  ["1","1","0","1","0"],
  ["1","1","0","0","0"],
  ["0","0","0","0","0"]
]`,
        output: '1',
      },
      {
        input: `grid = [
  ["1","1","0","0","0"],
  ["1","1","0","0","0"],
  ["0","0","1","0","0"],
  ["0","0","0","1","1"]
]`,
        output: '3',
      },
    ],
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 <= m, n <= 300',
      'grid[i][j] is "0" or "1".',
    ],
    starterCode: {
      java: `class Solution {
    public int numIslands(char[][] grid) {
        // BFS / DFS flood fill
        return 0;
    }
}`,
      python: `class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        # BFS / DFS flood fill
        pass`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        // BFS / DFS
        return 0;
    }
};`,
    },
    testCases: [
      { input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', expectedOutput: '1' },
    ],
    hints: [
      'Iterate through every cell (r, c) in the grid.',
      'If grid[r][c] == "1", increment island count and trigger a DFS/BFS to sink/mark the entire island to "0".',
    ],
    solutionExplanation: `### DFS Flood Fill (Sink Island)
\`\`\`
int islands = 0;
for (int r = 0; r < m; r++) {
    for (int c = 0; c < n; c++) {
        if (grid[r][c] == '1') {
            islands++;
            dfs(grid, r, c);
        }
    }
}
void dfs(char[][] grid, int r, int c) {
    if (r < 0 || c < 0 || r >= m || c >= n || grid[r][c] != '1') return;
    grid[r][c] = '0'; // mark visited
    dfs(grid, r+1, c);
    dfs(grid, r-1, c);
    dfs(grid, r, c+1);
    dfs(grid, r, c-1);
}
\`\`\`
**Time:** O(M * N) | **Space:** O(M * N) worst recursion depth.`,
  },
  {
    id: 'dsa-12',
    title: 'Coin Change',
    slug: 'coin-change',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    companies: ['Amazon', 'Microsoft', 'Google', 'Apple', 'Goldman Sachs'],
    acceptanceRate: '43.2%',
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    examples: [
      { input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1' },
      { input: 'coins = [2], amount = 3', output: '-1' },
      { input: 'coins = [1], amount = 0', output: '0' },
    ],
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4',
    ],
    starterCode: {
      java: `import java.util.Arrays;

class Solution {
    public int coinChange(int[] coins, int amount) {
        // DP Tabulation
        return 0;
    }
}`,
      python: `class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        # DP Tabulation
        pass`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        // DP Tabulation
        return 0;
    }
};`,
    },
    testCases: [
      { input: '[1,2,5], 11', expectedOutput: '3' },
      { input: '[2], 3', expectedOutput: '-1' },
      { input: '[1], 0', expectedOutput: '0' },
    ],
    hints: [
      'Let dp[i] be the minimum coins needed to make amount i.',
      'Initialize dp array with amount + 1, and dp[0] = 0.',
      'For each coin in coins and each i from coin to amount: dp[i] = min(dp[i], dp[i - coin] + 1).',
    ],
    solutionExplanation: `### Bottom-Up DP Tabulation
\`\`\`
int[] dp = new int[amount + 1];
Arrays.fill(dp, amount + 1);
dp[0] = 0;

for (int coin : coins) {
    for (int i = coin; i <= amount; i++) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
    }
}
return dp[amount] > amount ? -1 : dp[amount];
\`\`\`
**Time:** O(amount * len(coins)) | **Space:** O(amount)`,
  },
  {
    id: 'dsa-13',
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    difficulty: 'Easy',
    category: 'Dynamic Programming',
    companies: ['Amazon', 'Adobe', 'Apple', 'TCS'],
    acceptanceRate: '52.7%',
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
    examples: [
      { input: 'n = 2', output: '2', explanation: '1. 1 step + 1 step\n2. 2 steps' },
      { input: 'n = 3', output: '3', explanation: '1. 1 step + 1 step + 1 step\n2. 1 step + 2 steps\n3. 2 steps + 1 step' },
    ],
    constraints: ['1 <= n <= 45'],
    starterCode: {
      java: `class Solution {
    public int climbStairs(int n) {
        // Write your solution here
        return 0;
    }
}`,
      python: `class Solution:
    def climbStairs(self, n: int) -> int:
        # Write your solution here
        pass`,
      cpp: `class Solution {
public:
    int climbStairs(int n) {
        // Write your solution here
        return 0;
    }
};`,
    },
    testCases: [
      { input: '2', expectedOutput: '2' },
      { input: '3', expectedOutput: '3' },
      { input: '5', expectedOutput: '8' },
    ],
    hints: ['ways(n) = ways(n - 1) + ways(n - 2). This is the Fibonacci sequence.'],
    solutionExplanation: `### Constant Space Fibonacci DP
\`\`\`
if (n <= 2) return n;
int prev2 = 1, prev1 = 2;
for (int i = 3; i <= n; i++) {
    int curr = prev1 + prev2;
    prev2 = prev1;
    prev1 = curr;
}
return prev1;
\`\`\`
**Time:** O(N) | **Space:** O(1)`,
  },
  {
    id: 'dsa-14',
    title: 'Implement Queue using Stacks',
    slug: 'implement-queue-using-stacks',
    difficulty: 'Easy',
    category: 'Queue',
    companies: ['Amazon', 'Microsoft', 'Bloomberg'],
    acceptanceRate: '65.1%',
    description: `Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support all the functions of a normal queue (\`push\`, \`peek\`, \`pop\`, and \`empty\`).`,
    examples: [
      {
        input: 'MyQueue myQueue = new MyQueue();\nmyQueue.push(1);\nmyQueue.push(2);\nmyQueue.peek(); // return 1\nmyQueue.pop(); // return 1\nmyQueue.empty(); // return false',
        output: '[null, null, null, 1, 1, false]',
      },
    ],
    constraints: ['1 <= x <= 9', 'At most 100 calls will be made to push, pop, peek, and empty.'],
    starterCode: {
      java: `import java.util.Stack;

class MyQueue {
    Stack<Integer> in = new Stack<>();
    Stack<Integer> out = new Stack<>();

    public void push(int x) { in.push(x); }
    public int pop() { peek(); return out.pop(); }
    public int peek() {
        if (out.isEmpty()) {
            while (!in.isEmpty()) out.push(in.pop());
        }
        return out.peek();
    }
    public boolean empty() { return in.isEmpty() && out.isEmpty(); }
}`,
      python: `class MyQueue:
    def __init__(self):
        self.in_st = []
        self.out_st = []

    def push(self, x: int) -> None:
        self.in_st.append(x)

    def pop(self) -> int:
        self.peek()
        return self.out_st.pop()

    def peek(self) -> int:
        if not self.out_st:
            while self.in_st:
                self.out_st.append(self.in_st.pop())
        return self.out_st[-1]

    def empty(self) -> bool:
        return not self.in_st and not self.out_st`,
      cpp: `#include <stack>
using namespace std;

class MyQueue {
    stack<int> in, out;
public:
    void push(int x) { in.push(x); }
    int pop() { int v = peek(); out.pop(); return v; }
    int peek() {
        if (out.empty()) {
            while (!in.empty()) { out.push(in.top()); in.pop(); }
        }
        return out.top();
    }
    bool empty() { return in.empty() && out.empty(); }
};`,
    },
    testCases: [{ input: 'push(1), push(2), peek(), pop(), empty()', expectedOutput: '1, 1, false' }],
    hints: ['Push onto in-stack. For pop/peek, transfer from in-stack to out-stack if out-stack is empty.'],
    solutionExplanation: `Amortized O(1) push, pop, and peek using two stacks.`,
  },
  {
    id: 'dsa-15',
    title: 'Subsets (Power Set)',
    slug: 'subsets',
    difficulty: 'Medium',
    category: 'Recursion',
    companies: ['Meta', 'Amazon', 'Bloomberg', 'Uber'],
    acceptanceRate: '77.3%',
    description: `Given an integer array \`nums\` of unique elements, return all possible subsets (the power set).

The solution set must not contain duplicate subsets. Return the solution in any order.`,
    examples: [
      { input: 'nums = [1,2,3]', output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]' },
      { input: 'nums = [0]', output: '[[],[0]]' },
    ],
    constraints: ['1 <= nums.length <= 10', '-10 <= nums[i] <= 10', 'All numbers are unique.'],
    starterCode: {
      java: `import java.util.*;

class Solution {
    public List<List<Integer>> subsets(int[] nums) {
        List<List<Integer>> result = new ArrayList<>();
        backtrack(0, nums, new ArrayList<>(), result);
        return result;
    }
    private void backtrack(int start, int[] nums, List<Integer> current, List<List<Integer>> res) {
        res.add(new ArrayList<>(current));
        for (int i = start; i < nums.length; i++) {
            current.add(nums[i]);
            backtrack(i + 1, nums, current, res);
            current.remove(current.size() - 1);
        }
    }
}`,
      python: `class Solution:
    def subsets(self, nums: list[int]) -> list[list[int]]:
        res = []
        def backtrack(start, path):
            res.append(list(path))
            for i in range(start, len(nums)):
                path.append(nums[i])
                backtrack(i + 1, path)
                path.pop()
        backtrack(0, [])
        return res`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        vector<vector<int>> res;
        vector<int> path;
        backtrack(0, nums, path, res);
        return res;
    }
    void backtrack(int start, vector<int>& nums, vector<int>& path, vector<vector<int>>& res) {
        res.push_back(path);
        for (int i = start; i < nums.size(); i++) {
            path.push_back(nums[i]);
            backtrack(i + 1, nums, path, res);
            path.pop_back();
        }
    }
};`,
    },
    testCases: [{ input: '[1,2,3]', expectedOutput: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]' }],
    hints: ['For each element, we have two choices: include it in the subset or exclude it.'],
    solutionExplanation: `Backtracking builds the power set of size 2^N in O(N * 2^N) time.`,
  },
];

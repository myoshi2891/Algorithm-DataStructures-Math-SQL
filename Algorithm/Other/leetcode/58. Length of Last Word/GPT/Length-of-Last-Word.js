// ```javascript
/**
 * Function: lengthOfLastWord
 * --------------------------------
 * Given a string s consisting of words and spaces,
 * return the length of the last word in the string.
 *
 * @param {string} s - Input string (1 <= s.length <= 10^4)
 * @returns {number} - Length of the last word
 *
 * Time Complexity: O(n)  (n = length of string s, single backward scan)
 * Memory Usage: O(1)    (only integer counters used, no extra structures)
 */
function lengthOfLastWord(s) {
    let i = s.length - 1;
    let length = 0;

    // Skip trailing spaces
    while (i >= 0 && s[i] === ' ') {
        i--;
    }

    // Count characters of the last word
    while (i >= 0 && s[i] !== ' ') {
        length++;
        i--;
    }

    return length;
}

// Example usage (LeetCode will call this function with given inputs):
// console.log(lengthOfLastWord("Hello World")); // Output: 5
// ```

// この実装は

// * 末尾の空白を無視し、
// * 最後の単語の長さをカウントするだけなので、
//   追加メモリを一切消費せずに処理可能です。

// 👉 処理時間: **O(n)** (最悪でも一度の線形走査)
// 👉 メモリ消費: **O(1)** (カウンタ変数のみ)

// LeetCode の要件 (Node.js 18.16.1) にそのまま対応できます。

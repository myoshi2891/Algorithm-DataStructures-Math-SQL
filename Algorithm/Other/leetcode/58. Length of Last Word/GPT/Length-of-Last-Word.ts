// ```typescript
/**
 * Function: lengthOfLastWord
 * --------------------------------
 * Given a string s consisting of words and spaces,
 * return the length of the last word in the string.
 *
 * @param {string} s - Input string (1 <= s.length <= 10^4)
 * @returns {number} - Length of the last word
 *
 * Time Complexity: O(n)   (n = length of string s, single backward scan)
 * Memory Usage: O(1)     (only integer counters used, no extra data structures)
 */
function lengthOfLastWordGPT(s: string): number {
    let i: number = s.length - 1;
    let length: number = 0;

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

// Example usage (LeetCode will call this function automatically):
// console.log(lengthOfLastWord("Hello World")); // Output: 5
// ```

// ---

// ✅ **処理時間**: O(n) （最悪ケースは末尾まで逆走査）
// ✅ **メモリ消費量**: O(1) （整数変数のみ使用、追加の配列や文字列コピーなし）

// LeetCode ではそのまま提出可能です (TypeScript 5.1 / Node.js 18.16.1)。

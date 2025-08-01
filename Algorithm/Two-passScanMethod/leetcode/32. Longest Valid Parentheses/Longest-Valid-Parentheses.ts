function longestValidParenthesesO1(s: string): number {
    let left = 0;
    let right = 0;
    let maxLen = 0;

    // 左→右
    for (const ch of s) {
        if (ch === '(') left++;
        else right++;
        if (left === right) maxLen = Math.max(maxLen, 2 * right);
        else if (right > left) left = right = 0;
    }

    left = 0;
    right = 0;

    // 右→左
    for (let i = s.length - 1; i >= 0; i--) {
        const ch = s[i];
        if (ch === '(') left++;
        else right++;
        if (left === right) maxLen = Math.max(maxLen, 2 * left);
        else if (left > right) left = right = 0;
    }

    return maxLen;
}

// 動作確認
// const testCases = [')()())', '(()', '()(())', '())((())'];
for (const s of testCases) {
    console.log(`Input: '${s}', Output: ${longestValidParenthesesO1(s)}`);
}

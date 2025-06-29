function longestPalindromDP(s: string): string {
    const n = s.length;
    if (n < 2) return s;

    // dp[i][j] = s[i..j] が回文かどうか
    const dp: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false));

    let start = 0;
    let maxLen = 1;

    // 1文字は必ず回文
    for (let i = 0; i < n; i++) {
        dp[i][i] = true;
    }

    // 長さ2以上の部分文字列を検討
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;

            if (s[i] === s[j]) {
                if (len === 2) {
                    dp[i][j] = true;
                } else {
                    dp[i][j] = dp[i + 1][j - 1];
                }

                if (dp[i][j] && len > maxLen) {
                    start = i;
                    maxLen = len;
                }
            }
        }
    }

    return s.substring(start, start + maxLen);
}

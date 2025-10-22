// O(m×n)
// function longestCommonSubsequence(S, T) {
// 	const m = S.length;
// 	const n = T.length;
// 	const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

// 	for (let i = 1; i <= m; i++) {
// 		for (let j = 1; j <= n; j++) {
// 			if (S[i - 1] === T[j - 1]) {
// 				dp[i][j] = dp[i - 1][j - 1] + 1;
// 			} else {
// 				dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
// 			}
// 		}
// 	}

// 	return dp[m][n];
// }

// O(n)
function longestCommonSubsequence(S, T) {
    const m = S.length,
        n = T.length;
    let prev = new Array(n + 1).fill(0);
    let curr = new Array(n + 1).fill(0);

    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (S[i - 1] === T[j - 1]) {
                curr[j] = prev[j - 1] + 1;
            } else {
                curr[j] = Math.max(prev[j], curr[j - 1]);
            }
        }
        [prev, curr] = [curr, prev]; // メモリを節約するため swap
    }

    return prev[n];
}

// O(m'×n)
// function longestCommonSubsequence(S, T) {
// 	if (S.length > T.length) [S, T] = [T, S]; // S の方が短くなるように

// 	const tSet = new Set(T);
// 	S = S.split("")
// 		.filter((c) => tSet.has(c))
// 		.join(""); // S の不要な文字を削除

// 	const m = S.length,
// 		n = T.length;
// 	let prev = new Array(n + 1).fill(0);
// 	let curr = new Array(n + 1).fill(0);

// 	for (let i = 1; i <= m; i++) {
// 		let stopEarly = true;
// 		for (let j = 1; j <= n; j++) {
// 			if (S[i - 1] === T[j - 1]) {
// 				curr[j] = prev[j - 1] + 1;
// 			} else {
// 				curr[j] = Math.max(prev[j], curr[j - 1]);
// 			}
// 			if (curr[j] !== curr[j - 1]) stopEarly = false;
// 		}
// 		if (stopEarly) break;
// 		[prev, curr] = [curr, prev];
// 	}

// 	return prev[n];
// }
// 入力の取得
const fs = require('fs');
const [S, T] = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');

// 出力
console.log(longestCommonSubsequence(S, T));

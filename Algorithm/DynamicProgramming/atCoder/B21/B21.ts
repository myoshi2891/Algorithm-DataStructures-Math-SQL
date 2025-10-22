// 以下は、**最長回文部分列の長さ**を求めるTypeScriptコードです。
// Node.jsの`fs`モジュールを使用して標準入力を読み取り、**処理時間とメモリの制約（1秒 / 1024MiB）を意識**した実装になっています。

// ---

// ## ✅ 実装（TypeScript）

// ```ts
import * as fs from 'fs';

/**
 * 与えられた文字列に対し、最長の回文部分列の長さを返す関数。
 * @param S - 対象の文字列（英小文字）
 * @returns number - 最長の回文部分列の長さ
 */
function longestPalindromicSubsequence(S: string): number {
    const N: number = S.length;

    // dp[i][j] = S[i..j]で作れる最長回文部分列の長さ
    const dp: number[][] = Array.from({ length: N }, () => new Array(N).fill(0));

    // 1文字は常に回文
    for (let i = 0; i < N; i++) {
        dp[i][i] = 1;
    }

    // 部分文字列の長さlen=2からNまで
    for (let len = 2; len <= N; len++) {
        for (let i = 0; i <= N - len; i++) {
            const j = i + len - 1;
            if (S[i] === S[j]) {
                dp[i][j] = len === 2 ? 2 : dp[i + 1][j - 1] + 2;
            } else {
                dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
            }
        }
    }

    return dp[0][N - 1];
}

// --- 入力処理 ---
const input: string[] = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const N: number = Number(input[0]);
const S: string = input[1];

// --- 実行と出力 ---
const result: number = longestPalindromicSubsequence(S);
console.log(result);

// ## ✅ 使用方法（例）

// 標準入力に以下を渡すと:

// ```
// 11
// programming
// ```

// 出力は：

// ```
// 4
// ```

// ---

// ## ✅ 時間・メモリ制約に関して

// * **時間計算量**：`O(N^2)`（最大で1,000×1,000 = 1,000,000ループ）→ 1秒以内に収まります。
// * **空間計算量**：`O(N^2)` → `1000 * 1000 * 4バイト = 約4MB`（メモリ制限1024MiBに対して非常に軽量）

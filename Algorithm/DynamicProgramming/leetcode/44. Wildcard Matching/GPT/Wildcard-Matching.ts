// 以下は、TypeScript 5.1 + Node.js 18.16.1 環境で動作する、ワイルドカードマッチング（`?` / `*`対応）の関数実装です。
// **DP（動的計画法）+ O(n)メモリ最適化版**なので、最大長2000でも効率的に動作します。

// ```typescript
/**
 * ワイルドカードパターンマッチング
 * @param s - 入力文字列（小文字英字のみ）
 * @param p - パターン文字列（小文字英字, '?' , '*' を含む）
 * @returns 文字列全体がパターンに一致する場合 true, それ以外 false
 *
 * 時間計算量: O(m × n)   (m = s.length, n = p.length)
 * 空間計算量: O(n)       1次元DP配列による省メモリ化
 */
function isMatchGPT(s: string, p: string): boolean {
    const m: number = s.length;
    const n: number = p.length;

    // dp[j] = s[0..i-1] と p[0..j-1] が一致するか
    let prev: boolean[] = new Array(n + 1).fill(false);
    let curr: boolean[] = new Array(n + 1).fill(false);

    // 空文字同士は一致
    prev[0] = true;

    // パターンが "*", "**" など連続する場合の初期化
    for (let j = 1; j <= n; j++) {
        if (p[j - 1] === '*') {
            prev[j] = prev[j - 1];
        }
    }

    // メインループ
    for (let i = 1; i <= m; i++) {
        curr[0] = false; // sが空でない場合にpが空はfalse
        for (let j = 1; j <= n; j++) {
            if (p[j - 1] === '*') {
                // '*' → 空(prev[j]) または 1文字以上(curr[j-1])を消費
                curr[j] = prev[j] || curr[j - 1];
            } else if (p[j - 1] === '?' || p[j - 1] === s[i - 1]) {
                // '?' または同じ文字 → 前の状態を引き継ぐ
                curr[j] = prev[j - 1];
            } else {
                curr[j] = false;
            }
        }
        // 次の行計算のため入れ替え
        [prev, curr] = [curr, prev];
    }

    return prev[n];
}
// ```

// ---

// ### 実装ポイント

// * **1次元配列の使い回し**で**O(n)** メモリに削減（n = パターン長）。
// * `'?'` → 任意の1文字一致、`'*'` → 0文字以上一致の2パターンに分岐。
// * 初期化時に、先頭から連続する`*`だけは空文字列と一致するため `true` に設定。

// ---

// ### 計算量

// * **時間**: `O(m × n)`（最大2000×2000 = 4,000,000ステップ程度）
// * **空間**: `O(n)`（boolean配列2本でメモリ効率良し）

// ---

// このTS版、LeetCode提出用に即使える形になっていますが、
// 希望すれば\*\*パターンの先行最適化（連続する'\*'を1つに縮約）\*\*を追加してさらに高速化できます。

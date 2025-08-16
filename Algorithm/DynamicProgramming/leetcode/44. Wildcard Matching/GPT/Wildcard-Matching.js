// 以下は、Node.js 18.16.1 環境で動作する、関数ベースのワイルドカードマッチング実装（`?` / `*`対応）です。
// DP（動的計画法）を用いており、計算量は **O(m × n)**（m = s.length, n = p.length）、メモリ消費を抑えるために **O(n)** の1次元配列で最適化しています。

// ```javascript
/**
 * ワイルドカードパターンマッチング
 * @param {string} s - 入力文字列（小文字英字のみ）
 * @param {string} p - パターン文字列（小文字英字, '?' , '*'を含む）
 * @returns {boolean} - 文字列全体がパターンに一致する場合 true, それ以外 false
 * 
 * 処理時間: O(m × n)  (m = s.length, n = p.length)
 * メモリ消費量: O(n)   1次元DP配列による省メモリ化
 */
function isMatch(s, p) {
    const m = s.length;
    const n = p.length;

    // dp[j] = s[0..i-1] と p[0..j-1] が一致するか
    let prev = new Array(n + 1).fill(false);
    let curr = new Array(n + 1).fill(false);

    // 空文字同士は一致
    prev[0] = true;

    // パターンが "*", "**", "***" などの場合の初期化
    for (let j = 1; j <= n; j++) {
        if (p[j - 1] === '*') {
            prev[j] = prev[j - 1];
        }
    }

    for (let i = 1; i <= m; i++) {
        curr[0] = false; // sが空でないのにpが空はfalse
        for (let j = 1; j <= n; j++) {
            if (p[j - 1] === '*') {
                // '*' は空文字(prev[j]) または任意の1文字(curr[j-1])を消費できる
                curr[j] = prev[j] || curr[j - 1];
            } else if (p[j - 1] === '?' || p[j - 1] === s[i - 1]) {
                // '?' または同じ文字なら、前の状態を引き継ぐ
                curr[j] = prev[j - 1];
            } else {
                curr[j] = false;
            }
        }
        // 現在行を次のループ用にコピー
        [prev, curr] = [curr, prev];
    }

    return prev[n];
}
// ```

// ---

// ### アルゴリズム概要

// * **DP定義**
//   `dp[i][j]` = `s[0..i-1]` と `p[0..j-1]` が一致するか
// * **遷移**

//   * `p[j-1] === '*'` → 空を表す場合 `dp[i][j-1]` または 1文字以上消費 `dp[i-1][j]`
//   * `p[j-1] === '?'` または `p[j-1] === s[i-1]` → `dp[i-1][j-1]` を継承
//   * それ以外 → false
// * **空文字初期化**
//   先頭から連続する `*` のみ `true` にする

// ---

// ### 時間・メモリ効率

// * 時間計算量: **O(m × n)**
//   文字列長最大 2000 の場合、4,000,000 ステップで十分高速
// * メモリ計算量: **O(n)**
//   行を1つ前の状態しか参照しないため、2行分だけ保持

// ---

// もし望むなら、この実装を**O(1) extra space** で実現する最適化版（インプレース更新）も作れますが、可読性がかなり落ちます。

// では、TypeScript版に**連続する`'*'`をまとめて1つにする前処理**を追加した高速化版を提示します。
// この最適化により、無駄なDP計算が減り、実行時間・メモリ両面で改善されます。

// ```typescript
// /**
//  * ワイルドカードパターンマッチング（連続 '*' 縮約版）
//  * @param s - 入力文字列（小文字英字のみ）
//  * @param p - パターン文字列（小文字英字, '?' , '*' を含む）
//  * @returns 文字列全体がパターンに一致する場合 true, それ以外 false
//  * 
//  * 時間計算量: O(m × n)   (nは縮約後のパターン長)
//  * 空間計算量: O(n)       1次元DP配列による省メモリ化
//  */
// function isMatch(s: string, p: string): boolean {
//     const m: number = s.length;

//     // --- 前処理: 連続する '*' を 1つに縮約 ---
//     let compressed: string[] = [];
//     for (let i = 0; i < p.length; i++) {
//         if (p[i] === '*' && compressed.length > 0 && compressed[compressed.length - 1] === '*') {
//             continue; // 直前も '*' ならスキップ
//         }
//         compressed.push(p[i]);
//     }
//     const pattern: string = compressed.join('');
//     const n: number = pattern.length;

//     // --- DP配列初期化 ---
//     let prev: boolean[] = new Array(n + 1).fill(false);
//     let curr: boolean[] = new Array(n + 1).fill(false);

//     // 空文字同士は一致
//     prev[0] = true;

//     // 先頭から連続する '*' の場合の初期化
//     for (let j = 1; j <= n; j++) {
//         if (pattern[j - 1] === '*') {
//             prev[j] = prev[j - 1];
//         }
//     }

//     // --- メインループ ---
//     for (let i = 1; i <= m; i++) {
//         curr[0] = false;
//         for (let j = 1; j <= n; j++) {
//             if (pattern[j - 1] === '*') {
//                 curr[j] = prev[j] || curr[j - 1];
//             } else if (pattern[j - 1] === '?' || pattern[j - 1] === s[i - 1]) {
//                 curr[j] = prev[j - 1];
//             } else {
//                 curr[j] = false;
//             }
//         }
//         // 次ループ用に入れ替え
//         [prev, curr] = [curr, prev];
//     }

//     return prev[n];
// }
// ```

// ---

// ### 改良ポイント

// 1. **連続する`*`を1つに縮約**

//    * 例: `"a**b***c"` → `"a*b*c"`
//    * DPの列数が減るため、計算量削減（最悪ケースで数百〜千オーダーの削減効果）。
// 2. **計算量削減**

//    * 元: `O(m × p.length)`
//    * 改: `O(m × pattern.length)`（`pattern.length <= p.length`）
// 3. **メモリ効率維持**

//    * boolean配列を2本だけ保持 → **O(n)** 空間。

// ---

// もし希望があれば、この最適化版に**パターン先頭の`*`処理をさらにO(1)で処理できるEarly Exit最適化**も追加できます。
// それを入れると、入力によっては数倍速くなるケースがあります。

// では、**パターン先頭の `*` を利用した Early Exit 最適化** を追加します。
// この最適化は、パターンが実質的にすべて `*`（または `*` のみで構成）である場合に、
// **O(1)** で即座に `true` を返すので、最悪ケースの計算を回避できます。

// ---

// ```typescript
// /**
//  * ワイルドカードパターンマッチング（連続 '*' 縮約 + Early Exit 最適化版）
//  * @param s - 入力文字列（小文字英字のみ）
//  * @param p - パターン文字列（小文字英字, '?' , '*' を含む）
//  * @returns 文字列全体がパターンに一致する場合 true, それ以外 false
//  * 
//  * 時間計算量: O(m × n)   (nは縮約後のパターン長)
//  * 空間計算量: O(n)       1次元DP配列による省メモリ化
//  */
// function isMatch(s: string, p: string): boolean {
//     const m: number = s.length;

//     // --- 前処理: 連続する '*' を 1つに縮約 ---
//     let compressed: string[] = [];
//     for (let i = 0; i < p.length; i++) {
//         if (p[i] === '*' && compressed.length > 0 && compressed[compressed.length - 1] === '*') {
//             continue; // 直前も '*' ならスキップ
//         }
//         compressed.push(p[i]);
//     }
//     const pattern: string = compressed.join('');
//     const n: number = pattern.length;

//     // --- Early Exit 最適化 ---
//     // パターンが空なら文字列も空の場合のみ一致
//     if (n === 0) return m === 0;
//     // パターンが '*' 1つだけなら全て一致
//     if (n === 1 && pattern[0] === '*') return true;
//     // パターンがすべて '*' の場合は全一致
//     if (pattern.split('').every(ch => ch === '*')) return true;

//     // --- DP配列初期化 ---
//     let prev: boolean[] = new Array(n + 1).fill(false);
//     let curr: boolean[] = new Array(n + 1).fill(false);

//     prev[0] = true;

//     // 先頭から連続する '*' の場合の初期化
//     for (let j = 1; j <= n; j++) {
//         if (pattern[j - 1] === '*') {
//             prev[j] = prev[j - 1];
//         }
//     }

//     // --- メインループ ---
//     for (let i = 1; i <= m; i++) {
//         curr[0] = false;
//         for (let j = 1; j <= n; j++) {
//             if (pattern[j - 1] === '*') {
//                 curr[j] = prev[j] || curr[j - 1];
//             } else if (pattern[j - 1] === '?' || pattern[j - 1] === s[i - 1]) {
//                 curr[j] = prev[j - 1];
//             } else {
//                 curr[j] = false;
//             }
//         }
//         [prev, curr] = [curr, prev];
//     }

//     return prev[n];
// }
// ```

// ---

// ### 追加した Early Exit の効果

// 1. **パターンが空** → `m === 0` なら `true`、それ以外は `false`
// 2. **パターンが `*` 一文字のみ** → 即 `true`
// 3. **パターンが全て `*`** → 即 `true`

// これにより、極端なケース（例: `p = "**********"` のような大量の `*`）で、
// **DP計算を一切行わずに O(1) で終了**できます。

// ---

// もし望むなら、この実装にさらに\*\*`?` や通常文字の位置から最小必要長を計算して、s の長さと比較して早期に false を返す最適化\*\*も加えられます。
// これを入れると不一致が明らかなケースでさらに高速化できます。

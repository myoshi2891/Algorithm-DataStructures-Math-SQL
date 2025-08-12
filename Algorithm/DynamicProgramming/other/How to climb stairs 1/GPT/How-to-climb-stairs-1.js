// 以下のように、Node.js v16.17.1 で動作する fs を使ったメモリ効率の高い実装を書きました。
// 配列ではなく、2つの変数だけを使って漸化式を計算することで O(1) メモリで処理します。

// ```javascript
// "use strict";

// const fs = require("fs");

// /**
//  * n 段の階段を上る方法の数を計算
//  * @param {number} n - 段数 (1 ≦ n ≦ 40)
//  * @returns {number} - n 段を上る方法の数
//  */
// function countWays(n) {
//     // dp[0] = 1, dp[1] = 1
//     let prev2 = 1; // dp[i-2]
//     let prev1 = 1; // dp[i-1]

//     if (n === 0) return 1;
//     if (n === 1) return 1;

//     for (let i = 2; i <= n; i++) {
//         const current = prev1 + prev2; // dp[i] = dp[i-1] + dp[i-2]
//         prev2 = prev1;
//         prev1 = current;
//     }
//     return prev1;
// }

// // 標準入力の読み取り
// const input = fs.readFileSync(0, "utf8").trim();
// const n = parseInt(input, 10);

// // 出力
// console.log(countWays(n));
// ```

// ---

// ### 実装のポイント

// * **時間計算量**: O(n)（n ≦ 40なので十分高速）
// * **メモリ計算量**: O(1)（固定変数のみ使用）
// * fs.readFileSync(0, "utf8") で標準入力から高速に読み取り
// * 配列を使わず、直前2つの値だけ保持して漸化式を回すことで無駄なメモリを削減

// もし希望があれば、このコードを **配列版**（漸化式の計算過程を保持する形）に書き換えることもできます。

// では配列を使った **DP（動的計画法）版** に書き直します。
// Node.js v16.17.1 で動作し、fs を用いて標準入力から読み込みます。

// ```javascript
"use strict";

const fs = require("fs");

/**
 * n 段の階段を上る方法の数を DP で計算
 * @param {number} n - 段数 (1 ≦ n ≦ 40)
 * @returns {number} - n 段を上る方法の数
 */
function countWaysDP(n) {
    // dp[i] = i 段の階段を上る方法の数
    const dp = Array(n + 1).fill(0);
    dp[0] = 1; // 0段は「何もしない」1通り

    for (let i = 1; i <= n; i++) {
        if (i >= 1) dp[i] += dp[i - 1]; // 1段上る場合
        if (i >= 2) dp[i] += dp[i - 2]; // 2段上る場合
    }
    return dp[n];
}

// 標準入力から n を取得
const input = fs.readFileSync(0, "utf8").trim();
const n = parseInt(input, 10);

// 出力
console.log(countWaysDP(n));
// ```

// ---

// ### この実装の特徴

// * **DP配列を使用**して漸化式
//   `dp[i] = dp[i-1] + dp[i-2]` をそのまま実装
// * **時間計算量**: O(n)
// * **メモリ計算量**: O(n)（n+1要素の配列使用）
// * i 段目を計算する際に i-1 段目と i-2 段目を利用

// ---

// このDP版なら、漸化式の動作を配列で追えるので学習やデバッグにも便利です。
// 希望があれば、**計算過程の dp 配列の中身を出力してトレース**できる形にもできますが、その形も作りますか？

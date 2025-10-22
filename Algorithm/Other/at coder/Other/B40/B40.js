// 以下は、Node.js (18.16.1) で実行できる **効率的な JavaScript 解法**です。

// ## ✅ アルゴリズムの概要（O(N) 解法）

// 1. 各数を `100` で割った余り（`mod 100`）の出現回数を数える。
// 2. `(r + (100 - r)) % 100 === 0` になるペア `(r, 100-r)` を組み合わせて数える。

//    * 特に `r == 0` や `r == 50` のケースは、同じ余りの中から 2 つを選ぶ組み合わせ `count[r]C2`。

// ---

// ## ✅ コード（`fs` を使用）

// ```javascript
const fs = require('fs');

/**
 * (1 ≤ x < y ≤ N) かつ A[x] + A[y] が 100 の倍数になるペアの個数を返す
 * @param {number} N - 配列の長さ
 * @param {number[]} A - 数値配列（長さ N）
 * @returns {number} - 条件を満たす (x, y) の個数
 */
function countPairsDivisibleBy100(N, A) {
    const modCount = Array(100).fill(0);
    for (let i = 0; i < N; i++) {
        modCount[A[i] % 100]++;
    }

    let result = 0;

    // (0, 0), (50, 50)
    result += (modCount[0] * (modCount[0] - 1)) >> 1;
    result += (modCount[50] * (modCount[50] - 1)) >> 1;

    // (r, 100-r)
    for (let r = 1; r < 50; r++) {
        result += modCount[r] * modCount[100 - r];
    }

    return result;
}

// ----------- 入出力処理 -------------
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split(/\s+/);
const N = Number(input[0]);
const A = input.slice(1).map(Number);

console.log(countPairsDivisibleBy100(N, A));

// ## ✅ 計算量とメモリ

// * **時間計算量:** `O(N)`（1回のループ + 定数回の集計）
// * **空間計算量:** `O(100)`（mod用の配列）

// ---

// ## ✅ 入力例と出力例

// 入力:

// ```
// 9
// 10 20 30 40 50 60 70 80 90
// ```

// 出力:

// ```
// 4
// ```

// ---

// 必要であれば、テストケースや標準入力以外からの読み取り用コード（例: ファイル/テスト文字列）も追加できます。必要ですか？

// 以下は、指定された条件に従った JavaScript (Node.js v16.17.1) での解答例です。

// * 標準入力は `fs` を使用
// * 計算は O(log n) で高速に処理
// * メモリ使用は最小限（1クエリあたり O(log n)）

// ```javascript
// Node.js v16.17.1

const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);

const Q = input[0];
let idx = 1;

/**
 * cnt2
 * 与えられた整数 i を 2 で何回割れるかを返す関数
 * @param {number} i - 1以上の整数
 * @returns {number} k - i を 2で割れる回数
 */
function cnt2(i) {
    let k = 0;
    while ((i & 1) === 0) { // 偶数判定
        k++;
        i >>= 1; // 右シフトで2で割る
    }
    return k;
}

/**
 * getPath
 * BITの頂点 i から根までの最短パス上の頂点列を求める
 * @param {number} n - BITのサイズ
 * @param {number} I - 開始頂点
 * @returns {number[]} パス上の頂点をIに近い順に並べた配列、最後は0
 */
function getPath(n, I) {
    const res = [];
    let cur = I;
    while (cur > 0) {
        res.push(cur);
        const k = cnt2(cur);
        cur += 1 << k; // 親に移動
        if (cur > n) cur = 0; // 根に到達
    }
    res.push(0); // 根を追加
    return res;
}

let output = [];
for (let q = 0; q < Q; q++) {
    const n = input[idx++]; 
    const I = input[idx++];
    const path = getPath(n, I);
    output.push(path.length.toString());
    output.push(path.join(' '));
}

console.log(output.join('\n'));
// ```

// ---

// ### 実装のポイント

// 1. **高速化の工夫**

//    * `cnt2` はビット演算で偶数判定し、右シフトで除算を実現 → 高速
//    * 各クエリ O(log n) で処理可能

// 2. **メモリ効率**

//    * クエリごとの配列 `path` のみを生成 → O(log n)
//    * 出力は一括でまとめて文字列にして最後に出力

// 3. **処理時間**

//    * 最大 Q=20000、各クエリの計算は O(log n)
//    * n 最大 10^9 → log2(n) ≒ 30 回程度のループで済む

// ---

// このコードは入力例を与えると次の出力を生成します。

// ```
// 4
// 1 2 4 0
// 3
// 2 4 0
// 3
// 3 4 0
// 2
// 4 0
// 3
// 5 6 0
// 2
// 6 0
// 6
// 21 22 24 32 64 0
// 2
// 64 0
// ```

// ---

// もし希望があれば、この BIT を用いた **一点加算の実装** と **累積和計算** も追加した完全版を示すことも可能です。

// 次にそれを示しましょうか？

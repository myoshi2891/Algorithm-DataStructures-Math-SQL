// この問題は、**部分区間の 0/1 の出現回数を高速に数える典型問題**です。
// 各クエリ（`L`, `R`）に対して、アタリ（=1）とハズレ（=0）の数を数え、それを比較すればよいです。
// 高速に処理するために、**累積和（prefix sum）を使ってアタリ（=1）の個数を前計算**しておきましょう。
// ---

// ### ✅ 方針（JavaScript）

// 1. 入力を受け取る（`fs` 使用）
// 2. `N` 個のくじの結果 `A` を受け取る
// 3. 累積和 `acc` を作成（アタリの数の累積）
// 4. 各クエリ `(L, R)` に対して `acc[R] - acc[L - 1]` で区間のアタリ数を計算
// 5. 区間長と比較して出力（`win`/`lose`/`draw`）
// ---

// ### ✅ コード（JavaScript / Node.js, `fs`使用）

const fs = require('fs');

const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split('\n');
const N = Number(input[0]);
const A = input[1].split(' ').map(Number);
const Q = Number(input[2]);
const queries = input.slice(3).map((line) => line.split(' ').map(Number));

// 累積和（1の個数を数える）
const acc = [0];
for (let i = 0; i < N; i++) {
    acc.push(acc[i] + A[i]);
}

// 各クエリに答える
const result = [];
for (const [L, R] of queries) {
    const ones = acc[R] - acc[L - 1];
    const total = R - L + 1;
    const zeros = total - ones;

    if (ones > zeros) {
        result.push('win');
    } else if (zeros > ones) {
        result.push('lose');
    } else {
        result.push('draw');
    }
}

console.log(result.join('\n'));

// ### ✅ 実行例

// #### 入力

// ```
// 7
// 0 1 1 0 1 0 0
// 3
// 2 5
// 2 7
// 5 7
// ```

// #### 出力

// ```
// win
// draw
// lose
// ```

// ---

// ### ✅ 計算量・高速性

// * 前処理：O(N)（累積和）
// * 各クエリ：O(1)
// * 全体：O(N + Q) → 最大でも 2 × 10⁵ と高速！

// ---

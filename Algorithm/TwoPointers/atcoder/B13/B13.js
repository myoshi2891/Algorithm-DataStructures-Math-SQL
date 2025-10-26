// この問題は **連続部分列の和が K 以下となる個数** を高速に数える問題です。制約が厳しいため、ナイーブな `O(N^2)` 解法では間に合いません。

// ### 解法概要（Two Pointers 法）：

// * 連続部分列なので、\*\*しゃくとり法（二重ポインタ）\*\*を使います。
// * `left` から始めて、`right` を右へ進めながら部分和を計算し、合計が `K` 以下である範囲の個数をカウント。

// ### 計算量：

// * 時間計算量：`O(N)`（各要素につき `right` が一度しか進まない）
// * 空間計算量：`O(1)`（配列と変数のみ）

// ### ✅ 実装（`fs` 使用, JavaScript）：

const fs = require('fs');

// 入力読み込み
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [N, K] = input[0].split(' ').map(Number);
const A = input[1].split(' ').map(Number);

// Two pointers 法（しゃくとり法）
let count = 0;
let sum = 0;
let right = 0;

for (let left = 0; left < N; left++) {
    while (right < N && sum + A[right] <= K) {
        sum += A[right];
        right++;
    }
    count += right - left;

    if (right === left) {
        right++;
    } else {
        sum -= A[left];
    }
}

console.log(count);

// ### 🔍 入力例での処理フロー（簡略図解）：

// 入力:
// `7 50`
// `11 12 16 22 27 28 31`

// * `(0, 0)`: 11 ✅ → `sum = 11`
// * `(0, 1)`: 11+12 = 23 ✅
// * `(0, 2)`: 11+12+16 = 39 ✅
// * `(0, 3)`: 61 ❌ → right止まって、(0,3) 以上は NG
//   → → → 次は left = 1 → 以降同様

// 合計で13通り。

// ---

// ### ✅ 処理時間・メモリ使用の工夫ポイント：

// * **一度に全要素読み取り (`fs.readFileSync`)**
// * **不要な再計算を避ける (`sum`の再利用)**
// * **定数倍も意識し、`split(" ")`最小限使用**

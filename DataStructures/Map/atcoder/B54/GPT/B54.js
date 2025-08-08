// この問題は **同じ値が複数回出現した場合、その値の出現回数の組み合わせ** を数える問題です。
// 条件は `1 ≤ j < i ≤ N` なので、出現順序を守った組み合わせの個数を求めます。

// ### アルゴリズムの方針

// * **ハッシュマップ（Map）** を使って、今まで出た値の出現回数を管理。
// * 各 `A[i]` を読み込む時点で、その値が過去に何回出たかを組数に加算。
// * その後、出現回数を1増やす。
// * これにより **O(N)** で計算可能。

// ---

// ```javascript
// Node.js 18.16.1
// 処理時間とメモリを意識し、Mapを用いたO(N)解法

const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);

/**
 * @param {number} N - 配列の要素数
 * @param {number[]} arr - 整数配列 A1...AN
 * @returns {number} - 条件を満たす (i,j) の組数
 */
function countPairs(N, arr) {
    const freq = new Map(); // 値 -> 出現回数
    let count = 0; // 組数
    for (let i = 0; i < N; i++) {
        const val = arr[i];
        if (freq.has(val)) {
            // 過去の出現回数分だけ組が作れる
            count += freq.get(val);
            freq.set(val, freq.get(val) + 1);
        } else {
            freq.set(val, 1);
        }
    }
    return count;
}

const N = input[0];
const arr = input.slice(1);

const result = countPairs(N, arr);
console.log(result);

// ### 処理時間・メモリの見積もり

// * **時間計算量**: O(N) （Map操作は平均O(1)）
// * **空間計算量**: O(U) （Uは配列内の異なる値の数、最大N）
// * **N=100,000** かつ全要素異なる場合でも、Mapは約100,000要素を保持するだけなのでメモリは数MB程度。

// ---

// この実装は

// * 1回の配列走査で計算
// * 入力サイズが最大でも時間・メモリ制限内で実行可能
//   になっています。

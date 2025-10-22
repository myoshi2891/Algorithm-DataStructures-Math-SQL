// ```javascript
/**
 * 標準入力から配列Aを読み取り、BIT配列を構築して出力する
 * @param {number} n - 配列の長さ
 * @param {number[]} A - 長さnの整数配列
 * @returns {number[]} - BIT配列 (長さ n+1、先頭は0)
 *
 * 計算量: O(n log n) だが、BIT構築に限れば O(n log n) 以内で高速
 * メモリ使用量: O(n)
 */
function buildBIT(n, A) {
    const BIT = new Array(n + 1).fill(0);

    // BIT[i] = A[i - 2^k + 1] + ... + A[i]
    // ここではループを回して直接構築
    for (let i = 1; i <= n; i++) {
        // iを2で割れる最大回数 → i & -i で最下位ビットを取得
        const len = i & -i;
        let sum = 0;
        // 長さlen分の和を求める
        for (let j = i - len + 1; j <= i; j++) {
            sum += A[j - 1]; // Aは0-indexed
        }
        BIT[i] = sum;
    }
    return BIT;
}

// ---- 実行部分 ----
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);

const n = input[0];
const A = input.slice(1);

const BIT = buildBIT(n, A);
console.log(BIT.join(' '));
// ```

// ### 実装ポイント

// 1. **最下位ビット**

//    * `i & -i` で i を 2 で割れる最大回数に対応する区間長を取得。
// 2. **BIT構築**

//    * 各 `i` について、その長さ分だけ後ろから和を取る。
//    * 計算量は O(n log n) 以内で、`n <= 200000` なら十分高速。
// 3. **出力**

//    * 先頭はダミー0を含めて `BIT.join(' ')` で出力。

// ---

// この方法は **O(n log n)** ですが、入力例1は以下のように動作します:

// ```
// n=6
// A=[1,5,7,9,8,6]
// BIT=[0,1,6,7,22,8,14]
// ```

// もし希望があれば、これを **O(n)** に最適化した高速構築版 も提示できます。
// 必要ですか？

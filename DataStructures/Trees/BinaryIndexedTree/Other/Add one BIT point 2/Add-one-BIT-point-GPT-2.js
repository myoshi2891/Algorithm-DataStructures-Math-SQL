// 以下は、指定された条件（Node.js v16.17.1、`fs` を用いた標準入力処理、処理時間・メモリ消費に注意）に基づき、BIT（Binary Indexed Tree: フェニック木）を用いた一点更新処理の実装です。

// ---

// ### 🔧 実装方針

// * BIT（Fenwick Tree）を配列 A から構築。
// * 各クエリで `A[I] += b` を行い、**BIT構造の該当箇所**を更新。
// * 毎回 `BIT` を出力（インデックス0から）。

// ---

// ### ✅ コード（Node.js）

// ```javascript
const fs = require('fs');

/**
 * Binary Indexed Tree (Fenwick Tree) 構造体
 * @param {number} size - 配列の長さ
 */
class BIT {
    constructor(size) {
        this.n = size;
        this.tree = Array(this.n + 1).fill(0); // 1-indexed
    }

    /**
     * 値を加算（1-indexed）
     * @param {number} index - 加算対象のインデックス（1-based）
     * @param {number} value - 加算する値
     */
    add(index, value) {
        while (index <= this.n) {
            this.tree[index] += value;
            index += index & -index;
        }
    }

    /**
     * A_1 ~ A_index までの累積和を取得（1-indexed）
     * @param {number} index 
     * @returns {number} 累積和
     */
    sum(index) {
        let result = 0;
        while (index > 0) {
            result += this.tree[index];
            index -= index & -index;
        }
        return result;
    }

    /**
     * BIT全体の内部状態を取得
     * 0番目に0を入れた状態で返す（出力用）
     * @returns {number[]} BIT配列
     */
    getTree() {
        return [0, ...this.tree.slice(1)];
    }
}

// 標準入力読み込みと処理
function main(input) {
    const lines = input.trim().split('\n');
    const n = parseInt(lines[0]);
    const A = lines[1].split(' ').map(Number);
    const Q = parseInt(lines[2]);
    const queries = lines.slice(3).map(line => line.split(' ').map(Number));

    const bit = new BIT(n);

    // 初期BIT構築（1-indexed）
    for (let i = 0; i < n; i++) {
        bit.add(i + 1, A[i]);
    }

    for (let [I, b] of queries) {
        // A[I-1] に b を加算、BITに反映
        bit.add(I, b);

        // 現在のBITの状態出力（0からn番目まで）
        const tree = bit.getTree();
        console.log(tree.join(' '));
    }
}

// fs を用いた入力処理
const input = fs.readFileSync('/dev/stdin', 'utf8');
main(input);
// ```

// ---

// ### 💡 補足情報

// * `BIT.add(index, value)` は O(log n)
// * クエリは Q 個なので、全体計算量は O((n + Q) log n)
// * メモリ使用量：

//   * BIT: `O(n)`
//   * A, tree配列合わせても `~数KB` 程度（n, Q ≤ 500）

// ---

// ### ✅ 出力例確認（手動）

// 入力例:

// ```
// 6
// 1 5 7 9 8 6
// 5
// 5 4
// 1 10
// 3 9
// 3 8
// 4 7
// ```

// 出力（期待通り）:

// ```
// 0 1 6 7 22 12 18
// 0 11 16 7 32 12 18
// 0 11 16 16 41 12 18
// 0 11 16 24 49 12 18
// 0 11 16 24 56 12 18
// ```

// ---

// 必要があれば、経路図やBIT更新の詳細図解も追記可能です。

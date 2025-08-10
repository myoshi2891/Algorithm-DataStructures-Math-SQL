// * クエリ1（1 x）：整数 x を集合に追加
// * クエリ2（2 x）：集合内の数の中で |x - v| の最小値を求める（集合が空なら -1）

// という処理です。

// Q ≤ 100,000、x ≤ 1e9 なので、**O(log N)** の処理が必要です。
// カードは重複しないので、**二分探索可能な昇順配列**または**平衡二分探索木**を使えば高速に解けます。
// ここでは JavaScript で効率良くやるために **配列 + 二分探索 + 挿入**を採用します。
// （配列はソート済みを維持し、挿入位置は二分探索で求め、`splice`で挿入します）

// ### 実装方針

// 1. 配列 `cards` を常に昇順で保持
// 2. **クエリ1**: 二分探索で挿入位置を求めて `splice`
// 3. **クエリ2**: 二分探索で近い2つの要素を見て差の絶対値最小を計算
// 4. 実行時間・メモリを計測（`process.hrtime.bigint()`と`process.memoryUsage()`）

// ---

// ```javascript
// Node.js 18.16.1
// fsを使った高速入出力と、処理時間・メモリ測定を含む

const fs = require("fs");

/**
 * 二分探索で配列にxを挿入すべき位置を返す
 * @param {number[]} arr - 昇順配列
 * @param {number} x - 探索する値
 * @returns {number} 挿入位置
 */
function lowerBound(arr, x) {
    let left = 0, right = arr.length;
    while (left < right) {
        const mid = (left + right) >>> 1;
        if (arr[mid] < x) left = mid + 1;
        else right = mid;
    }
    return left;
}

/**
 * クエリ処理
 * @param {number} Q - クエリ数
 * @param {Array<[number, number]>} queries - クエリ配列
 * @returns {number[]} クエリ2の結果
 */
function processQueries(Q, queries) {
    const cards = []; // 昇順保持
    const output = [];

    for (let i = 0; i < Q; i++) {
        const [t, x] = queries[i];
        if (t === 1) {
            // 挿入
            const pos = lowerBound(cards, x);
            cards.splice(pos, 0, x);
        } else {
            // 最小差分探索
            if (cards.length === 0) {
                output.push(-1);
                continue;
            }
            const pos = lowerBound(cards, x);
            let minDiff = Infinity;
            if (pos < cards.length) minDiff = Math.min(minDiff, Math.abs(cards[pos] - x));
            if (pos > 0) minDiff = Math.min(minDiff, Math.abs(cards[pos - 1] - x));
            output.push(minDiff);
        }
    }
    return output;
}

// ------------------ 実行部 ------------------
const startTime = process.hrtime.bigint();
const startMem = process.memoryUsage().heapUsed;

const input = fs.readFileSync(0, "utf8").trim().split(/\s+/).map(Number);
const Q = input[0];
const queries = [];
let idx = 1;
for (let i = 0; i < Q; i++) {
    queries.push([input[idx], input[idx + 1]]);
    idx += 2;
}

const result = processQueries(Q, queries);
console.log(result.join("\n"));

const endTime = process.hrtime.bigint();
const endMem = process.memoryUsage().heapUsed;
console.error(`Execution time: ${Number(endTime - startTime) / 1e6} ms`);
console.error(`Memory used: ${(endMem - startMem) / 1024 / 1024} MB`);

// ### ポイント

// * **挿入**も**最小差分探索**も **O(log N)** の二分探索を使うため、高速。
// * `splice` は O(N) だが、Q=10^5 程度なら現実的（カード追加は1回だけなので1回の挿入負荷は軽い）。
// * 本格的に高速化したい場合は、JavaScriptでは`SortedSet`相当の構造を自作するか、`bintrees`ライブラリなどを使う方法もある。

// ---

// この実装なら制限内で十分間に合います。
// もし望むなら、配列挿入を避けるために**平衡木構造の自作**にもできますが、今回は簡潔版にしました。




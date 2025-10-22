// では、JavaScriptで説明した方針をそのままTypeScriptに落とし込みます。
// TypeScript版では**型を明確化**し、`fs`による高速入出力、処理時間・メモリ計測も含めます。

// ---

// ```typescript
// TypeScript 5.1 (Node.js 18.16.1)
// 高速入出力 + 処理時間・メモリ計測対応

import * as fs from 'fs';

/**
 * 二分探索で昇順配列にxを挿入すべき位置を返す
 * @param arr - 昇順配列
 * @param x - 探索する値
 * @returns 挿入位置 (number)
 */
function lowerBound(arr: number[], x: number): number {
    let left = 0,
        right = arr.length;
    while (left < right) {
        const mid = (left + right) >>> 1;
        if (arr[mid] < x) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    return left;
}

/**
 * クエリを処理する関数
 * @param Q - クエリ数
 * @param queries - クエリ配列（[t, x]形式）
 * @returns クエリ2の結果配列
 */
function processQueries(Q: number, queries: [number, number][]): number[] {
    const cards: number[] = []; // 昇順で保持
    const output: number[] = [];

    for (let i = 0; i < Q; i++) {
        const [t, x] = queries[i];
        if (t === 1) {
            // 挿入処理
            const pos = lowerBound(cards, x);
            cards.splice(pos, 0, x);
        } else {
            // 差の最小値探索
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

// ---------------- 実行部 ----------------
const startTime = process.hrtime.bigint();
const startMem = process.memoryUsage().heapUsed;

const input = fs.readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);
const Q = input[0];
const queries: [number, number][] = [];
let idx = 1;
for (let i = 0; i < Q; i++) {
    queries.push([input[idx], input[idx + 1]]);
    idx += 2;
}

const result = processQueries(Q, queries);
console.log(result.join('\n'));

const endTime = process.hrtime.bigint();
const endMem = process.memoryUsage().heapUsed;
console.error(`Execution time: ${Number(endTime - startTime) / 1e6} ms`);
console.error(`Memory used: ${(endMem - startMem) / 1024 / 1024} MB`);
// ```

// ---

// ### 実装のポイント

// 1. **型安全性**

//    * `queries` は `[number, number][]` 型で定義
//    * 関数の返り値型も `number[]` と明示
// 2. **二分探索**

//    * `lowerBound` 関数で O(log N) の探索
// 3. **挿入**

//    * `splice` を使って O(N) 挿入（ただし制約的に十分）
// 4. **計測**

//    * 実行時間: `process.hrtime.bigint()`
//    * メモリ使用量: `process.memoryUsage().heapUsed`

// ---

// このコードはTypeScriptで型チェック可能で、Node.js 18.16.1で制約内に収まるはずです。

// もしさらに高速化するなら、`splice`による配列挿入をやめて**平衡二分探索木構造**を自作すれば、挿入も検索も O(log N) になります。

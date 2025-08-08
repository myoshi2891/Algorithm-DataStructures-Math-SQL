// JavaScript版のロジックをそのまま **TypeScript** に書き換え、型定義を明示します。
// **O(N)** 時間で、メモリも Map に最大 N 要素保持するだけなので効率的です。

// ---

// ```typescript
// TypeScript 5.1 / Node.js 18.16.1
// fs を用いて高速入出力を行う
import * as fs from "fs";

const input: number[] = fs.readFileSync(0, "utf8").trim().split(/\s+/).map(Number);

/**
 * 条件を満たす (i, j) の組数を数える関数
 * @param N - 配列の要素数
 * @param arr - 整数配列 A1...AN
 * @returns 条件を満たす (i, j) の組数
 * 
 * 時間計算量: O(N)
 * 空間計算量: O(U) (Uは配列内の異なる値の数、最大でN)
 */
function countPairs(N: number, arr: number[]): number {
    const freq: Map<number, number> = new Map(); // 値 -> 出現回数
    let count = 0;

    for (let i = 0; i < N; i++) {
        const val = arr[i];
        if (freq.has(val)) {
            // 過去に出た回数分だけ (i, j) の組が作れる
            count += freq.get(val)!;
            freq.set(val, freq.get(val)! + 1);
        } else {
            freq.set(val, 1);
        }
    }
    return count;
}

const N: number = input[0];
const arr: number[] = input.slice(1);

const result: number = countPairs(N, arr);
console.log(result);

// ### 処理時間・メモリ見積もり

// * **時間計算量**: O(N) （Mapの`get`/`set`は平均O(1)）
// * **空間計算量**: O(U)（最大でN）
// * **メモリ消費**: N=100,000かつ全要素異なる場合でも Map は約 100,000 エントリ（数MB程度）

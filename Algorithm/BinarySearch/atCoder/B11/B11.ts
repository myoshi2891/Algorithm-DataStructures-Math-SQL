// 以下は、**TypeScript** + `fs` モジュールを用いて高速に入力を処理し、各クエリ `X` に対して「配列 A の中で X より小さい要素の個数」を求めるプログラムです。

// ---

// ### ✅ アルゴリズム概要（再掲）

// * 配列 `A` を昇順に **ソート**（`O(N log N)`）
// * 各クエリ `X` に対して **二分探索**で `X` 未満の要素数を求める（`O(log N)` × Q）

// ---

// ### ✅ TypeScript 実装（Node.js + fs）

// ```ts
import * as fs from 'fs';

// 入力読み込み（高速）
const input: string[] = fs.readFileSync('/dev/stdin', 'utf8').trim().split(/\s+/);
let idx = 0;

// 入力取得
const N: number = parseInt(input[idx++]);
const A: number[] = [];

for (let i = 0; i < N; i++) {
    A.push(parseInt(input[idx++]));
}

A.sort((a, b) => a - b); // 昇順ソート

const Q: number = parseInt(input[idx++]);
const results: number[] = [];

// 各クエリに対して lowerBound を実行
for (let i = 0; i < Q; i++) {
    const X: number = parseInt(input[idx++]);
    results.push(lowerBound(A, X));
}

// 二分探索：X より小さい要素の数を返す
function lowerBound(arr: number[], target: number): number {
    let left = 0;
    let right = arr.length;
    while (left < right) {
        const mid = (left + right) >>> 1; // unsigned right shift で高速化
        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    return left;
}

// 結果出力
console.log(results.join('\n'));
// ```

// ---

// ### ✅ 処理時間・メモリの分析

// * **時間計算量**:

//   * `sort`：`O(N log N)`
//   * `Q` 個のクエリに対して `O(log N)` → 合計 `O(Q log N)`
//   * 制約最大 `N=10^5`, `Q=10^5` でも合計約 `2×10^6` 回の操作 → **十分高速**（1秒以内）

// * **メモリ使用量**:

//   * `A`, `results`, 入力配列を保持 → 最大で `300,000` 要素程度
//   * 各要素は整数（8バイト以下） → **数MBで収まる**（1024 MiB 制限内）

// ---

// ### ✅ 入力例での確認

// 入力:

// ```
// 15
// 83 31 11 17 32 19 23 37 43 47 53 61 67 5 55
// 5
// 10
// 20
// 30
// 40
// 50
// ```

// 出力:

// ```
// 1
// 4
// 5
// 8
// 10
// ```

// ---

// ご希望あれば、`readline` を使った逐次読み込み版や、ブラウザ実行向けへの変換、型の強化（ジェネリクス）なども可能です。お気軽にどうぞ。

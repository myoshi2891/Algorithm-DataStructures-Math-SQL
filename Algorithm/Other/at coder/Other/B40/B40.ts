// 以下は **TypeScript 5.1 + Node.js 18.16.1** に対応した実装です。
// `fs` モジュールで標準入力を読み取り、**(A\[i] + A\[j]) % 100 === 0** となる `(i, j)` のペア数を高速にカウントします。

// ---

// ## ✅ TypeScript 解法（`O(N)` 時間・`O(100)` 空間）

// ```ts
import * as fs from 'fs';

/**
 * A[x] + A[y] が 100 の倍数になる (1 ≤ x < y ≤ N) のペア数を計算する
 * @param N - 配列の長さ
 * @param A - 数値配列（長さ N）
 * @returns 条件を満たすペア数（整数）
 */
function countDivisiblePairs(N: number, A: number[]): number {
  const modCount: number[] = Array(100).fill(0);

  // 各要素の100で割った余りの頻度をカウント
  for (let i = 0; i < N; i++) {
    modCount[A[i] % 100]++;
  }

  let totalPairs = 0;

  // modが0の要素同士の組み合わせ: C(n, 2)
  totalPairs += (modCount[0] * (modCount[0] - 1)) >> 1;

  // modが50の要素同士の組み合わせ: C(n, 2)
  totalPairs += (modCount[50] * (modCount[50] - 1)) >> 1;

  // 他の余り同士（r と 100-r）
  for (let r = 1; r < 50; r++) {
    totalPairs += modCount[r] * modCount[100 - r];
  }

  return totalPairs;
}

// --------- 入力処理 ----------
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split(/\s+/);
const N: number = parseInt(input[0], 10);
const A: number[] = input.slice(1).map(Number);

// --------- 出力 ----------
console.log(countDivisiblePairs(N, A));
// ```

// ---

// ## ✅ 計算量・パフォーマンス

// * **時間計算量:** `O(N)`（Nは最大200,000）→ 1秒以内に収まる
// * **空間計算量:** `O(100)`（modカウント）→ メモリ制限 1024MiB に対して余裕

// ---

// ## ✅ 実行方法

// 以下のように `main.ts` に保存し、Node.js + TypeScript で実行：

// ```sh
// tsc main.ts && node main.js < input.txt
// ```

// ---

// ## ✅ テスト例

// 入力（例）:

// ```
// 9
// 10 20 30 40 50 60 70 80 90
// ```

// 出力:

// ```
// 4
// ```

// ---

// 必要であれば、`標準入力` ではなく `関数のみでの実行テスト` や `単体テスト形式（jestなど）` にも対応できます。ご希望があればお知らせください。

// 以下に、**TypeScript 5.1 + Node.js 18.16.1** で動作する完全な解法を提示します。

// * 半分全列挙（**Meet-in-the-middle**）を使って高速化
// * 入力は `fs` モジュールを使って `/dev/stdin` から読み取ります

// ## ✅ TypeScript 解法コード

import * as fs from 'fs';

function getSubsetSums(arr: number[]): number[] {
  const result: number[] = [];
  const n: number = arr.length;
  for (let bit = 0; bit < (1 << n); bit++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      if (bit & (1 << i)) sum += arr[i];
    }
    result.push(sum);
  }
  return result;
}

function binarySearch(arr: number[], target: number): boolean {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = (left + right) >> 1;
    if (arr[mid] === target) return true;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return false;
}

function main(): void {
  const input: string = fs.readFileSync('/dev/stdin', 'utf8').trim();
  const tokens: number[] = input.split(/\s+/).map(Number);
  const N: number = tokens[0];
  const K: number = tokens[1];
  const A: number[] = tokens.slice(2);

  const mid: number = Math.floor(N / 2);
  const left: number[] = A.slice(0, mid);
  const right: number[] = A.slice(mid);

  const leftSums: number[] = getSubsetSums(left);
  const rightSums: number[] = getSubsetSums(right);
  rightSums.sort((a, b) => a - b);

  for (const x of leftSums) {
    const remain = K - x;
    if (binarySearch(rightSums, remain)) {
      console.log("Yes");
      return;
    }
  }

  console.log("No");
}

main();

// ## ✅ 実行方法（ローカル環境）

// ```bash
// # 1. ファイル名を `main.ts` として保存
// # 2. 実行（ts-node or tsc + node）
// npx ts-node main.ts < input.txt

// # または
// tsc main.ts && node main.js < input.txt
// ```

// ---

// ## ✅ 計算量と制限の確認

// * 時間計算量：`O(2^(N/2) * log(2^(N/2)))` = 約 `3.3 * 10^5`（N=30） → **1秒以内に収まる**
// * 空間計算量：最大 `2^15 ≒ 32,768` 要素 → **1024MB 制限内**
// * 型安全：全て `number` 型で明示

// ---

// ## ✅ 入力例・出力例

// ### 入力

// ```
// 6 30
// 5 1 18 7 2 9
// ```

// ### 出力

// ```
// Yes
// ```

// ---

// 必要であれば、ビジュアルな図解（例：部分和の生成方法）もご提供できます。

// 以下は、**TypeScript (Node.js 18.16.1 / TypeScript 5.1)** での解答です。
// **最大収益を得るスケジューリング問題**に対して、**優先度付きキュー（最大ヒープ）＋貪欲法**を用いて、**満点を狙える効率的な解法**を実装しています。

// ---

// ## ✅ ポイント

// * 時間計算量：`O(N log N + D log N)`
// * 空間計算量：`O(N + D)`
// * `fs.readFileSync('/dev/stdin')` を用いた高速な標準入力処理
// * 型アノテーションにより安全性確保

// ---

// ## ✅ TypeScriptコード

// ```ts
import * as fs from 'fs';

/**
 * 仕事情報型: [開始日, 報酬]
 */
type Job = [number, number];

/**
 * 最大収益を求める関数
 * @param N - 仕事の件数（1 ≦ N ≦ 2×10^5）
 * @param D - 就業可能日数（1 ≦ D ≦ 2000）
 * @param jobs - 各仕事の情報（開始可能日、報酬）
 * @returns 最大で得られる報酬
 */
function getMaxEarnings(N: number, D: number, jobs: Job[]): number {
  const jobByDay: number[][] = Array.from({ length: D + 1 }, () => []);

  // 各日の仕事を分類
  for (const [x, y] of jobs) {
    if (x <= D) jobByDay[x].push(y);
  }

  const maxHeap = new MaxHeap();
  let total = 0;

  for (let day = 1; day <= D; day++) {
    for (const reward of jobByDay[day]) {
      maxHeap.push(reward);
    }
    if (maxHeap.size() > 0) {
      total += maxHeap.pop()!;
    }
  }

  return total;
}

/**
 * 最大ヒープクラス（優先度付きキュー）
 */
class MaxHeap {
  private data: number[] = [];

  push(val: number): void {
    this.data.push(val);
    this.heapifyUp(this.data.length - 1);
  }

  pop(): number | undefined {
    if (this.data.length === 0) return undefined;
    const top = this.data[0];
    const last = this.data.pop()!;
    if (this.data.length > 0) {
      this.data[0] = last;
      this.heapifyDown(0);
    }
    return top;
  }

  size(): number {
    return this.data.length;
  }

  private heapifyUp(i: number): void {
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.data[parent] >= this.data[i]) break;
      [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];
      i = parent;
    }
  }

  private heapifyDown(i: number): void {
    const n = this.data.length;
    while (true) {
      let largest = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < n && this.data[left] > this.data[largest]) largest = left;
      if (right < n && this.data[right] > this.data[largest]) largest = right;
      if (largest === i) break;
      [this.data[i], this.data[largest]] = [this.data[largest], this.data[i]];
      i = largest;
    }
  }
}

/**
 * 標準入力からデータを読み込み、最大収益を出力
 */
function main(): void {
  const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
  const [N, D] = input[0].split(' ').map(Number);
  const jobs: Job[] = input.slice(1).map(line => {
    const [x, y] = line.split(' ').map(Number);
    return [x, y];
  });

  const result = getMaxEarnings(N, D, jobs);
  console.log(result);
}

main();
// ```

// ---

// ## ✅ 入力例（テストケース）

// ```
// 5 4
// 1 1
// 2 4
// 2 3
// 3 4
// 4 2
// ```

// ### 出力

// ```
// 12
// ```

// ---

// ## ✅ 解法の特長（満点対応）

// * `D` 日を一日ずつ進め、日ごとに実行可能な仕事を最大ヒープに追加
// * 各日ごとに `最大報酬の仕事` を実行し、報酬合計を加算
// * 効率よくヒープ操作（logN）で最大報酬を選べるので高速

// ---

// 必要であればこの解法の**ステップごとの図解**や**処理の可視化**も可能です。お気軽にどうぞ。

// 以下は、TypeScript (v5.1) + Node.js 18.16.1 向けに最適化された LeetCode 用解法です。**クラスではなく関数ベース**で記述し、\*\*優先度付きキュー（最小ヒープ）\*\*を使って高速に `k` 個のソート済み連結リストをマージします。

// ---

// ### ✅ 処理概要

// * ヒープを使って `O(N log k)` 時間でマージ
// * `ListNode` 型は LeetCode 環境で事前に定義されていると仮定

// ---

// ### ✅ 時間・空間計算量

// * **時間計算量：**`O(N log k)`
// * **空間計算量：**`O(k)`（ヒープサイズ）

// ---

// ### ✅ TypeScript 実装（関数ベース）

// ```ts
// LeetCode 環境で提供されている ListNode 型定義を前提とする
// class ListNode {
//   val: number;
//   next: ListNode | null;
//   constructor(val?: number, next?: ListNode | null) {
//     this.val = (val===undefined ? 0 : val);
//     this.next = (next===undefined ? null : next);
//   }
// }

/**
 * k個のソート済み連結リストをマージして1つのソート済み連結リストを返す
 * 
 * @param lists - ListNode型の配列。各要素はソート済み連結リストの先頭ノード
 * @returns ListNode | null - マージされたソート済み連結リストの先頭ノード
 */
function mergeKLists(lists: Array<ListNode | null>): ListNode | null {
  // 最小ヒープを表現するクラス（バイナリヒープ）
  class MinHeap {
    private heap: Array<ListNode>;

    constructor() {
      this.heap = [];
    }

    push(node: ListNode): void {
      this.heap.push(node);
      this._heapifyUp(this.heap.length - 1);
    }

    pop(): ListNode | undefined {
      if (this.heap.length === 0) return undefined;
      const min = this.heap[0];
      const end = this.heap.pop()!;
      if (this.heap.length > 0) {
        this.heap[0] = end;
        this._heapifyDown(0);
      }
      return min;
    }

    size(): number {
      return this.heap.length;
    }

    private _heapifyUp(index: number): void {
      while (index > 0) {
        const parent = Math.floor((index - 1) / 2);
        if (this.heap[index].val < this.heap[parent].val) {
          [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
          index = parent;
        } else {
          break;
        }
      }
    }

    private _heapifyDown(index: number): void {
      const length = this.heap.length;
      while (true) {
        let smallest = index;
        const left = 2 * index + 1;
        const right = 2 * index + 2;

        if (left < length && this.heap[left].val < this.heap[smallest].val) {
          smallest = left;
        }
        if (right < length && this.heap[right].val < this.heap[smallest].val) {
          smallest = right;
        }
        if (smallest === index) break;
        [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
        index = smallest;
      }
    }
  }

  const heap = new MinHeap();

  // 各リストの先頭ノードをヒープに追加
  for (const node of lists) {
    if (node !== null) {
      heap.push(node);
    }
  }

  const dummy = new ListNode(0);
  let current = dummy;

  while (heap.size() > 0) {
    const node = heap.pop()!;
    current.next = node;
    current = current.next;
    if (node.next !== null) {
      heap.push(node.next);
    }
  }

  return dummy.next;
}
// ```

// ---

// ### ✅ テスト用ユーティリティ（ローカル確認時）

// ```ts
// // 配列を連結リストに変換
// function arrayToList(arr: number[]): ListNode | null {
//   const dummy = new ListNode(0);
//   let current = dummy;
//   for (const val of arr) {
//     current.next = new ListNode(val);
//     current = current.next;
//   }
//   return dummy.next;
// }

// // 連結リストを配列に変換
// function listToArray(head: ListNode | null): number[] {
//   const result: number[] = [];
//   while (head) {
//     result.push(head.val);
//     head = head.next;
//   }
//   return result;
// }

// // 使用例
// const input = [[1,4,5], [1,3,4], [2,6]].map(arrayToList);
// const result = mergeKLists(input);
// console.log(listToArray(result)); // => [1,1,2,3,4,4,5,6]
// ```

// ---

// ### ✅ パフォーマンスの目安（LeetCode想定）

// * **実行時間：** 約 `100ms ~ 200ms`（最大入力 10⁴ ノード時）
// * **メモリ使用量：** 約 `50MB ~ 60MB`

// ---

// 必要であれば、分割統治法（Divide & Conquer）による実装も併せて提供可能です。

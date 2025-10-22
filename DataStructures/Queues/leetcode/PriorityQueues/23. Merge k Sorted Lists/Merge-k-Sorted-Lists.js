// 以下は、**JavaScript (Node.js 18.16.1)** で `k` 個のソート済み連結リストをマージする関数ベースの実装です。優先度付きキュー（最小ヒープ）を使って効率的にマージし、LeetCodeの制約条件に対応します。

// ---

// ### ✅ 処理概要

// * 各連結リストの先頭ノードを最小ヒープに入れる
// * ヒープから最小値を取り出し、新しい連結リストに追加
// * 最小ノードに次があれば、それをヒープに追加
// * 全部処理するまで繰り返す

// ---

// ### ✅ 時間計算量・空間計算量

// * 時間計算量：**O(N log k)**
//   `N` は全ノード数、`k` はリスト数（最大 10⁴）
// * 空間計算量：**O(k)**（ヒープサイズ）

// ---

// ### ✅ JavaScript 実装（関数ベース）

// ```javascript
// ListNodeの定義（LeetCode環境でも与えられている）
function ListNode(val, next = null) {
    this.val = val;
    this.next = next;
}

/**
 * @param {ListNode[]} lists - k個のソート済み連結リスト配列
 * @return {ListNode} - マージされたソート済み連結リストの先頭ノード
 */
function mergeKListsJs(lists) {
    // 最小ヒープの実装（バイナリヒープ）
    class MinHeap {
        constructor() {
            this.heap = [];
        }

        push(node) {
            this.heap.push(node);
            this._heapifyUp(this.heap.length - 1);
        }

        pop() {
            if (this.heap.length === 0) return null;
            const top = this.heap[0];
            const end = this.heap.pop();
            if (this.heap.length > 0) {
                this.heap[0] = end;
                this._heapifyDown(0);
            }
            return top;
        }

        _heapifyUp(index) {
            let parent = Math.floor((index - 1) / 2);
            while (index > 0 && this.heap[index].val < this.heap[parent].val) {
                [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
                index = parent;
                parent = Math.floor((index - 1) / 2);
            }
        }

        _heapifyDown(index) {
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

        size() {
            return this.heap.length;
        }
    }

    const heap = new MinHeap();

    // 初期化：各リストの先頭をヒープに追加
    for (const node of lists) {
        if (node !== null) {
            heap.push(node);
        }
    }

    // ダミーヘッドを使って連結リストを構築
    const dummy = new ListNode(0);
    let current = dummy;

    while (heap.size() > 0) {
        const node = heap.pop();
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

// ### ✅ 使用例（LeetCodeテスト形式）

// ```javascript
// // テスト用のヘルパー関数（配列から連結リスト作成）
// function arrayToList(arr) {
//   const dummy = new ListNode(0);
//   let current = dummy;
//   for (let val of arr) {
//     current.next = new ListNode(val);
//     current = current.next;
//   }
//   return dummy.next;
// }

// // ヘルパー（連結リストを配列に変換）
// function listToArray(node) {
//   const result = [];
//   while (node) {
//     result.push(node.val);
//     node = node.next;
//   }
//   return result;
// }

// // 実行例
// const inputLists = [[1, 4, 5], [1, 3, 4], [2, 6]].map(arrayToList);
// const merged = mergeKLists(inputLists);
// console.log(listToArray(merged)); // [1,1,2,3,4,4,5,6]
// ```

// ---

// ### ✅ 処理時間・メモリ（目安）

// LeetCodeのケース（最大1万ノード）での目安：

// * **実行時間：約 100ms 前後**
// * **メモリ使用量：約 50〜60MB**

// ※環境によるが、上記は競技プログラミングで十分な効率。

// ---

// 他に、分割統治 (`mergeSort` のような再帰ペアマージ) を使う方法もあります。必要であればそれも紹介できます。

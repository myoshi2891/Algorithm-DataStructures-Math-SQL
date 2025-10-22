---

## ✅ 完全なコード（`fs`使用）

```javascript
const fs = require('fs');

class MinHeap {
    constructor() {
        this.heap = [];
    }

    insert(val) {
        this.heap.push(val);
        this._bubbleUp();
    }

    getMin() {
        return this.heap[0];
    }

    removeMin() {
        const min = this.heap[0];
        const end = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = end;
            this._sinkDown();
        }
        return min;
    }

    _bubbleUp() {
        let idx = this.heap.length - 1;
        const element = this.heap[idx];
        while (idx > 0) {
            let parentIdx = Math.floor((idx - 1) / 2);
            let parent = this.heap[parentIdx];
            if (element >= parent) break;
            this.heap[parentIdx] = element;
            this.heap[idx] = parent;
            idx = parentIdx;
        }
    }

    _sinkDown() {
        let idx = 0;
        const length = this.heap.length;
        const element = this.heap[0];
        while (true) {
            let leftIdx = 2 * idx + 1;
            let rightIdx = 2 * idx + 2;
            let swap = null;

            if (leftIdx < length) {
                if (this.heap[leftIdx] < element) {
                    swap = leftIdx;
                }
            }

            if (rightIdx < length) {
                if (
                    (swap === null && this.heap[rightIdx] < element) ||
                    (swap !== null && this.heap[rightIdx] < this.heap[leftIdx])
                ) {
                    swap = rightIdx;
                }
            }

            if (swap === null) break;
            this.heap[idx] = this.heap[swap];
            this.heap[swap] = element;
            idx = swap;
        }
    }
}

const input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split('\n');
const Q = parseInt(input[0]);
const heap = new MinHeap();
const output = [];

for (let i = 1; i <= Q; i++) {
    const parts = input[i].split(' ').map(Number);
    if (parts[0] === 1) {
        heap.insert(parts[1]);
    } else if (parts[0] === 2) {
        output.push(heap.getMin());
    } else if (parts[0] === 3) {
        heap.removeMin();
    }
}

console.log(output.join('\n'));
```

---

## 📘 処理ごとの図解と解説

### 🔷 初期状態

```plaintext
heap = []
```

---

### 🔶 クエリ1（挿入） `1 x`

価格 `x` をヒープに追加します（`insert(x)`）。これは、最後尾に追加してから「上へバブルアップ」して位置を修正します。

#### 例）次の順に追加: `2420`, `1650`, `3000`

```
Step 1: insert(2420)
          2420

Step 2: insert(1650)
    → 1650 < 2420 なので swap
          1650
          /
        2420

Step 3: insert(3000)
    → 3000 > 1650 なのでそのまま
          1650
         /    \
      2420   3000
```

---

### 🔷 クエリ2（最小値取得） `2`

現在のヒープの最小値（インデックス0）を返します。

```plaintext
heap = [1650, 2420, 3000]
getMin() → 1650
```

---

### 🔷 クエリ3（最小値を1つ削除）`3`

ヒープの最小値を削除し、最後尾の要素を先頭にして**下へ沈める**（sink down）操作で位置を調整。

```plaintext
heap = [1650, 2420, 3000]
removeMin():
- 最小値 1650 を取り除き、末尾の 3000 を root に置く
- sinkDown() 実行 → 3000 > 2420 なので swap

Result:
      2420
         \
        3000
heap = [2420, 3000]
```

---

## 📌 時間計算量まとめ

| 操作    | 処理      | 時間計算量 |
| ------- | --------- | ---------- |
| クエリ1 | insert    | O(log N)   |
| クエリ2 | getMin    | O(1)       |
| クエリ3 | removeMin | O(log N)   |

---

## 📎 注意事項（競技環境で使う場合）

- `fs.readFileSync('/dev/stdin', 'utf-8')` は AtCoder や競プロサイト用です。
- ローカルテストでは `fs.readFileSync('input.txt', 'utf-8')` などで代用できます。

---

## ✅ 実行例

```plaintext
入力:
6
1 3000
1 1000
2
3
2
3

出力:
1000
3000
```

ヒープの状態変化：

```
insert 3000     → [3000]
insert 1000     → [1000, 3000]
getMin          → 1000
removeMin       → [3000]
getMin          → 3000
removeMin       → []
```

---

提出日時 問題 ユーザ 言語 得点 コード長 結果 実行時間 メモリ
2025-06-07 15:26:52 A53 - Priority Queue myoshizumi PHP (php 8.2.8) 1000 707 Byte 37 ms 23828 KiB 詳細
2025-06-07 15:25:03 A53 - Priority Queue myoshizumi Go (go 1.20.6) 1000 1269 Byte 19 ms 8008 KiB 詳細
2025-06-07 15:22:55 A53 - Priority Queue myoshizumi Python (CPython 3.11.4) 1000 589 Byte 42 ms 12760 KiB 詳細
2025-06-07 15:21:17 A53 - Priority Queue myoshizumi Python (CPython 3.11.4) 1000 501 Byte 47 ms 12856 KiB 詳細
2025-06-07 15:18:45 A53 - Priority Queue myoshizumi TypeScript 5.1 (Node.js 18.16.1) 1000 2495 Byte 105 ms 63592 KiB 詳細
2025-06-07 15:09:07 A53 - Priority Queue myoshizumi JavaScript (Node.js 18.16.1) 1000 2264 Byte 128 ms 64092 KiB 詳細

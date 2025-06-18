## **ダイクストラ法を使った解法（JavaScript）**
### **1. アプローチ**
ダイクストラ法を使うことで、最短経路を求めることができます。  
この問題では、部屋 `1` から部屋 `N` までの最短時間を求めるために、**グラフの最短経路問題** として考えます。

- 各部屋を **ノード** とし、通路を **エッジ（重み付き）** とする。
- 部屋 `i-1` から `i` へ移動するコスト `A[i]` を重みとするエッジを作る。
- 部屋 `i-2` から `i` へ移動するコスト `B[i]` を重みとするエッジを作る。
- **優先度付きキュー（Priority Queue）** を用いて、**最短時間を逐次更新する**。

---

### **2. 実装の流れ**
1. **グラフの構築**
   - 各部屋 `i` から `i+1` への辺（コスト `A[i]`）
   - 各部屋 `i` から `i+2` への辺（コスト `B[i]`）
   
2. **ダイクストラ法の適用**
   - **優先度付きキュー**（最小ヒープ）を用いて、最短時間を管理する。
   - 部屋 `1` から出発し、各部屋への最短時間を求める。

---

### **3. JavaScript の実装**
JavaScript には**組み込みの優先度付きキューがない**ため、**最小ヒープ（Min Heap）** を自作するか、`PriorityQueue` のライブラリを使う方法があります。  
ここでは、**バイナリヒープを用いた最小ヒープ** を自作して実装します。

```javascript
class MinHeap {
    constructor() {
        this.heap = [];
    }

    push(node) {
        this.heap.push(node);
        this.bubbleUp();
    }

    pop() {
        if (this.heap.length === 1) return this.heap.pop();
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.bubbleDown();
        return min;
    }

    bubbleUp() {
        let index = this.heap.length - 1;
        while (index > 0) {
            let parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[parentIndex][0] <= this.heap[index][0]) break;
            [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
        }
    }

    bubbleDown() {
        let index = 0;
        while (true) {
            let leftChildIndex = 2 * index + 1;
            let rightChildIndex = 2 * index + 2;
            let smallest = index;

            if (leftChildIndex < this.heap.length && this.heap[leftChildIndex][0] < this.heap[smallest][0]) {
                smallest = leftChildIndex;
            }
            if (rightChildIndex < this.heap.length && this.heap[rightChildIndex][0] < this.heap[smallest][0]) {
                smallest = rightChildIndex;
            }
            if (smallest === index) break;

            [this.heap[smallest], this.heap[index]] = [this.heap[index], this.heap[smallest]];
            index = smallest;
        }
    }

    isEmpty() {
        return this.heap.length === 0;
    }
}

function dijkstra(N, A, B) {
    const INF = Infinity;
    let dist = new Array(N + 1).fill(INF);
    let pq = new MinHeap();

    dist[1] = 0;
    pq.push([0, 1]); // [距離, 部屋番号]

    while (!pq.isEmpty()) {
        let [time, room] = pq.pop();

        if (time > dist[room]) continue;

        // 部屋 i → i+1 への移動
        if (room + 1 <= N && dist[room + 1] > dist[room] + A[room - 1]) {
            dist[room + 1] = dist[room] + A[room - 1];
            pq.push([dist[room + 1], room + 1]);
        }

        // 部屋 i → i+2 への移動
        if (room + 2 <= N && dist[room + 2] > dist[room] + B[room - 1]) {
            dist[room + 2] = dist[room] + B[room - 1];
            pq.push([dist[room + 2], room + 2]);
        }
    }

    return dist[N];
}

// 入力処理
function main(input) {
    let lines = input.trim().split("\n");
    let N = parseInt(lines[0]);
    let A = lines[1].split(" ").map(Number);
    let B = lines.length > 2 ? lines[2].split(" ").map(Number) : [];

    console.log(dijkstra(N, A, B));
}

// 標準入力の処理
process.stdin.resume();
process.stdin.setEncoding("utf-8");
let inputData = "";
process.stdin.on("data", function (chunk) {
    inputData += chunk;
});
process.stdin.on("end", function () {
    main(inputData);
});
```

---

### **4. 解説**
#### **1) 最小ヒープ（Min Heap）**
ダイクストラ法では、次に探索する最短距離のノードをすぐに取り出せる必要があるため、**優先度付きキュー（最小ヒープ）** を用います。

- `push([距離, 部屋番号])`：距離が小さい順に並ぶように要素を追加
- `pop()`：最も小さい距離の要素を取り出す
- `isEmpty()`：キューが空かどうか判定

#### **2) ダイクストラ法**
1. `dist[i]` を「部屋 `i` への最短時間」とする。
2. `dist[1] = 0`（出発地点）にし、優先度付きキュー `pq` に入れる。
3. `pq` から取り出し、隣接する部屋（`i+1`, `i+2`）を更新。
4. すべての部屋を訪問し終えたら、`dist[N]` を出力。

---

### **5. 計算量**
- `N` 個のノードがあり、各ノードから最大2つの辺（`i → i+1`, `i → i+2`）がある。
- 優先度付きキューの操作（`push`, `pop`）は **`O(log N)`**。
- 各ノードに対して `O(log N)` の操作を行うため、**全体の計算量は `O(N log N)`** となる。

---

### **6. 例**
#### **入力**
```
5
2 4 1 3
5 3 7
```
#### **処理**
```
(1) → (2) コスト2
(1) → (3) コスト5
(2) → (3) コスト6
(2) → (4) コスト5
(3) → (4) コスト6
(3) → (5) コスト12
(4) → (5) コスト8
```
#### **出力**
```
8
```

---

### **7. まとめ**
- **ダイクストラ法** を使うことで、**`O(N log N)`** の計算量で最短経路を求めることができる。
- **最小ヒープ** を使うことで、最短距離を効率よく管理できる。
- **動的計画法（DP）** と比べても、大きな `N` でも高速に解ける。
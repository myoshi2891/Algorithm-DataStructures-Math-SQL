### **Priority Queue（優先度付きキュー）とは？**

**Priority Queue（優先度付きキュー）**は、各要素に「優先度」を割り当てて、優先度に基づいて要素を管理するデータ構造です。通常のキュー（FIFO: 先入れ先出し）とは異なり、**最も優先度の高い要素が最初に取り出されます**。

#### **主な特徴**
1. **要素の挿入（enqueue）**: 新しい要素を追加します。追加時に優先度を指定します。
2. **要素の取り出し（dequeue）**: 優先度が最も高い要素を取り出します。
3. **優先度の基準**:
   - **最小優先度キュー（Min-Priority Queue）**: 優先度が最も低い（数値が小さい）要素が最初に取り出される。
   - **最大優先度キュー（Max-Priority Queue）**: 優先度が最も高い（数値が大きい）要素が最初に取り出される。

---

### **Priority Queueの実装方法**

JavaScriptでは、以下の2つの方法で実装することが一般的です。

1. **配列を使った簡単な実装**  
2. **ヒープ（Heap）を使った効率的な実装**

---

### **1. 配列を使った簡単な実装**

#### **基本構造**

```javascript
class PriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(element, priority) {
    const queueElement = { element, priority };
    let added = false;

    // 優先度の高い順に挿入
    for (let i = 0; i < this.items.length; i++) {
      if (queueElement.priority < this.items[i].priority) {
        this.items.splice(i, 0, queueElement);
        added = true;
        break;
      }
    }

    // 優先度が一番低い場合は末尾に追加
    if (!added) {
      this.items.push(queueElement);
    }
  }

  dequeue() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items.shift(); // 先頭の要素を取り出す
  }

  front() {
    return this.isEmpty() ? "Queue is empty" : this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  printQueue() {
    return this.items.map(item => `${item.element} (Priority: ${item.priority})`).join(", ");
  }
}
```

#### **使用例**

```javascript
const pq = new PriorityQueue();

pq.enqueue("Task 1", 2);
pq.enqueue("Task 2", 1);
pq.enqueue("Task 3", 3);

console.log(pq.printQueue());  // Task 2 (Priority: 1), Task 1 (Priority: 2), Task 3 (Priority: 3)

console.log(pq.dequeue());     // { element: 'Task 2', priority: 1 }
console.log(pq.printQueue());  // Task 1 (Priority: 2), Task 3 (Priority: 3)
```

#### **メリットとデメリット**

| メリット                 | デメリット                                   |
|--------------------------|----------------------------------------------|
| 実装が簡単               | 挿入（enqueue）時にO(n)の時間がかかる        |
| 小規模なデータに適している | 大規模データには非効率（特に大量の挿入操作時）|

---

### **2. ヒープ（Heap）を使った効率的な実装**

ヒープは、**挿入**と**削除**が**O(log n)**で行えるため、大規模なデータを扱う際に優れています。

#### **バイナリヒープの概念**

- **最小ヒープ（Min-Heap）**: 親ノードの値が子ノードの値より小さい（優先度が高い）。
- **最大ヒープ（Max-Heap）**: 親ノードの値が子ノードの値より大きい（優先度が高い）。

---

#### **ヒープを使ったPriority Queueの実装**

```javascript
class MinHeap {
  constructor() {
    this.heap = [];
  }

  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  getLeftChildIndex(index) {
    return 2 * index + 1;
  }

  getRightChildIndex(index) {
    return 2 * index + 2;
  }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  insert(element, priority) {
    const node = { element, priority };
    this.heap.push(node);
    this.heapifyUp();
  }

  heapifyUp() {
    let index = this.heap.length - 1;
    while (index > 0) {
      const parentIndex = this.getParentIndex(index);
      if (this.heap[index].priority >= this.heap[parentIndex].priority) break;
      this.swap(index, parentIndex);
      index = parentIndex;
    }
  }

  remove() {
    if (this.heap.length === 0) return "Queue is empty";
    if (this.heap.length === 1) return this.heap.pop();

    const root = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown();
    return root;
  }

  heapifyDown() {
    let index = 0;
    const length = this.heap.length;

    while (this.getLeftChildIndex(index) < length) {
      let smallerChildIndex = this.getLeftChildIndex(index);
      const rightChildIndex = this.getRightChildIndex(index);

      if (
        rightChildIndex < length &&
        this.heap[rightChildIndex].priority < this.heap[smallerChildIndex].priority
      ) {
        smallerChildIndex = rightChildIndex;
      }

      if (this.heap[index].priority <= this.heap[smallerChildIndex].priority) break;

      this.swap(index, smallerChildIndex);
      index = smallerChildIndex;
    }
  }

  peek() {
    return this.heap.length === 0 ? "Queue is empty" : this.heap[0];
  }

  size() {
    return this.heap.length;
  }
}
```

#### **使用例**

```javascript
const priorityQueue = new MinHeap();

priorityQueue.insert("Task A", 3);
priorityQueue.insert("Task B", 1);
priorityQueue.insert("Task C", 2);

console.log(priorityQueue.peek());  // { element: 'Task B', priority: 1 }

console.log(priorityQueue.remove()); // { element: 'Task B', priority: 1 }
console.log(priorityQueue.peek());   // { element: 'Task C', priority: 2 }
```

---

### **配列 vs ヒープ：性能比較**

| 操作        | 配列ベースの実装  | ヒープベースの実装 |
|-------------|-------------------|--------------------|
| 挿入        | O(n)              | O(log n)           |
| 取り出し    | O(1)              | O(log n)           |
| 探索        | O(n)              | O(1)               |

---

### **応用例**

- **タスクスケジューリング**: 優先度に応じてタスクを順番に処理。
- **ダイクストラ法**: 最短経路アルゴリズムにおけるノードの管理。
- **イベント駆動型システム**: イベントの処理順序管理。

---

### **まとめ**

- **小規模なデータ**には配列ベースのPriority Queueが簡単で便利。
- **大規模なデータ**や**高頻度な操作**にはヒープベースの実装が効率的。

---

### **ヒープ（Heap）とは？**

ヒープは**完全二分木**（完全バイナリツリー）をベースにしたデータ構造で、次の2つの種類があります。

1. **最小ヒープ（Min-Heap）**:  
   親ノードの値が子ノードの値より**小さい**。これにより、**最小値**が常にルートに位置します。

2. **最大ヒープ（Max-Heap）**:  
   親ノードの値が子ノードの値より**大きい**。これにより、**最大値**が常にルートに位置します。

---

### **ヒープの特徴**

- **完全二分木**: すべてのレベルが完全に埋められており、最下層は左詰めになっています。
- **配列による実装**: ヒープは**配列**で効率的に表現できます。ツリー構造を使わなくても配列のインデックス操作で親子関係を管理できます。

---

### **配列でのヒープ表現**

ヒープは配列で次のように親子関係を表現します。

- **親ノードのインデックス** = `Math.floor((i - 1) / 2)`
- **左の子ノードのインデックス** = `2 * i + 1`
- **右の子ノードのインデックス** = `2 * i + 2`

#### **例: Min-Heap の配列表現**

```
配列: [3, 5, 7, 10, 12, 8]

       3
     /   \
    5     7
   / \   /
 10  12 8
```

---

### **Priority Queueのヒープによる実装**

以下は、最小ヒープ（Min-Heap）を使ったPriority Queueの詳細実装です。

---

#### **1. ヒープクラスの基本構造**

```javascript
class MinHeap {
  constructor() {
    this.heap = [];
  }

  // 親ノードのインデックスを取得
  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  // 左右の子ノードのインデックスを取得
  getLeftChildIndex(index) {
    return 2 * index + 1;
  }

  getRightChildIndex(index) {
    return 2 * index + 2;
  }

  // 2つのノードをスワップ
  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
}
```

---

#### **2. 要素の挿入（insert）**

ヒープに要素を追加した後、ヒープの性質（親 ≤ 子）を保つために**ヒープ化（heapify-up）**を行います。

```javascript
insert(element, priority) {
  const node = { element, priority };
  this.heap.push(node); // 末尾に追加
  this.heapifyUp();     // ヒープの性質を維持
}

heapifyUp() {
  let index = this.heap.length - 1; // 追加した要素のインデックス

  while (index > 0) {
    const parentIndex = this.getParentIndex(index);

    // 親の優先度が子の優先度より小さい場合はヒープの性質が維持されている
    if (this.heap[parentIndex].priority <= this.heap[index].priority) {
      break;
    }

    // 親と子をスワップ
    this.swap(index, parentIndex);
    index = parentIndex; // 親ノードに移動して再確認
  }
}
```

**例: 挿入操作の流れ**

1. ヒープ: `[3, 5, 7]`
2. 新しい要素（2, 優先度2）を挿入:
   - 末尾に`2`を追加 → `[3, 5, 7, 2]`
   - `2`と親ノード`5`を比較、`2 < 5`なのでスワップ → `[3, 2, 7, 5]`
   - `2`とさらに親ノード`3`を比較、`2 < 3`なのでスワップ → `[2, 3, 7, 5]`

---

#### **3. 要素の削除（remove）**

常に最優先の要素（ヒープのルート）を削除し、末尾の要素をルートに移動してから**ヒープ化（heapify-down）**を行います。

```javascript
remove() {
  if (this.heap.length === 0) return "Queue is empty";
  if (this.heap.length === 1) return this.heap.pop(); // 要素が1つの場合

  const root = this.heap[0]; // ルート（最優先要素）を保存
  this.heap[0] = this.heap.pop(); // 末尾の要素をルートに移動
  this.heapifyDown(); // ヒープの性質を維持
  return root; // 最優先要素を返す
}

heapifyDown() {
  let index = 0;
  const length = this.heap.length;

  while (this.getLeftChildIndex(index) < length) {
    let smallerChildIndex = this.getLeftChildIndex(index);
    const rightChildIndex = this.getRightChildIndex(index);

    // 右の子が存在して、左の子より小さい場合
    if (
      rightChildIndex < length &&
      this.heap[rightChildIndex].priority < this.heap[smallerChildIndex].priority
    ) {
      smallerChildIndex = rightChildIndex;
    }

    // 親ノードが子ノードより小さければ終了
    if (this.heap[index].priority <= this.heap[smallerChildIndex].priority) break;

    // 親と小さい方の子をスワップ
    this.swap(index, smallerChildIndex);
    index = smallerChildIndex; // 次の子に移動して再確認
  }
}
```

**例: 削除操作の流れ**

1. ヒープ: `[2, 3, 7, 5]`
2. ルート`2`を削除し、末尾の`5`をルートに移動 → `[5, 3, 7]`
3. `5`と左の子`3`を比較、`5 > 3`なのでスワップ → `[3, 5, 7]`
4. これでヒープの性質が維持されました。

---

#### **4. その他の便利なメソッド**

- **最優先要素の参照（peek）**: ヒープのルート要素を返す（削除しない）。

  ```javascript
  peek() {
    return this.heap.length === 0 ? "Queue is empty" : this.heap[0];
  }
  ```

- **サイズ確認**:

  ```javascript
  size() {
    return this.heap.length;
  }
  ```

---

### **全体のコードまとめ**

```javascript
class MinHeap {
  constructor() {
    this.heap = [];
  }

  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  getLeftChildIndex(index) {
    return 2 * index + 1;
  }

  getRightChildIndex(index) {
    return 2 * index + 2;
  }

  swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  insert(element, priority) {
    const node = { element, priority };
    this.heap.push(node);
    this.heapifyUp();
  }

  heapifyUp() {
    let index = this.heap.length - 1;
    while (index > 0) {
      const parentIndex = this.getParentIndex(index);
      if (this.heap[parentIndex].priority <= this.heap[index].priority) break;
      this.swap(index, parentIndex);
      index = parentIndex;
    }
  }

  remove() {
    if (this.heap.length === 0) return "Queue is empty";
    if (this.heap.length === 1) return this.heap.pop();

    const root = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown();
    return root;
  }

  heapifyDown() {
    let index = 0;
    const length = this.heap.length;

    while (this.getLeftChildIndex(index) < length) {
      let smallerChildIndex = this.getLeftChildIndex(index);
      const rightChildIndex = this.getRightChildIndex(index);

      if (
        rightChildIndex < length &&
        this.heap[rightChildIndex].priority < this.heap[smallerChildIndex].priority
      ) {
        smallerChildIndex = rightChildIndex;
      }

      if (this.heap[index].priority <= this.heap[smallerChildIndex].priority) break;

      this.swap(index, smallerChildIndex);
      index = smallerChildIndex;
    }
  }

  peek() {
    return this.heap.length === 0 ? "Queue is empty" : this.heap[0];
  }

  size() {
    return this.heap.length;
  }
}
```

---

### **使用例**

```javascript
const priorityQueue = new MinHeap();

priorityQueue.insert("Task A", 3);
priorityQueue.insert("Task B", 1);
priorityQueue.insert("Task C", 2);

console.log(priorityQueue.peek());  // { element: 'Task B', priority: 1 }

console.log(priorityQueue.remove()); // { element: 'Task B', priority: 1 }
console.log(priorityQueue.peek());   // { element: 'Task C', priority: 2 }

priorityQueue.insert("Task D", 0);
console.log(priorityQueue.peek());   // { element: 'Task D', priority: 0 }
```

---

### **ヒープベースのPriority Queueの利点**

1. **効率的な挿入と削除**: 挿入と削除の時間計算量は**O(log n)**。
2. **常に最優先の要素にアクセス可能**: ルートノードは常に最も優先度の高い要素です。
3. **メモリ効率**: 配列で管理できるため、追加のポインタ管理が不要です。

---

### **次のステップ**

- **最大ヒープ（Max-Heap）の実装**に興味があれば、それも説明できます！
- **ヒープソート**や**ダイクストラ法**のような実際のアルゴリズムへの応用も解説できますよ。
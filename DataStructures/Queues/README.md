キュー（Queue）は、**先入れ先出し（FIFO: First-In-First-Out）**の特性を持つデータ構造です。これは、最初に追加された要素が最初に取り出されるという動作をします。キューは以下のような操作をサポートします：

1. **`enqueue`**: キューの末尾に要素を追加する操作。
2. **`dequeue`**: キューの先頭から要素を取り出す操作。
3. **`peek`** (または `front`): キューの先頭の要素を確認する操作（削除はしない）。
4. **`isEmpty`**: キューが空かどうかを確認する操作。
5. **`size`**: キューの現在の要素数を取得する操作。

以下に、JavaScriptでキューを実装する例を示します。

---

### キューの実装例

```javascript
class Queue {
  constructor() {
    this.items = [];
  }

  // 要素をキューの末尾に追加
  enqueue(element) {
    this.items.push(element);
  }

  // キューの先頭から要素を削除して返す
  dequeue() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items.shift();
  }

  // キューの先頭の要素を返す（削除はしない）
  peek() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items[0];
  }

  // キューが空かどうかを確認
  isEmpty() {
    return this.items.length === 0;
  }

  // キューの要素数を返す
  size() {
    return this.items.length;
  }

  // キューの中身を文字列として表示
  print() {
    console.log(this.items.join(" -> "));
  }
}

// キューの使用例
const queue = new Queue();

// 要素を追加
queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);
console.log("Queue after enqueue:");
queue.print(); // 10 -> 20 -> 30

// 要素を取り出す
console.log("Dequeued element:", queue.dequeue()); // 10
console.log("Queue after dequeue:");
queue.print(); // 20 -> 30

// 先頭の要素を確認
console.log("Front element:", queue.peek()); // 20

// キューのサイズを確認
console.log("Queue size:", queue.size()); // 2

// キューが空か確認
console.log("Is queue empty?", queue.isEmpty()); // false
```

---

### 主な特徴とポイント

- **`Array`を利用**:
  - この例では、JavaScriptの配列（`Array`）を内部で使ってキューを実現しています。
  - 配列の`push`メソッドで末尾に要素を追加し、`shift`メソッドで先頭の要素を削除しています。
- **効率**:
  - `shift`メソッドは配列内の要素を再配置するため、大量のデータを扱う場合は効率が低下する可能性があります。
  - 高パフォーマンスが必要な場合、**連結リスト**を使った実装も考慮されます。

---

### 配列を使わない実装（連結リストを使う）

連結リスト（Linked List）を使ったキューの実装は、配列ベースの実装よりも効率的にすることができます。特に、配列の`shift`操作による要素の再配置を回避できるため、大量のデータを扱う際にパフォーマンスが向上します。

以下は、連結リストを使用したキューの実装方法の例です。

---

### 基本構造

連結リストでのキューは、次の2つのポイントが重要です：
1. **ノード（Node）**:
   - データ（値）と次のノードへの参照を持つオブジェクト。
2. **キュー自体**:
   - キュー全体を管理するために、**先頭（head）**と**末尾（tail）**の参照を保持します。

---

### 実装例

```javascript
// ノードの定義
class Node {
  constructor(value) {
    this.value = value; // ノードのデータ
    this.next = null;   // 次のノードへの参照
  }
}

// キューの定義（連結リストを使用）
class LinkedListQueue {
  constructor() {
    this.head = null; // キューの先頭
    this.tail = null; // キューの末尾
    this.length = 0;  // キューのサイズ
  }

  // 要素をキューの末尾に追加
  enqueue(value) {
    const newNode = new Node(value);
    if (this.isEmpty()) {
      this.head = this.tail = newNode; // 初めての要素を追加
    } else {
      this.tail.next = newNode; // 現在の末尾の次を新しいノードに設定
      this.tail = newNode;      // 新しい末尾を更新
    }
    this.length++;
  }

  // キューの先頭から要素を削除して返す
  dequeue() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    const removedValue = this.head.value; // 先頭の値を保存
    this.head = this.head.next;          // 先頭を次のノードに移動
    this.length--;

    if (this.isEmpty()) {
      this.tail = null; // キューが空になった場合、末尾もリセット
    }

    return removedValue;
  }

  // キューの先頭の要素を返す（削除しない）
  peek() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.head.value;
  }

  // キューが空かどうか確認
  isEmpty() {
    return this.length === 0;
  }

  // キューのサイズを取得
  size() {
    return this.length;
  }

  // キューの中身を表示
  print() {
    let current = this.head;
    const values = [];
    while (current) {
      values.push(current.value);
      current = current.next;
    }
    console.log(values.join(" -> "));
  }
}

// 使用例
const queue = new LinkedListQueue();

// 要素を追加
queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);
console.log("Queue after enqueue:");
queue.print(); // 10 -> 20 -> 30

// 要素を取り出す
console.log("Dequeued element:", queue.dequeue()); // 10
console.log("Queue after dequeue:");
queue.print(); // 20 -> 30

// 先頭の要素を確認
console.log("Front element:", queue.peek()); // 20

// キューのサイズを確認
console.log("Queue size:", queue.size()); // 2

// キューが空か確認
console.log("Is queue empty?", queue.isEmpty()); // false
```

---

### 実装のポイント

1. **`enqueue`（要素の追加）**:
   - 新しいノードを作成し、現在の末尾ノードの`next`に設定。
   - キューが空の場合は、`head`と`tail`の両方を新しいノードに設定。

2. **`dequeue`（要素の削除）**:
   - 現在の先頭ノード（`head`）を削除し、その次のノードを新しい先頭に設定。
   - キューが空になった場合、`tail`も`null`にリセット。

3. **効率**:
   - `enqueue`と`dequeue`の操作は**O(1)**の時間で実行できます。
   - 配列ベースの実装では`dequeue`が**O(n)**になるため、連結リストの方が効率的です。

---

### 配列ベース vs 連結リストの使い分け

- **配列ベースのキュー**:
  - 小規模で要素数が頻繁に変化しない場合に適しています。
  - 実装が簡単で、JavaScriptのビルトインメソッドを活用可能。

- **連結リストベースのキュー**:
  - 要素数が頻繁に増減する場合や、パフォーマンスが重要な場合に適しています。
  - メモリのオーバーヘッドがやや大きい（各ノードの`next`への参照分のメモリが必要）。

---


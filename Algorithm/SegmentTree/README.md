### Segment Tree（セグメントツリー）とは
**Segment Tree** は、配列の特定の範囲に対する集約値（最大値、最小値、合計値、GCD など）を効率的に求めたり更新したりするためのデータ構造です。

#### 主な用途
- **範囲クエリ**: 配列の指定された範囲に対する値（例: 最大値、最小値、合計値）を高速に計算。
- **ポイント更新**: 配列内の値を変更し、その変更を即座に反映。

#### 特徴
- **クエリ処理時間**: \(O(\log N)\)
- **更新処理時間**: \(O(\log N)\)
- **構築時間**: \(O(N)\)

#### セグメントツリーの構造
セグメントツリーは配列を二分木に拡張したものです。  
- 葉ノード（最下層）: 元の配列の各要素を格納。
- 内部ノード: そのノードがカバーする区間の集約値を格納。

例えば、長さ \(N=8\) の配列を最大値で構築する場合、次のようなツリーが構築されます：
```
元の配列:    [5, 2, 4, 7, 1, 3, 6, 8]
セグメントツリー:
                     8
           /                   \
         7                       8
      /     \                 /     \
    5         7           3         8
  /   \     /   \       /   \     /   \
 5     2   4     7     1     3   6     8
```

---

### Segment Tree のアルゴリズム

#### 1. **構築 (Build)**
セグメントツリーを構築する際、元の配列のデータを利用して木を作ります。

##### アルゴリズム
1. 葉ノードに元の配列の値を割り当てる。
2. 内部ノードは、その子ノードの集約値を計算して格納。

##### 時間計算量
- \(O(N)\): \(N\) 個の葉ノードを構築し、それを基に内部ノードを計算。

---

#### 2. **クエリ (Query)**
指定された範囲の値（最大値、最小値、合計値など）を取得します。

##### アルゴリズム
1. 範囲 \([L, R]\) が現在のノードの区間に完全に含まれている場合、そのノードの値を返す。
2. 範囲 \([L, R]\) が現在のノードの区間と交差する場合、子ノードを再帰的に探索し、その結果を統合する。
3. 範囲 \([L, R]\) が現在のノードの区間と重ならない場合、無視する。

##### 時間計算量
- \(O(\log N)\): 各レベルで分割統治を行うため、探索の深さは木の高さに比例。

---

#### 3. **更新 (Update)**
配列内の値を変更した際、その変更をセグメントツリーに反映します。

##### アルゴリズム
1. 葉ノードの値を更新。
2. 更新された葉ノードに影響を受ける親ノードを再帰的に更新。

##### 時間計算量
- \(O(\log N)\): 木の高さ分だけ再帰的に更新を行う。

---
以下は、**JavaScript** と **TypeScript** でセグメントツリーのアルゴリズムを実装する方法について説明します。

---

### **セグメントツリーの基本構造**
セグメントツリーは、配列の範囲クエリを高速に処理するための木構造です。  
配列の要素を「葉ノード」とし、範囲の集約値（最大値、最小値、合計など）を「内部ノード」に格納します。

---

### **JavaScript 実装**

#### **基本クラス構造**
```javascript
class SegmentTree {
  constructor(arr) {
    this.n = arr.length;
    this.tree = new Array(4 * this.n).fill(0); // セグメントツリー用配列
    this.build(arr, 0, 0, this.n - 1); // ツリーの構築
  }

  // ツリーを構築する
  build(arr, node, start, end) {
    if (start === end) {
      // 葉ノード
      this.tree[node] = arr[start];
    } else {
      const mid = Math.floor((start + end) / 2);
      const leftNode = 2 * node + 1;
      const rightNode = 2 * node + 2;

      this.build(arr, leftNode, start, mid); // 左の子ノード
      this.build(arr, rightNode, mid + 1, end); // 右の子ノード

      // 内部ノードの値を計算（最大値の場合）
      this.tree[node] = Math.max(this.tree[leftNode], this.tree[rightNode]);
    }
  }

  // 範囲クエリ
  query(node, start, end, l, r) {
    if (r < start || l > end) {
      // クエリ範囲外
      return -Infinity;
    }
    if (l <= start && end <= r) {
      // 完全にクエリ範囲内
      return this.tree[node];
    }
    // 部分的にクエリ範囲に重なる場合
    const mid = Math.floor((start + end) / 2);
    const leftQuery = this.query(2 * node + 1, start, mid, l, r);
    const rightQuery = this.query(2 * node + 2, mid + 1, end, l, r);
    return Math.max(leftQuery, rightQuery);
  }

  // 範囲クエリを簡単に呼び出す
  rangeQuery(l, r) {
    return this.query(0, 0, this.n - 1, l, r);
  }

  // 値の更新
  update(node, start, end, idx, value) {
    if (start === end) {
      // 葉ノードの更新
      this.tree[node] = value;
    } else {
      const mid = Math.floor((start + end) / 2);
      const leftNode = 2 * node + 1;
      const rightNode = 2 * node + 2;

      if (idx <= mid) {
        // 左の子ノードを更新
        this.update(leftNode, start, mid, idx, value);
      } else {
        // 右の子ノードを更新
        this.update(rightNode, mid + 1, end, idx, value);
      }

      // 内部ノードの更新
      this.tree[node] = Math.max(this.tree[leftNode], this.tree[rightNode]);
    }
  }

  // 値の更新を簡単に呼び出す
  pointUpdate(idx, value) {
    this.update(0, 0, this.n - 1, idx, value);
  }
}
```

#### **使用例**
```javascript
const arr = [1, 3, 5, 7, 9, 11];
const segTree = new SegmentTree(arr);

// 範囲 [1, 4] の最大値を取得
console.log(segTree.rangeQuery(1, 4)); // 出力: 9

// 配列の 3 番目の値を 6 に更新
segTree.pointUpdate(3, 6);

// 更新後の範囲 [1, 4] の最大値を取得
console.log(segTree.rangeQuery(1, 4)); // 出力: 9
```

---

### **TypeScript 実装**

#### **基本クラス構造**
TypeScript の型安全性を活かした実装です。

```typescript
class SegmentTree {
  private tree: number[];
  private n: number;

  constructor(arr: number[]) {
    this.n = arr.length;
    this.tree = new Array(4 * this.n).fill(0); // セグメントツリー用配列
    this.build(arr, 0, 0, this.n - 1); // ツリーの構築
  }

  // ツリーを構築する
  private build(arr: number[], node: number, start: number, end: number): void {
    if (start === end) {
      // 葉ノード
      this.tree[node] = arr[start];
    } else {
      const mid = Math.floor((start + end) / 2);
      const leftNode = 2 * node + 1;
      const rightNode = 2 * node + 2;

      this.build(arr, leftNode, start, mid); // 左の子ノード
      this.build(arr, rightNode, mid + 1, end); // 右の子ノード

      // 内部ノードの値を計算（最大値の場合）
      this.tree[node] = Math.max(this.tree[leftNode], this.tree[rightNode]);
    }
  }

  // 範囲クエリ
  private query(node: number, start: number, end: number, l: number, r: number): number {
    if (r < start || l > end) {
      // クエリ範囲外
      return -Infinity;
    }
    if (l <= start && end <= r) {
      // 完全にクエリ範囲内
      return this.tree[node];
    }
    // 部分的にクエリ範囲に重なる場合
    const mid = Math.floor((start + end) / 2);
    const leftQuery = this.query(2 * node + 1, start, mid, l, r);
    const rightQuery = this.query(2 * node + 2, mid + 1, end, l, r);
    return Math.max(leftQuery, rightQuery);
  }

  // 範囲クエリを簡単に呼び出す
  public rangeQuery(l: number, r: number): number {
    return this.query(0, 0, this.n - 1, l, r);
  }

  // 値の更新
  private update(node: number, start: number, end: number, idx: number, value: number): void {
    if (start === end) {
      // 葉ノードの更新
      this.tree[node] = value;
    } else {
      const mid = Math.floor((start + end) / 2);
      const leftNode = 2 * node + 1;
      const rightNode = 2 * node + 2;

      if (idx <= mid) {
        // 左の子ノードを更新
        this.update(leftNode, start, mid, idx, value);
      } else {
        // 右の子ノードを更新
        this.update(rightNode, mid + 1, end, idx, value);
      }

      // 内部ノードの更新
      this.tree[node] = Math.max(this.tree[leftNode], this.tree[rightNode]);
    }
  }

  // 値の更新を簡単に呼び出す
  public pointUpdate(idx: number, value: number): void {
    this.update(0, 0, this.n - 1, idx, value);
  }
}
```

#### **使用例**
```typescript
const arr: number[] = [1, 3, 5, 7, 9, 11];
const segTree = new SegmentTree(arr);

// 範囲 [1, 4] の最大値を取得
console.log(segTree.rangeQuery(1, 4)); // 出力: 9

// 配列の 3 番目の値を 6 に更新
segTree.pointUpdate(3, 6);

// 更新後の範囲 [1, 4] の最大値を取得
console.log(segTree.rangeQuery(1, 4)); // 出力: 9
```

---

### **まとめ**
- **セグメントツリーの基本操作**: 範囲クエリとポイント更新をサポート。
- **効率性**: 構築 \(O(N)\)、クエリ・更新 \(O(\log N)\)。

`this.tree = new Array(4 * this.n);` という処理は、**セグメントツリー**を構築するための配列を初期化する部分です。この配列は、元の配列（データ）から計算される中間値（ここでは最大値）を保持するために使われます。

### **なぜ `4 * n` なのか？**

1. **セグメントツリーの構造**:
   - セグメントツリーは基本的に**二分木**の形をしており、各ノードが配列の一部分の情報（この場合は区間の最大値）を保持します。
   - **親ノード**は、**子ノード**の情報を基に計算されます。

2. **必要なサイズの理由**:
   - **完全二分木**において、**葉ノード**の数は元の配列の要素数 \(n\) に等しいです。
   - **最悪の場合**、完全二分木を構築するために必要なノード数は約 \(2n - 1\) になります。
   - しかし、配列の長さ \(n\) が2の冪でない場合でも対応できるように、余裕を持って `4 * n` サイズを確保します。これにより、どんな場合でも十分なスペースが確保され、**オーバーフロー**を防げます。

   **例:**
   - 元の配列が \(n = 7\) の場合、\(2n - 1 = 13\) 個のノードが必要ですが、`4 * 7 = 28` としておけば余裕があります。

---

### **セグメントツリーの例**

#### 元の配列
```plaintext
[1, 2, 5, 5, 2, 3, 1]
```

#### セグメントツリーの構造
```
                     [1, 7] 
                    /       \
              [1, 4]         [5, 7]
             /     \         /     \
         [1, 2]  [3, 4]  [5, 6]   [7]
         /   \    /   \   /   \     \
       [1] [2] [5]  [5] [2]  [3]   [1]
```

- **各ノード**はその範囲の**最大値**を保持します。
- 例: 
  - `[1, 7]` は全体の最大値 **5** を保持。
  - `[1, 4]` は部分範囲の最大値 **5** を保持。
  - `[5, 7]` は部分範囲の最大値 **3** を保持。

---

### **実際のメモリ内の配列のイメージ**

JavaScriptの配列（`tree`）では、この二分木構造を**1次元配列**で表現します。

- **インデックスの関係**:
  - **親ノード**: インデックス `i`
  - **左子ノード**: `2 * i + 1`
  - **右子ノード**: `2 * i + 2`

**例:**
```
tree[0]  = [1, 7] の最大値 (5)
tree[1]  = [1, 4] の最大値 (5)
tree[2]  = [5, 7] の最大値 (3)
tree[3]  = [1, 2] の最大値 (2)
tree[4]  = [3, 4] の最大値 (5)
tree[5]  = [5, 6] の最大値 (3)
tree[6]  = [7] の最大値 (1)
```

---

### **まとめ**

- **`this.tree = new Array(4 * this.n)`** は、元の配列 \(n\) のサイズに基づいて十分なスペースを確保し、セグメントツリーを効率的に構築するための配列を初期化しています。
- **4倍**のサイズを取ることで、2の冪でないサイズの配列でも**安全かつ高速**に動作します。
- **配列のインデックス**で親子関係を管理することで、余分なポインタやリンク構造を使わずに済み、**高速なクエリ**と**更新操作**が可能になります。


`-Infinity` は、JavaScript における特別な数値で、**無限小（負の無限大）**を表します。これは、数値の最小値を初期化する際や、極端に小さい値を表現するために使用されます。

### **`-Infinity` の基本的な挙動**

1. **数値の比較で最小値として機能**:
   - どんな実数よりも小さい値として扱われます。
   ```javascript
   console.log(-Infinity < -1000000); // true
   console.log(-Infinity < 0);        // true
   console.log(-Infinity < Infinity); // true
   ```

2. **最大値を求めるアルゴリズムでの使用**:
   - 例えば、配列内の最大値を探す際に、初期値として `-Infinity` を使うと便利です。
   ```javascript
   const arr = [1, 5, 3, 9, 2];
   let maxVal = -Infinity;
   
   for (let num of arr) {
       if (num > maxVal) {
           maxVal = num;
       }
   }
   
   console.log(maxVal); // 9
   ```

3. **演算での挙動**:
   - 他の数値との演算でも直感的に動作します。
   ```javascript
   console.log(-Infinity + 100);  // -Infinity
   console.log(-Infinity * 2);    // -Infinity
   console.log(1 / -Infinity);    // -0
   ```

4. **ゼロ除算で発生**:
   - **負の数をゼロで割る**と `-Infinity` になります。
   ```javascript
   console.log(-1 / 0); // -Infinity
   ```

---

### **主な使用シーン**

1. **最大値を求める処理**:
   - 例えば、セグメントツリーや他のアルゴリズムで「現在の最大値」を求める際に、初期値として `-Infinity` を使用します。これにより、どんな正の値でも最初の比較で上書きされます。

2. **エッジケースのハンドリング**:
   - 計算がオーバーフローしたり、極端な値を扱う際に `-Infinity` を用いることで、異常な結果を検知できます。

---

### **具体的な例：セグメントツリーでの使用**

```javascript
class SegmentTree {
    constructor(arr) {
        this.n = arr.length;
        this.tree = new Array(4 * this.n).fill(-Infinity); // 初期値として -Infinity を使用
        this.build(arr, 0, 0, this.n - 1);
    }

    build(arr, node, start, end) {
        if (start === end) {
            this.tree[node] = arr[start];  // 葉ノードに値を格納
        } else {
            const mid = Math.floor((start + end) / 2);
            this.build(arr, 2 * node + 1, start, mid);
            this.build(arr, 2 * node + 2, mid + 1, end);
            this.tree[node] = Math.max(this.tree[2 * node + 1], this.tree[2 * node + 2]);
        }
    }

    query(l, r, node = 0, start = 0, end = this.n - 1) {
        if (r < start || l > end) return -Infinity;  // 範囲外なら -Infinity を返す
        if (l <= start && end <= r) return this.tree[node]; // 完全に範囲内ならそのまま返す

        const mid = Math.floor((start + end) / 2);
        const leftMax = this.query(l, r, 2 * node + 1, start, mid);
        const rightMax = this.query(l, r, 2 * node + 2, mid + 1, end);
        return Math.max(leftMax, rightMax);
    }
}

// 使用例
const rooms = [1, 2, 5, 5, 2, 3, 1];
const segmentTree = new SegmentTree(rooms);

console.log(segmentTree.query(0, 6)); // 5 (全範囲の最大値)
console.log(segmentTree.query(0, 2)); // 5 ([1, 2, 5] の最大値)
console.log(segmentTree.query(4, 6)); // 3 ([2, 3, 1] の最大値)
```

---

### **まとめ**

- **`-Infinity`** は、どんな数値よりも小さい特別な値です。
- **最大値探索**や**初期化**に使うと便利です。
- **ゼロ除算**や**数値の範囲外処理**の際にも登場します。
- セグメントツリーなどのデータ構造では、**範囲外のクエリ**結果として `-Infinity` を返すことで、ロジックをシンプルに保つことができます。

セグメントツリーの `build` と `query` の処理は、**配列の区間ごとの情報を効率的に管理・取得**するための重要な部分です。ここでは、これらの処理について詳しく解説します。

---

## **1. `build` メソッドの解説**

### **目的**:
- 元の配列の要素を元に、セグメントツリーを構築する。
- 各ノードに **区間の最大値（または最小値、和など）** を格納する。

---

### **処理の流れ**:

```javascript
build(arr, node, start, end) {
    if (start === end) {
        this.tree[node] = arr[start];  // 葉ノード（配列の要素）をそのまま格納
    } else {
        const mid = Math.floor((start + end) / 2);  // 区間の中間地点を計算
        this.build(arr, 2 * node + 1, start, mid);      // 左の子ノードに対して再帰呼び出し
        this.build(arr, 2 * node + 2, mid + 1, end);    // 右の子ノードに対して再帰呼び出し
        this.tree[node] = Math.max(this.tree[2 * node + 1], this.tree[2 * node + 2]);  // 左右の最大値を親ノードに格納
    }
}
```

---

### **ステップごとの解説**:

1. **`if (start === end)`（葉ノードの処理）**:
   - これは再帰の終了条件です。`start` と `end` が同じなら、区間は1つの要素だけを指します。
   - **処理**: `arr[start]` の値をツリーの `node` に格納します。

2. **`else`（内部ノードの処理）**:
   - `start` と `end` が異なる場合、区間を **2つに分割** します。
   - **中間地点** `mid` を計算し、左右に再帰的に `build` を呼び出します。
     - 左の子ノードは `2 * node + 1`。
     - 右の子ノードは `2 * node + 2`。

3. **`this.tree[node] = Math.max(...)`**:
   - 左右の子ノードから戻ってきた最大値を比較し、親ノードにその最大値を格納します。

---

### **例: 配列 `[1, 2, 5, 5, 2, 3, 1]` の場合**

1. ルートノード（`[1, 7]`）を構築:
   - 左子ノード（`[1, 4]`）と右子ノード（`[5, 7]`）に分割。
   
2. **左子ノード `[1, 4]`**:
   - `[1, 2]` と `[3, 4]` に分割。
   - `[1, 2]` では、`1` と `2` の最大値 `2` を格納。
   - `[3, 4]` では、`5` と `5` の最大値 `5` を格納。
   - `[1, 4]` の最大値は `5`。

3. **右子ノード `[5, 7]`**:
   - `[5, 6]` と `[7]` に分割。
   - `[5, 6]` では、`2` と `3` の最大値 `3` を格納。
   - `[5, 7]` の最大値は `3`。

4. **最終的に `[1, 7]` の最大値は `5`**。

---

## **2. `query` メソッドの解説**

### **目的**:
- **特定の区間 `[l, r]`** に対して、最大値（または和など）を取得する。

---

### **処理の流れ**:

```javascript
query(l, r, node = 0, start = 0, end = this.n - 1) {
    if (r < start || l > end) return -Infinity;  // クエリ範囲と現在のノード範囲が重ならない場合
    if (l <= start && end <= r) return this.tree[node];  // クエリ範囲が完全に現在のノード範囲を含む場合

    const mid = Math.floor((start + end) / 2);
    const leftMax = this.query(l, r, 2 * node + 1, start, mid);  // 左の子ノードを再帰的に探索
    const rightMax = this.query(l, r, 2 * node + 2, mid + 1, end);  // 右の子ノードを再帰的に探索
    return Math.max(leftMax, rightMax);  // 左右の最大値を返す
}
```

---

### **ステップごとの解説**:

1. **`if (r < start || l > end)`（範囲外の場合）**:
   - **完全に重ならない場合**（クエリ範囲がノード範囲の外側にある場合）、`-Infinity` を返します。
   - これは、最大値を求める際に無視できる最小の値です。

2. **`if (l <= start && end <= r)`（完全に範囲内の場合）**:
   - **クエリ範囲がノード範囲を完全に覆っている場合**、そのノードの値を直接返します。
   - 再帰を終了する最適化です。

3. **部分的に範囲が重なる場合**:
   - 中間地点 `mid` を計算し、左右の子ノードに再帰的に `query` を呼び出します。
   - 左右の結果を比較し、最大値を返します。

---

### **例: `query(3, 5)` の場合**

1. **`[1, 7]`**:
   - クエリ範囲 `[3, 5]` は部分的に重なるので、左右の子ノードに分割。

2. **左子ノード `[1, 4]`**:
   - クエリ範囲 `[3, 5]` は部分的に重なるので、さらに分割。
   - **右の子ノード `[3, 4]`** は完全にクエリ範囲内なので `5` を返す。

3. **右子ノード `[5, 7]`**:
   - クエリ範囲 `[3, 5]` は部分的に重なるので、さらに分割。
   - **左の子ノード `[5, 6]`** のうち、`[5]` が範囲内で `2` を返す。

4. **最終的な結果**: `Math.max(5, 2)` = **5**

---

## **まとめ**

- **`build` メソッド**: 元の配列をもとに、各区間の最大値をツリーに構築します。
- **`query` メソッド**: 指定された範囲に対して、再帰的に探索を行い最大値を効率的に取得します。
- セグメントツリーの強みは、**O(log N)** の時間で範囲クエリを処理できる点にあります。

セグメントツリーで **`2 * node + 1`** と **`2 * node + 2`** という式を使う理由は、**ツリー構造を配列で表現するため**です。この方法はヒープ（Heap）構造と似ています。ここでは具体的な例を使って詳しく説明します。

---

## **1. ツリーを配列で表現する理由**

セグメントツリーは、実際には二分木（二つの子を持つ木構造）ですが、**配列**で効率的に管理できます。これにより、ツリーのノード（親・子）へのアクセスが簡単になり、メモリの使用も最適化されます。

---

## **2. ノードのインデックス規則**

1. **親ノードのインデックス**: `node`
2. **左の子ノードのインデックス**: `2 * node + 1`
3. **右の子ノードのインデックス**: `2 * node + 2`

このインデックス計算を使うことで、ノード間の関係を簡単に管理できます。

---

## **3. 具体例: 配列 `[1, 2, 5, 5, 2, 3, 1]`**

### **セグメントツリー構造と配列インデックス**

ツリー構造を配列で表すと以下のようになります。

```
ツリー構造:
                        [1,7] (0)
                     /           \
                [1,4]             [5,7]
               /     \          /       \
            [1,2]   [3,4]    [5,6]       [7]    
配列インデックス: 
Index  0   1   2   4   12
Value [1,7][1,4][5,7][1,2][3,4][5,6][7] [1] [2] [5] [5] [2] [3]
```

---

### **インデックス計算の具体例**

1. **ルートノード (`[1,7]`) は `index 0`**:
   - 左の子ノード: `2 * 0 + 1 = 1` → **`[1,4]`**
   - 右の子ノード: `2 * 0 + 2 = 2` → **`[5,7]`**

2. **ノード `[1,4]` は `index 1`**:
   - 左の子ノード: `2 * 1 + 1 = 3` → **`[1,2]`**
   - 右の子ノード: `2 * 1 + 2 = 4` → **`[3,4]`**

3. **ノード `[5,7]` は `index 2`**:
   - 左の子ノード: `2 * 2 + 1 = 5` → **`[5,6]`**
   - 右の子ノード: `2 * 2 + 2 = 6` → **`[7]`**

4. **ノード `[1,2]` は `index 3`**:
   - 左の子ノード: `2 * 3 + 1 = 7` → **`[1]`**
   - 右の子ノード: `2 * 3 + 2 = 8` → **`[2]`**

---

## **4. 親ノードから子ノードへの関係まとめ**

| **親ノード (`node`)** | **左の子 (`2 * node + 1`)** | **右の子 (`2 * node + 2`)** |
|-----------------------|----------------------------|----------------------------|
| 0 (`[1,7]`)           | 1 (`[1,4]`)                | 2 (`[5,7]`)                |
| 1 (`[1,4]`)           | 3 (`[1,2]`)                | 4 (`[3,4]`)                |
| 2 (`[5,7]`)           | 5 (`[5,6]`)                | 6 (`[7]`)                  |
| 3 (`[1,2]`)           | 7 (`[1]`)                  | 8 (`[2]`)                  |
| 4 (`[3,4]`)           | 9 (`[3]`)                  | 10 (`[4]`)                 |
| 5 (`[5,6]`)           | 11 (`[5]`)                 | 12 (`[6]`)                 |

---

## **5. 逆に、子ノードから親ノードを求める**

**子ノードから親ノード**を求める場合は、次の式を使います。

- **親ノードのインデックス**: `Math.floor((child - 1) / 2)`

### **例:**
1. ノード `1` (`[1,4]`) の親は:
   - `(1 - 1) / 2 = 0` → **親はノード `0` (`[1,7]`)**

2. ノード `3` (`[1,2]`) の親は:
   - `(3 - 1) / 2 = 1` → **親はノード `1` (`[1,4]`)**

---

## **6. まとめ**

- **`2 * node + 1`** → 左の子ノードのインデックス。
- **`2 * node + 2`** → 右の子ノードのインデックス。
- **ツリー構造を配列で表現することで、簡単かつ効率的に親子関係を管理**できます。

この仕組みを使うことで、**再帰的な探索**や**更新処理**を非常に効率よく行うことができます。
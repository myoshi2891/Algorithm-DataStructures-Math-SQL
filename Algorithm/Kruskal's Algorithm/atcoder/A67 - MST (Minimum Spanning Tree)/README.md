**クラスカル法（Kruskal's Algorithm）** は、**最小全域木（MST）** を構成する代表的なアルゴリズムの1つです。
以下に図付きで、クラスカル法の動作を**段階的に**解説します。

---

## 🔧 問題設定

以下のような重み付き無向グラフが与えられているとします。

```
  1       2
(1)---12---(2)
 | \       |
10  1      15
 |    \    |
(3)---4---(5)
 |       /
 3     120
 |   /
(4)---160---(6)
       \
       14
        \
        (7)
```

頂点数 `N = 7`
辺数 `M = 9`

---

## 🧩 クラスカル法の流れ（図付き）

### ✅ ステップ 1：辺を重み順にソート

まず、すべての辺を「**重みの昇順**」に並べ替えます。

| 重み | 辺    |
| ---- | ----- |
| 1    | 3 - 4 |
| 3    | 4 - 5 |
| 4    | 3 - 5 |
| 10   | 1 - 3 |
| 12   | 1 - 2 |
| 14   | 6 - 7 |
| 15   | 2 - 7 |
| 120  | 4 - 6 |
| 160  | 2 - 6 |

---

### ✅ ステップ 2：Union-Find 構造体で MST を構築

最初は各ノードが**独立した集合**です。

#### 📌 辺 `3-4(1)` を追加

→ OK（サイクルなし） → 採用

```
(3)---1---(4)
```

#### 📌 辺 `4-5(3)` を追加

→ OK → 採用

```
(3)---1---(4)---3---(5)
```

#### 📌 辺 `3-5(4)` を見る

→ ❌ すでに同じ連結成分（3-4-5）→ **スキップ**

#### 📌 辺 `1-3(10)` を追加

→ OK → 採用

```
(1)---10---(3)---1---(4)---3---(5)
```

#### 📌 辺 `1-2(12)` を追加

→ OK → 採用

```
(1)---10---(3)---1---(4)---3---(5)
 |
12
 |
(2)
```

#### 📌 辺 `6-7(14)` を追加

→ OK → 採用

```
(6)---14---(7)
```

#### 📌 辺 `2-7(15)` を追加

→ OK → 採用 → これで7ノードに対して6辺 → **MST 完成！**

```
全体図：
(1)---10---(3)---1---(4)---3---(5)
 |
12
 |
(2)       (6)---14---(7)
             \_______15_______/
```

### ✅ 結果

採用した辺の重み合計：

```
1 + 3 + 10 + 12 + 14 + 15 = 55
```

---

## 🧠 クラスカル法の本質

- **貪欲法（Greedy）**：常にコストの小さい辺から採用。
- **サイクル回避**のために **Union-Find（素集合データ構造）** を使って管理。

---

## ✅ クラスカル法の計算量

| 処理項目       | 計算量         |
| -------------- | -------------- |
| 辺のソート     | O(M log M)     |
| Union-Find操作 | O(α(N)) ≈ 定数 |

> → 全体で `O(M log M)` と高速。**辺数が多く、密なグラフにも強い**。

---

## 🔄 他アルゴリズムとの比較

| アルゴリズム     | 特徴                                                                               |
| ---------------- | ---------------------------------------------------------------------------------- |
| **クラスカル法** | 辺を重み順に見ていく。**辺が少ない**時に有利。                                     |
| プリム法         | 頂点を増やしていく。**隣接リスト＋優先度付きキュー**で実装。**密なグラフ**に有利。 |

---

## 🧩 Union-Findとは？

Union-Findは、以下の2つの操作を効率的に行うためのデータ構造です：

1. **`find(x)`**：要素`x`が属する集合の代表（親）を取得
2. **`union(x, y)`**：要素`x`と`y`が属する集合を1つにまとめる

---

## 🎯 利用例：サイクル検出、連結成分管理、最小全域木（Kruskal法）など

---

## 📘 初期状態：各ノードが別集合

例：ノード1〜5があるとします。

```
1   2   3   4   5
```

データ構造（親配列）：

```
parent = [0, 1, 2, 3, 4, 5]
```

（1-indexed で説明します）

各ノードが自分自身を親として持つ ⇒ 各ノードは独立集合。

---

## ✅ `union(x, y)` 操作

### 例1：`union(1, 2)`

```
Before:
1   2

After:
1───2
```

データ構造：

```
parent = [0, 1, 1, 3, 4, 5]
```

→ ノード2の親を1に設定（同じ集合）

---

### 例2：`union(3, 4)`

```
Before:
3   4

After:
3───4
```

```
parent = [0, 1, 1, 3, 3, 5]
```

---

### 例3：`union(2, 3)`

`2`の親は1（`find(2) = 1`）、`3`の親は3

```
1───2     3───4

↓ union(2, 3) ↓

1───2───3───4
```

```
parent = [0, 1, 1, 1, 3, 5]
```

→ `3`の親を`1`に更新（全て1に統合）

---

## 🔍 `find(x)` 操作

### findとは？

ノードが\*\*どの集合（代表）\*\*に属しているかを調べる関数です。

例えば、`find(4)` は `3 → 1` とたどっていき、**1**を返します。

---

## 🧠 経路圧縮（Path Compression）

### 問題点

深い木構造になると `find(x)` の計算が遅くなる

### 解決

`find`の過程で、たどったノードすべての親を**代表に直す**

#### 例：

```
Before find(4):
parent = [0, 1, 1, 1, 3, 5]

find(4)
→ parent[4] = 3 → parent[3] = 1 → root = 1
→ 経路圧縮: parent[4] = 1
```

```
After:
parent = [0, 1, 1, 1, 1, 5]
```

今後 `find(4)` は1回のアクセスで済む！

---

## 🏗️ Union by Rank（ランク付き併合）

### 目的

集合を合併するときに、「小さい木」を「大きい木」にくっつける

### ランクの例

```
rank = [0, 1, 0, 1, 0]
```

- 小さいランクの集合を大きいランクの方に合併
- ランクが同じ場合はどちらかを親にし、ランク+1する

---

## ✅ Union-Find 完全コード（JavaScript）

```javascript
class UnionFind {
    constructor(n) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.rank = new Array(n).fill(0);
    }

    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]); // 経路圧縮
        }
        return this.parent[x];
    }

    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        if (rootX === rootY) return false;

        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
        } else {
            this.parent[rootY] = rootX;
            if (this.rank[rootX] === this.rank[rootY]) {
                this.rank[rootX]++;
            }
        }
        return true;
    }
}
```

---

## ✅ 計算量

| 操作    | 時間                                  |
| ------- | ------------------------------------- |
| `find`  | **O(α(N))** ← 実質定数時間（ほぼO(1)) |
| `union` | 同上                                  |

> `α(N)` はアッカーマン関数の逆関数。100万を超えても 5 以下。

---

## ✍️ まとめ

| 特徴   | 内容                                            |
| ------ | ----------------------------------------------- |
| 処理   | 集合の合併と代表元の検索                        |
| 用途   | MST（クラスカル法）、連結成分、グループ判定など |
| 最適化 | 経路圧縮 + ランクによる併合                     |
| 計算量 | ほぼO(1)                                        |

---

# 🧭 クラスカル法 + Union-Find の図解付き解説

## ✅ 問題再掲（入力例）

```
7 9
1 2 12
1 3 10
2 6 160
2 7 15
3 4 1
3 5 4
4 5 3
4 6 120
6 7 14
```

- 頂点数 N = 7、辺数 M = 9
- **最小全域木（Minimum Spanning Tree, MST）** を作る

---

## 🔶 Step 1：辺の重みで昇順ソート

まず、辺を重み順に並べ替えます：

```
重み | 辺
----|----------
1   | 3 - 4
3   | 4 - 5
4   | 3 - 5
10  | 1 - 3
12  | 1 - 2
14  | 6 - 7
15  | 2 - 7
120 | 4 - 6
160 | 2 - 6
```

---

## 🏗 Step 2：Union-Find 初期化

各頂点を独立した集合として開始：

```
(1) (2) (3) (4) (5) (6) (7)
```

内部的には：

```
parent = [0, 1, 2, 3, 4, 5, 6]
```

---

## ✅ Step 3：辺を小さい順に確認して Union（採用）する

---

### 🔹 辺 3 - 4（重み 1）

```
(3)    (4)
 ↓ union(2, 3)
(3)───(4)
```

→ OK、採用、`totalCost += 1`

---

### 🔹 辺 4 - 5（重み 3）

```
(3)───(4)    (5)
     ↓ union(3, 4)
(3)───(4)───(5)
```

→ OK、採用、`totalCost += 3 → 4`

---

### 🔹 辺 3 - 5（重み 4）

```
(3)───(4)───(5)
 ↑
 ↓ すでに同一集合 → スキップ
```

→ サイクルになるのでスキップ

---

### 🔹 辺 1 - 3（重み 10）

```
(1)    (3)───(4)───(5)
 ↓ union(0, 2)
(1)───(3)───(4)───(5)
```

→ OK、採用、`totalCost += 10 → 14`

---

### 🔹 辺 1 - 2（重み 12）

```
(1)───(3)───(4)───(5)    (2)
 ↓ union(0, 1)
(1)───(2)───(3)───(4)───(5)
```

→ OK、採用、`totalCost += 12 → 26`

---

### 🔹 辺 6 - 7（重み 14）

```
(6)    (7)
 ↓ union(5, 6)
(6)───(7)
```

→ OK、採用、`totalCost += 14 → 40`

---

### 🔹 辺 2 - 7（重み 15）

```
(1)───(2)───(3)───(4)───(5)    (6)───(7)
 ↓ union(1, 6)
全体：
(1)───(2)───(3)───(4)───(5)
          │
         (6)───(7)
```

→ OK、採用、`totalCost += 15 → 55`

---

### 🔹 残りの辺（120, 160）は不要（すでに連結）

→ 辺数が **N-1 = 6** 本になったので終了。

---

## ✅ 結果：最小全域木の重み合計

```
1 + 3 + 10 + 12 + 14 + 15 = 55
```

---

# 🧠 補足：Union-Find の内部変化（例）

例：`union(1, 3)` を実行すると、内部の親配列（`parent[]`）は次のように更新されます。

### Before

```
parent = [0, 1, 2, 3, 4, 5, 6]
```

### After（例：union(0, 2)）

```
parent = [0, 0, 0, 3, 4, 5, 6]
```

→ 0（ノード1）を根とする集合に、ノード3を結合

### 経路圧縮

- `find(4)` を呼び出すときに、途中の親（3など）をまとめて根に張り替えることで高速化

---

# ✅ 全体構造（完成図）

```
(1)───(3)───(4)───(5)
 │
(2)
 │
(6)───(7)
```

---

# ✅ 処理まとめ表

| 処理   | 操作     | 結果                |
| ------ | -------- | ------------------- |
| 辺追加 | 3-4(1)   | 採用                |
| 辺追加 | 4-5(3)   | 採用                |
| 辺追加 | 3-5(4)   | サイクル → スキップ |
| 辺追加 | 1-3(10)  | 採用                |
| 辺追加 | 1-2(12)  | 採用                |
| 辺追加 | 6-7(14)  | 採用                |
| 辺追加 | 2-7(15)  | 採用                |
| 辺追加 | 4-6(120) | スキップ            |
| 辺追加 | 2-6(160) | スキップ            |

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題                                                                                                | ユーザ                                            | 言語                                                                                                        | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果   | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |                                                                       |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2025-06-21 12:43:56                                                                           | [A67 - MST (Minimum Spanning Tree)](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bo) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016)                  | 1000                                                                                    | 1451 Byte                                                                                 | **AC** | 249 ms                                                                                       | 51244 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66910938) |
| 2025-06-21 12:40:54                                                                           | [A67 - MST (Minimum Spanning Tree)](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bo) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002)                   | 1000                                                                                    | 1507 Byte                                                                                 | **AC** | 35 ms                                                                                        | 5788 KiB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66910911) |
| 2025-06-21 12:39:38                                                                           | [A67 - MST (Minimum Spanning Tree)](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bo) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055)          | 1000                                                                                    | 1363 Byte                                                                                 | **AC** | 336 ms                                                                                       | 51208 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66910893) |
| 2025-06-21 12:31:42                                                                           | [A67 - MST (Minimum Spanning Tree)](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bo) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000                                                                                    | 1739 Byte                                                                                 | **AC** | 255 ms                                                                                       | 102952 KiB                                                                                   | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66910799) |
| 2025-06-21 12:20:43                                                                           | [A67 - MST (Minimum Spanning Tree)](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bo) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009)     | 1000                                                                                    | 1530 Byte                                                                                 | **AC** | 286 ms                                                                                       | 102756 KiB                                                                                   | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66910667) |

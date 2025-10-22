**Union-Find（別名：Disjoint Set Union, DSU）** についての仕組み、メリット・デメリットまで詳しく解説。

---

## 🔷 Union-Find（Disjoint Set Union, DSU）とは？

Union-Find は「**要素をいくつかのグループ（集合）に分けて管理**し、それらを **動的に統合したり判定したりする**」ためのデータ構造です。

---

## ✅ 主な操作

| 操作          | 意味                                                               |
| ------------- | ------------------------------------------------------------------ |
| `find(x)`     | 要素 `x` が属する集合の代表（根）を返す                            |
| `union(x, y)` | 要素 `x` を含む集合と `y` を含む集合を1つにまとめる                |
| `same(x, y)`  | `x` と `y` が同じ集合に属しているかを返す（`find(x) === find(y)`） |

---

## 🧠 どういう場面で使うの？

- グラフの **連結成分判定**
- 最小全域木（MST）構築（クラスカル法）
- 動的な集合管理（グループ分け）
- 素集合データ構造として、集合の結合や判定に使う

---

## 🔧 内部構造の基本

Union-Find は **各要素をノードとした「森（複数の木）」** を使って集合を管理します。

- `parent[x]`: ノード `x` の親ノード。根であれば `parent[x] === x`
- 初期状態では各ノードは独立した1要素の集合

### 🌳 構造例：

初期状態（1要素1集合）：

```
1   2   3   4
↑   ↑   ↑   ↑
|   |   |   |
1   2   3   4
```

`union(1, 2)` を行うと：

```
1
↑
2   3   4
    ↑   ↑
    3   4
```

---

## ⚡ 高速化テクニック（非常に重要）

### 1. 経路圧縮（Path Compression）

`find(x)` を呼んだ際に、**親ノードをすべて根に付け替える**ことで、次回以降の `find` を高速化する。

```ts
find(x) {
    if (parent[x] !== x) {
        parent[x] = find(parent[x]); // 再帰で根に付け替える
    }
    return parent[x];
}
```

### 2. ランクによる統合（Union by Rank / Size）

木の高さ（またはサイズ）を比較して、**小さい方を大きい方にぶら下げる**ことで、木が深くなるのを防ぐ。

```ts
union(x, y) {
    let rootX = find(x), rootY = find(y);
    if (rootX === rootY) return;
    if (rank[rootX] < rank[rootY]) parent[rootX] = rootY;
    else {
        parent[rootY] = rootX;
        if (rank[rootX] === rank[rootY]) rank[rootX]++;
    }
}
```

---

## ⏱️ 時間計算量

両方の高速化を適用すると、**各操作はほぼ定数時間**になります。

- 実際の計算量：`O(α(N))`（アッカーマン関数の逆関数、ほぼ5未満）

---

## ✅ メリット

| ✅ 項目                | 内容                                                |
| ---------------------- | --------------------------------------------------- |
| 高速                   | 経路圧縮＋ランク統合により、**ほぼO(1)** で操作可能 |
| 実装が簡単             | 配列ベースで軽量、C++やJS/TSでもすぐに使える        |
| メモリ効率が良い       | 必要なのは `parent` 配列と `rank` のみ              |
| グラフの連結判定に最適 | 動的に辺を追加する場合にも高速に対応                |

---

## ⚠️ デメリット

| ❌ 項目                | 内容                                                                   |
| ---------------------- | ---------------------------------------------------------------------- |
| 削除に非対応           | 集合から要素を削除する操作は基本的にサポートされない                   |
| 部分集合の列挙が難しい | 集合内のすべての要素を取得するのは非効率（明示的に記録する必要がある） |
| 静的な構造             | 再編成や部分構造の抽出には不向き（ツリーとは異なり構造が明示されない） |

---

## 📌 使用例（典型問題）

| 問題例           | 概要                                            |
| ---------------- | ----------------------------------------------- |
| グラフの連結判定 | 「頂点uとvは同じ連結成分か？」を高速に答える    |
| クラスカル法     | 最小全域木を作る際に、ループを避けるために使う  |
| サイクル検出     | 無向グラフでUnionしていき、同じ集合ならサイクル |
| 集合のマージ操作 | 動的な友人関係やネットワーク管理など            |

---

## 🔚 まとめ

| 特徴         | 説明                                      |
| ------------ | ----------------------------------------- |
| データ構造名 | Union-Find（Disjoint Set Union, DSU）     |
| 主な機能     | 集合の合併（union）と代表元検索（find）   |
| 高速化手法   | 経路圧縮＋ランク付き結合                  |
| 用途         | グラフ、集合、クラス分け、最小全域木 など |
| メリット     | 高速、軽量、シンプル                      |
| デメリット   | 削除や部分列挙に不向き                    |

---

## 🔁 クエリ例（入力）を使って解説

まず、以下の簡単な入力を使って各処理の流れを説明します：

```
3 4
1 1 2
2 1 3
1 2 3
2 2 3
```

これは、

1. 頂点 `1` と `2` をつなぐ
2. 頂点 `1` と `3` がつながっているか確認
3. 頂点 `2` と `3` をつなぐ
4. 頂点 `2` と `3` がつながっているか確認

という内容です。

---

## ✅ 1. 初期状態（UnionFind 構築直後）

```ts
const uf = new UnionFind(3);
```

### 📘 構造（parent 配列）：

```
Index:   1   2   3
Parent: [1, 2, 3]  // 各自が自分の親（まだ連結していない）
```

---

## 🔧 クエリ 1: `1 1 2`（Union 1, 2）

### 🧠 `find(1)` = 1, `find(2)` = 2 → 別グループなので union

- ランクは同じなので `2` を `1` にくっつける

```ts
uf.union(1, 2);
```

### 🔗 構造：

```
    1
   /
  2

Parent: [1, 1, 3]
Rank:   [1, 0, 0]  // ランク1に増加（1の木が高くなった）
```

---

## 🔎 クエリ 2: `2 1 3`（同じグループか？）

```ts
uf.same(1, 3); // false
```

### 🎯 判定の流れ：

- `find(1)` = 1
- `find(3)` = 3
  ⇒ 違う根なので「**No**」

```
グループ1: {1,2}, グループ2: {3}
```

---

## 🔧 クエリ 3: `1 2 3`（Union 2, 3）

```ts
uf.union(2, 3);
```

- `find(2)` → 経路圧縮により → `1`
- `find(3)` = 3
  ⇒ 異なる根なので union

### 🔗 構造：

```
    1
   / \
  2   3

Parent: [1, 1, 1]
Rank:   [1, 0, 0]
```

（`3` を `1` にくっつけた）

---

## 🔎 クエリ 4: `2 2 3`（同じグループか？）

```ts
uf.same(2, 3); // true
```

- `find(2)` → 1
- `find(3)` → 1
  ⇒ 同じ根なので「**Yes**」

```
全体が1つの連結成分 {1,2,3}
```

---

## ✅ 全体の経路圧縮イメージ

`find()` 時には、途中のノードの親を直接ルートに変更することで、**木の高さを縮めて高速化**します。

### 経路圧縮前：

```
3 → 2 → 1
```

### 経路圧縮後（`find(3)` を呼んだとき）：

```
3 → 1
2 → 1
```

これにより `find()` の次回以降が **O(1)** に近くなります。

---

## 💡 Union-Findの図まとめ

### 🔧 Union操作

```
uf.union(u, v)
→ if find(u) != find(v)
   → 小さいランクの木を大きい方にぶら下げる
```

### 🔍 Find操作

```
uf.find(x)
→ 再帰的に根を探索しながら、親を直接根に付け替え（経路圧縮）
```

### 🔁 Same操作

```
uf.same(u, v)
→ find(u) === find(v) を比較
```

---

## 🎯 出力まとめ（例）

```
No
Yes
```

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題                                                                                  | ユーザ                                            | 言語                                                                                                        | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果   | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |                                                                       |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2025-06-20 11:22:43                                                                           | [A66 - Connect Query](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bn) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016)                  | 1000                                                                                    | 1353 Byte                                                                                 | **AC** | 72 ms                                                                                        | 26264 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66893368) |
| 2025-06-20 11:19:56                                                                           | [A66 - Connect Query](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bn) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002)                   | 1000                                                                                    | 1512 Byte                                                                                 | **AC** | 29 ms                                                                                        | 9236 KiB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66893334) |
| 2025-06-20 11:18:26                                                                           | [A66 - Connect Query](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bn) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055)          | 1000                                                                                    | 1131 Byte                                                                                 | **AC** | 120 ms                                                                                       | 14512 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66893311) |
| 2025-06-20 11:01:28                                                                           | [A66 - Connect Query](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bn) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000                                                                                    | 1418 Byte                                                                                 | **AC** | 162 ms                                                                                       | 75120 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66893091) |
| 2025-06-20 10:57:07                                                                           | [A66 - Connect Query](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bn) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009)     | 1000                                                                                    | 1043 Byte                                                                                 | **AC** | 195 ms                                                                                       | 75432 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66893029) |

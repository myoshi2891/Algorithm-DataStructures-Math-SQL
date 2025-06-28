
---

## 🔁 問題再掲（要点）

* `N`：交差点数（ノード数）
* `M`：道路数（エッジ数）
* 各道路：`Ai Bi Ci Di`（交差点AとBを双方向で結び、長さC、木があるならD=1）
* 目的：交差点 `1 → N` までの**最短距離の経路**を見つける。ただし、

  * 同距離なら「木が多い道」を選ぶ

---

## 🌲 アルゴリズム概要

> 基本は Dijkstra 法（最短経路探索）をベースに、「辞書順最小化（距離, -木の数）」で優先順位を管理。

---

## 🔁 入力例（図解付き）

入力:

```
3 3
1 2 70 1
2 3 20 1
1 3 90 0
```

グラフ図：

```
(1) --70/🌲--> (2) --20/🌲--> (3)
  \                             ↑
   \--------90/---->------------/
```

この中で `1 → 3` の経路は2通り：

* **1 → 2 → 3**：距離 90、木 2本 🌲🌲
* **1 → 3**：距離 90、木 0本

### ➤ よって、出力は：`90 2`

---

## 💻 JavaScript の処理ごと詳細解説

---

### ① 入力の読み込み・グラフ構築

```js
const input = fs.readFileSync(0, "utf8").trim().split("\n");
const [N, M] = input[0].split(" ").map(Number);
const graph = Array.from({ length: N + 1 }, () => []);
for (let i = 1; i <= M; i++) {
  const [a, b, c, d] = input[i].split(" ").map(Number);
  graph[a].push({ to: b, cost: c, tree: d });
  graph[b].push({ to: a, cost: c, tree: d });
}
```

#### ✅ ポイント

* `graph[i]` に「隣接ノードとその情報（距離・木）」を格納。
* 双方向グラフなので、`graph[a].push(...)` と `graph[b].push(...)` の両方を行う。

---

### ② 最小ヒープ（辞書順での優先度）構築

```js
class MinHeap {
  // ...
  _compare(a, b) {
    if (a[0] !== b[0]) return a[0] - b[0];
    return a[1] - b[1]; // 距離が同じなら、木の数が多い方（= -木が小さい方）
  }
}
```

#### ✅ ヒープに入れる要素の意味：

```js
[cost, -treeCount, node]
```

* `cost`: 累積距離（小さい方がよい）
* `-treeCount`: 木の数が多い方が良いので「負の数」にして最小化
* `node`: 現在いるノード番号

---

### ③ Dijkstra の初期化とループ

```js
const dist = Array(N + 1).fill(Infinity);
const treeCount = Array(N + 1).fill(-Infinity);
dist[1] = 0;
treeCount[1] = 0;

const pq = new MinHeap();
pq.push([0, 0, 1]); // 距離0, 木0, 頂点1からスタート
```

#### ✅ 各配列の意味：

* `dist[i]`：ノード `i` に到達するまでの最短距離
* `treeCount[i]`：その最短経路で通る木の本数

---

### ④ Dijkstra ループ本体

```js
while (!pq.isEmpty()) {
  const [curCost, negTrees, u] = pq.pop();

  if (curCost > dist[u]) continue;
  if (curCost === dist[u] && -negTrees < treeCount[u]) continue;
```

#### ✅ ここでは「すでにより良い経路で到達していればスキップ」

---

### ⑤ 隣接ノードの更新

```js
  for (const { to: v, cost: c, tree: t } of graph[u]) {
    const newCost = curCost + c;
    const newTrees = -negTrees + t;
    if (
      newCost < dist[v] ||
      (newCost === dist[v] && newTrees > treeCount[v])
    ) {
      dist[v] = newCost;
      treeCount[v] = newTrees;
      pq.push([newCost, -newTrees, v]);
    }
  }
}
```

#### ✅ 更新条件の説明：

* 距離が短くなれば更新
* 同じ距離なら「木の数が多ければ」更新

---

## 🔍 ステップ出力（例：上記入力）

| PQ状態                         | 処理中ノード | dist            | treeCount        |
| ---------------------------- | ------ | --------------- | ---------------- |
| \[\[0, 0, 1]]                | 1      | \[∞, 0, ∞, ∞]   | \[-∞, 0, -∞, -∞] |
| \[\[70, -1, 2], \[90, 0, 3]] | 2      | \[∞, 0, 70, ∞]  | \[-∞, 0, 1, -∞]  |
| \[\[90, -2, 3], \[90, 0, 3]] | 3      | \[∞, 0, 70, 90] | \[-∞, 0, 1, 2]   |
| skip (90, 0, 3)              |        |                 | (既に better 経路あり) |

---

## ✅ 最終出力

```js
console.log(`${dist[N]} ${treeCount[N]}`);
```

→ `dist[N]` が最短距離、`treeCount[N]` がそのときの木の本数。

---

## 🎯 最終結論

* Dijkstra において「**2番目の条件を負にして優先度管理**」することで、辞書順最小化が可能。
* 優先度付きキュー（MinHeap）を自前で実装することで、パッケージ不要。
* 小さいデータ（N≤8,000, M≤100,000）なので、ヒープによるDijkstraで十分高速に解ける。

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題 | ユーザ | 言語 | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-06-28 11:28:53 | [A73 - Marathon Route](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bu) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016) | 1000 | 1543 Byte | **AC** | 186 ms | 81236 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67107060) |
| 2025-06-28 11:15:43 | [A73 - Marathon Route](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bu) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055) | 1000 | 1180 Byte | **AC** | 295 ms | 34056 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67106900) |
| 2025-06-28 11:12:06 | [A73 - Marathon Route](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bu) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002) | 1000 | 2167 Byte | **AC** | 36 ms | 14292 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67106865) |
| 2025-06-28 10:58:22 | [A73 - Marathon Route](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bu) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000 | 2963 Byte | **AC** | 362 ms | 113152 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67106737) |
| 2025-06-28 10:43:47 | [A73 - Marathon Route](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bu) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000 | 2787 Byte | **AC** | 348 ms | 112928 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67106611) |
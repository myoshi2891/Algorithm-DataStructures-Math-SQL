---

## 🧩 問題概要（再掲）

* 頂点数：`N`（最大 100,000）
* 辺数：`M`（最大 100,000）
* 各辺：`(Ai, Bi, Ci)`（無向・重み付き）
* 出力：頂点 `1` から各頂点 `k` までの最短距離 `dist[k]`。到達不能なら `-1`。

---

## 🔧 解法：**ダイクストラ法** + **優先度付きキュー（MinHeap）**

---

# 🧱 ステップ1. グラフの構築

```ts
const graph: [number, number][][] = Array.from({ length: N }, () => []);
for (let i = 1; i <= M; i++) {
    const [a, b, c] = input[i].split(' ').map(Number);
    graph[a - 1].push([b - 1, c]);
    graph[b - 1].push([a - 1, c]);
}
```

### 🔍 例

入力：

```
1 2 4
1 3 2
2 4 1
```

構築されるグラフ（0-indexed）：

```
graph[0] = [[1,4], [2,2]]   // 頂点1→ 頂点2へ4, 頂点3へ2
graph[1] = [[0,4], [3,1]]   // 頂点2→ 頂点1へ4, 頂点4へ1
graph[2] = [[0,2]]
graph[3] = [[1,1]]
```

📘 これは「**隣接リスト形式**」で、各ノードの接続先とコストを記録しています。

---

# 🧮 ステップ2. 初期化

```ts
const dist: number[] = Array(N).fill(Infinity);
dist[0] = 0;
```

```
dist = [0, Infinity, Infinity, Infinity]  // 頂点1までの距離は0、それ以外は未確定
```

---

# 🧰 ステップ3. 最小ヒープ構築（MinHeap）

```ts
pq.push([0, 0]); // [距離, 頂点]
```

```
MinHeap:
┌────────────┐
│ [0, 0]     │ ← 頂点0（1番）までの距離0
└────────────┘
```

---

# 🔁 ステップ4. ダイクストラ法のループ

```ts
while (pq.size() > 0) {
    const [currentDist, u] = pq.pop()!;
    ...
}
```

---

## ✅ 例：処理のイメージ図

グラフ：

```
1 --2-- 3
|
4
|
2 --1-- 4
```

### 🟢 ステップ 1：頂点1（index 0）から開始

```
dist = [0, ∞, ∞, ∞]
pq = [ [0, 0] ]
```

- ヒープから `[0, 0]` を取り出す（距離0で頂点0）

- 隣接は：
    - 頂点1 → 頂点2へ距離4 → 更新（0+4=4）
    - 頂点1 → 頂点3へ距離2 → 更新（0+2=2）

```
dist = [0, 4, 2, ∞]
pq = [ [2, 2], [4, 1] ]  ← 小さい順
```

---

### 🟢 ステップ 2：頂点3（index 2）処理

- 取り出し：`[2, 2]`
- 隣接：頂点3→頂点1（もう処理済み）→スキップ

---

### 🟢 ステップ 3：頂点2（index 1）処理

- 取り出し：`[4, 1]`
- 隣接：頂点2→頂点4（コスト1）→ 4+1=5 → `dist[3] = 5`

```
dist = [0, 4, 2, 5]
pq = [ [5, 3] ]
```

---

### 🟢 ステップ 4：頂点4（index 3）処理

- 隣接：頂点4→頂点2（すでに距離小さい）→スキップ

---

# 🎉 終了！

すべての頂点を訪問し、`dist` 配列に最短距離が記録される。

---

# 🧾 ステップ5. 出力

```ts
for (const d of dist) {
    console.log(d === Infinity ? -1 : d);
}
```

例：

```
0
4
2
5
```

---

## 🧠 ダイクストラのコアイメージまとめ

```plaintext
     [start]
       ↓
    pop 最短距離ノード
       ↓
   各隣接ノードの距離を比較
       ↓
  更新されたら push（次の候補）
       ↓
  MinHeapで最小距離から処理！
```

---

## ✅ 図と対応するコードの結び

| 図示処理         | 対応コード                      |
| ---------------- | ------------------------------- |
| グラフの構築     | `graph[a - 1].push([b - 1, c])` |
| ヒープ初期化     | `pq.push([0, 0])`               |
| 最短距離更新     | `if (dist[v] > d + cost)`       |
| 未到達チェック   | `d === Infinity ? -1 : d`       |
| 最短経路探索本体 | `while (pq.size() > 0) { ... }` |

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題                                                                                    | ユーザ                                            | 言語                                                                                                        | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果   | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |                                                                       |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2025-06-18 22:28:55                                                                           | [A64 - Shortest Path 2](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bl) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016)                  | 1000                                                                                    | 2220 Byte                                                                                 | **AC** | 483 ms                                                                                       | 110672 KiB                                                                                   | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66868739) |
| 2025-06-18 15:53:07                                                                           | [A64 - Shortest Path 2](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bl) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002)                   | 1000                                                                                    | 1621 Byte                                                                                 | **AC** | 324 ms                                                                                       | 22880 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66860592) |
| 2025-06-18 15:38:06                                                                           | [A64 - Shortest Path 2](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bl) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055)          | 1000                                                                                    | 708 Byte                                                                                  | **AC** | 525 ms                                                                                       | 51944 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66860343) |
| 2025-06-18 15:22:44                                                                           | [A64 - Shortest Path 2](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bl) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000                                                                                    | 2437 Byte                                                                                 | **AC** | 639 ms                                                                                       | 132688 KiB                                                                                   | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66860095) |
| 2025-06-18 13:10:56                                                                           | [A64 - Shortest Path 2](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bl) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009)     | 1000                                                                                    | 2220 Byte                                                                                 | **AC** | 757 ms                                                                                       | 132988 KiB                                                                                   | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66858333) |

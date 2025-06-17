
---

## 🧠 問題概要（再掲）

* 無向グラフが与えられ、頂点 1 から各頂点までの **最短距離（最小の辺の本数）** を求める。
* 到達できない頂点は `-1`。

---

## ✅ TypeScript 実装コード

```ts
import * as fs from 'fs';

// 入力読み取り
const input = fs.readFileSync(0, 'utf-8').trim().split('\n');
const [N, M] = input[0].split(' ').map(Number);

// グラフ構築（隣接リスト）
const graph: number[][] = Array.from({ length: N + 1 }, () => []);
for (let i = 1; i <= M; i++) {
  const [a, b] = input[i].split(' ').map(Number);
  graph[a].push(b);
  graph[b].push(a); // 無向グラフなので両方向
}

// BFS 初期化
const dist: number[] = Array(N + 1).fill(-1);
dist[1] = 0;

const queue: number[] = [];
let head = 0;
queue.push(1);

// BFS 実行
while (head < queue.length) {
  const current = queue[head++];

  for (const neighbor of graph[current]) {
    if (dist[neighbor] === -1) {
      dist[neighbor] = dist[current] + 1;
      queue.push(neighbor);
    }
  }
}

// 出力
for (let i = 1; i <= N; i++) {
  console.log(dist[i]);
}
```

---

## 🔍 各処理の図解・詳細説明

### 1. 🌱 グラフ構築（隣接リスト）

#### 例: 入力

```
3 2
1 3
2 3
```

#### グラフの構造

```
1 - 3 - 2
```

#### 隣接リストの構造

```
graph = [
  [],       // 0（未使用）
  [3],      // 1の隣 → 3
  [3],      // 2の隣 → 3
  [1, 2]    // 3の隣 → 1, 2
]
```

---

### 2. 🚀 BFSによる最短距離探索

#### 初期状態

| 頂点 | dist | queue |
| -- | ---- | ----- |
| 1  | 0    | \[1]  |
| 2  | -1   |       |
| 3  | -1   |       |

#### ステップ1: 頂点1から探索開始

* `current = 1`
* `neighbor = 3`
* `dist[3] = dist[1] + 1 = 1`
* `queue = [1, 3]`

```
dist: [x, 0, -1, 1]
            1
            ↓
            3
```

---

#### ステップ2: 頂点3から探索

* `current = 3`
* 隣接頂点: 1（すでに訪問済み）、2（未訪問）
* `dist[2] = dist[3] + 1 = 2`
* `queue = [1, 3, 2]`

```
dist: [x, 0, 2, 1]
         ↓     ↘
         1 → 3 → 2
```

---

#### ステップ3: 頂点2（最後の探索）

* `current = 2`
* `neighbor = 3`（すでに訪問済み）→スキップ

---

### 3. 📤 出力結果（最終距離配列）

```
頂点1: 0（自身）
頂点2: 2（1→3→2）
頂点3: 1（1→3）
```

```
出力:
0
2
1
```

---

## ⏱ 計算量とパフォーマンス

| 項目    | 内容                              |
| ----- | ------------------------------- |
| 時間計算量 | **O(N + M)**（各頂点・辺を1回ずつ処理）      |
| 空間計算量 | **O(N + M)**（隣接リストと距離配列）        |
| 改善点   | `shift()` を避けて O(1) キュー操作で高速化済み |

---

## 🎯 補足：なぜ `shift()` を避けたのか？

```ts
queue.shift(); // O(N) → 大量データで遅い
```

代わりにポインタ管理：

```ts
let head = 0;
const current = queue[head++];
```

これにより **全体が O(N + M)** で処理され、TLE を回避できます。

---

## 💬 まとめ

* 幅優先探索（BFS）で「最短距離＝最小の辺数」を正確に求めた。
* `queue.shift()` の TLE 問題はポインタ方式で解消。
* TypeScript + 図解で処理の流れを明快に把握できた。

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題 | ユーザ | 言語 | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-06-17 19:58:06 | [A63 - Shortest Path 1](https://atcoder.jp/contests/tessoku-book/tasks/math_and_algorithm_an) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016) | 1000 | 728 Byte | **AC** | 186 ms | 49784 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66848880) |
| 2025-06-17 19:56:09 | [A63 - Shortest Path 1](https://atcoder.jp/contests/tessoku-book/tasks/math_and_algorithm_an) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002) | 1000 | 1226 Byte | **AC** | 54 ms | 12772 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66848846) |
| 2025-06-17 19:51:22 | [A63 - Shortest Path 1](https://atcoder.jp/contests/tessoku-book/tasks/math_and_algorithm_an) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055) | 1000 | 640 Byte | **AC** | 247 ms | 29732 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66848750) |
| 2025-06-17 19:49:03 | [A63 - Shortest Path 1](https://atcoder.jp/contests/tessoku-book/tasks/math_and_algorithm_an) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000 | 905 Byte | **AC** | 569 ms | 117028 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66848707) |
| 2025-06-17 19:46:23 | [A63 - Shortest Path 1](https://atcoder.jp/contests/tessoku-book/tasks/math_and_algorithm_an) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000 | 793 Byte | **AC** | 261 ms | 120360 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66848660) |

---

## 🧠 問題概要

与えられた無向グラフが「**連結**（すべての頂点がつながっている）」かを判定する。

---

## ✅ TypeScriptコード（Node.js + fs）

```ts
import * as fs from 'fs';

// 入力読み取り
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [N, M] = input[0].split(' ').map(Number);

// グラフ（隣接リスト）作成
const graph: number[][] = Array.from({ length: N + 1 }, () => []);
for (let i = 1; i <= M; i++) {
  const [a, b] = input[i].split(' ').map(Number);
  graph[a].push(b);
  graph[b].push(a); // 無向グラフなので両方向
}

// 訪問記録用
const visited: boolean[] = Array(N + 1).fill(false);

// 深さ優先探索（DFS）
function dfs(node: number): void {
  visited[node] = true;
  for (const neighbor of graph[node]) {
    if (!visited[neighbor]) {
      dfs(neighbor);
    }
  }
}

// 頂点1から探索開始
dfs(1);

// 訪問していないノードがあるか確認
const isConnected = visited.slice(1).every(v => v);

// 出力
console.log(isConnected ? 'The graph is connected.' : 'The graph is not connected.');
```

---

## 📘 解説 & 図解

---

### 1️⃣ グラフの入力と隣接リストの構築

```ts
const graph: number[][] = Array.from({ length: N + 1 }, () => []);
```

* 頂点番号は 1〜N → `N+1`個の配列を作成。
* 各頂点ごとに隣接頂点を記録。

#### 🧱 入力例（N=6, M=6）:

```
1 4
2 3
3 4
5 6
1 2
2 4
```

#### 📊 隣接リスト構築後:

```
graph[1] = [4, 2]
graph[2] = [3, 1, 4]
graph[3] = [2, 4]
graph[4] = [1, 3, 2]
graph[5] = [6]
graph[6] = [5]
```

#### 📌 図解：

```
  1
 / \
2---4
 \ /
  3

5---6
```

---

### 2️⃣ DFS（深さ優先探索）

```ts
function dfs(node: number): void {
  visited[node] = true;
  for (const neighbor of graph[node]) {
    if (!visited[neighbor]) {
      dfs(neighbor);
    }
  }
}
```

* 探索開始ノード：`1`
* 訪問済みとしてマークし、隣接ノードを再帰的に訪問。

#### ⛏ 探索の流れ（例）：

1. dfs(1)

   * → 4 → 3 → 2 → (1, 4は訪問済)
2. `5`, `6` は訪問されない（別の連結成分）

---

### 3️⃣ 訪問済み配列

```ts
const visited: boolean[] = Array(N + 1).fill(false);
```

#### 🧮 最終的な visited（例）:

```
[false, true, true, true, true, false, false]
// index 1〜4: true
// index 5, 6: false → 非連結と判定
```

---

### 4️⃣ 判定と出力

```ts
const isConnected = visited.slice(1).every(v => v);
```

* `visited[1..N]` がすべて `true` → 連結
* 一部でも `false` → 非連結

#### 🔚 出力：

```ts
console.log(isConnected ? 'The graph is connected.' : 'The graph is not connected.');
```

---

## ✅ 最終結果まとめ（例2）

```
入力:
6 6
1 4
2 3
3 4
5 6
1 2
2 4

出力:
The graph is not connected.
```

---

## 🎓 補足

* 時間計算量：`O(N + M)`
* 空間計算量：`O(N + M)`（隣接リスト + 訪問配列）
* 入力サイズ最大（10⁵）でも1秒以内に余裕で完走可能

---
| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題 | ユーザ | 言語 | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-06-16 14:19:54 | [A62 - Depth First Search](https://atcoder.jp/contests/tessoku-book/tasks/math_and_algorithm_am) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016) | 1000 | 791 Byte | **AC** | 107 ms | 65392 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66823574) |
| 2025-06-16 14:16:06 | [A62 - Depth First Search](https://atcoder.jp/contests/tessoku-book/tasks/math_and_algorithm_am) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002) | 1000 | 1123 Byte | **AC** | 51 ms | 23648 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66823505) |
| 2025-06-16 14:12:46 | [A62 - Depth First Search](https://atcoder.jp/contests/tessoku-book/tasks/math_and_algorithm_am) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055) | 1000 | 745 Byte | **AC** | 158 ms | 40404 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66823445) |
| 2025-06-16 13:46:37 | [A62 - Depth First Search](https://atcoder.jp/contests/tessoku-book/tasks/math_and_algorithm_am) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000 | 979 Byte | **AC** | 253 ms | 127604 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66822998) |
| 2025-06-16 13:42:16 | [A62 - Depth First Search](https://atcoder.jp/contests/tessoku-book/tasks/math_and_algorithm_am) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000 | 935 Byte | **AC** | 277 ms | 127672 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66822920) |
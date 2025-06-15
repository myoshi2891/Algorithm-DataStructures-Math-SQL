
---

## 🧠 問題概要（再確認）

* **頂点数** `N`、**辺数** `M` の無向グラフが与えられる。
* 各頂点 `k` に対し、「隣接する頂点の番号の一覧」を出力。
* 出力形式：`k: {a, b, c}`（順序は問わない）

---

## ✅ TypeScript + fs を用いた実装

```ts
import * as fs from 'fs';

// 標準入力からデータを読み取る
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');

// 最初の行から N と M を取得
const [N, M] = input[0].split(' ').map(Number);

// 隣接リスト：各頂点に対して接続されている頂点の配列
const graph: number[][] = Array.from({ length: N + 1 }, () => []);

// 入力された M 本の辺を処理
for (let i = 1; i <= M; i++) {
  const [a, b] = input[i].split(' ').map(Number);
  graph[a].push(b);
  graph[b].push(a); // 無向グラフなので両方に追加
}

// 各頂点について、隣接頂点を出力
for (let i = 1; i <= N; i++) {
  console.log(`${i}: {${graph[i].join(', ')}}`);
}
```

---

## 📘 処理の詳細な説明と図解

---

### 🔸 ステップ 1：入力の読み取り

```ts
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const [N, M] = input[0].split(' ').map(Number);
```

#### 📊 イメージ（入力例）:

```
5 4
1 2
2 3
3 4
3 5
```

| 行番号 | 内容    | 意味                |
| --- | ----- | ----------------- |
| 0   | `5 4` | 頂点数 N=5, 辺数 M=4   |
| 1〜4 | `a b` | 頂点 a と b の間に無向辺あり |

---

### 🔸 ステップ 2：隣接リストの初期化

```ts
const graph: number[][] = Array.from({ length: N + 1 }, () => []);
```

* `graph[1]` ～ `graph[N]` に各頂点の隣接頂点を格納。
* `graph[0]` は未使用（1-based index を採用）

#### 🧩 イメージ（初期状態）:

```
graph = [
  [],     // 0 (未使用)
  [],     // 1
  [],     // 2
  [],     // 3
  [],     // 4
  []      // 5
]
```

---

### 🔸 ステップ 3：辺を読み取り、隣接リストに追加

```ts
for (let i = 1; i <= M; i++) {
  const [a, b] = input[i].split(' ').map(Number);
  graph[a].push(b);
  graph[b].push(a);
}
```

#### 🧩 イメージ（辺の追加）：

入力:

```
1 2
2 3
3 4
3 5
```

更新後の `graph`：

```
graph = [
  [],         // 0
  [2],        // 1
  [1, 3],     // 2
  [2, 4, 5],  // 3
  [3],        // 4
  [3]         // 5
]
```

---

### 🔸 ステップ 4：出力整形

```ts
for (let i = 1; i <= N; i++) {
  console.log(`${i}: {${graph[i].join(', ')}}`);
}
```

#### 🧾 出力形式：

各頂点について：

* 頂点 `i` に隣接するノード `x, y, z` を `{x, y, z}` の形で出力。

例：

```
1: {2}
2: {1, 3}
3: {2, 4, 5}
4: {3}
5: {3}
```

---

## 🧠 補足：なぜ `graph[0]` を使わない？

* 頂点番号が 1 から始まるため、配列の 0 番目は使わず、1-based index に揃えると混乱しない。
* `graph[1]` が頂点 1 の隣接リストとなる。

---

## 🔧 実行方法（VSCodeやターミナルで）

### ファイル構成

```
main.ts
input.txt
```

### コンパイル & 実行

```bash
tsc main.ts
node main.js < input.txt
```

---

## ✅ メモリ最適化ポイント（TypeScriptでも）

* `graph` 配列を `number[][]` と明示的に型定義 → 高速化に有利
* `Set<number>` を使わない（重複辺なしの制約のため）
* 1-based index でアクセス回数を減らし、`if` 文不要に

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題 | ユーザ | 言語 | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-06-15 13:40:26 | [A61 - Adjacent Vertices](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bi) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016) | 1000 | 538 Byte | **AC** | 171 ms | 41440 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66797367) |
| 2025-06-15 13:37:40 | [A61 - Adjacent Vertices](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bi) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002) | 1000 | 1057 Byte | **AC** | 177 ms | 14840 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66797328) |
| 2025-06-15 13:35:29 | [A61 - Adjacent Vertices](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bi) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055) | 1000 | 414 Byte | **AC** | 247 ms | 25112 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66797298) |
| 2025-06-15 13:33:12 | [A61 - Adjacent Vertices](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bi) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000 | 742 Byte | **AC** | 530 ms | 111172 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66797267) |
| 2025-06-15 13:26:20 | [A61 - Adjacent Vertices](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bi) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000 | 623 Byte | **AC** | 581 ms | 101592 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66797157) |
| 2025-06-15 13:24:36 | [A61 - Adjacent Vertices](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bi) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000 | 564 Byte | **AC** | 580 ms | 110924 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66797125) |
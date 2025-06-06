
---

## 📦 使っているキューの構造

```js
class FastQueue {
  constructor() {
    this.queue = []; // 配列でキューを保持
    this.head = 0;   // 先頭を指すインデックス（shiftの代わり）
  }
}
```

* `queue`: キュー全体を保持する配列。
* `head`: 実際に先頭を表す位置（=「論理的な先頭」）。

この構造によって、`shift()` の O(N) 操作を避け、**すべての操作を O(1)** に保ちます。

---

## 🧪 操作例：以下の 5 クエリを順に処理する様子を図解します

```
1 taro     ← 末尾に taro を追加（enqueue）
1 hanako   ← 末尾に hanako を追加
2          ← 先頭を出力（front）
3          ← 先頭を削除（dequeue）
2          ← 先頭を出力（front）
```

---

### 🔷 クエリ1: `1 taro` → `enqueue("taro")`

```txt
queue: [ "taro" ]
head:    0
```

* 配列の末尾に `"taro"` を追加。
* `head = 0` → 先頭は `"taro"`。

---

### 🔷 クエリ2: `1 hanako` → `enqueue("hanako")`

```txt
queue: [ "taro", "hanako" ]
head:    0
```

* `"hanako"` を末尾に追加。
* `head` は変わらない → 先頭はまだ `"taro"`。

---

### 🔷 クエリ3: `2` → `front()`

```txt
出力: "taro"

queue: [ "taro", "hanako" ]
head:    0
```

* `queue[head] = queue[0] = "taro"` → 出力！

---

### 🔷 クエリ4: `3` → `dequeue()`

```txt
queue: [ "taro", "hanako" ]
head:         1
```

* `head++` により `head = 1`。
* `"taro"` を実際に削除しないが、**無視するように扱う**。

⚠️ `shift()` で削除しない理由：

* 配列から要素を削除すると、残りの要素が前にずれて O(N) になるから。

---

### 🔷 クエリ5: `2` → `front()`

```txt
出力: "hanako"

queue: [ "taro", "hanako" ]
head:          1
```

* `queue[head] = queue[1] = "hanako"` → 出力！

---

## 🧾 最終出力

```
taro
hanako
```

---

## ✅ メモリとパフォーマンスの補足

* 配列 `queue` のサイズは増えるだけ（先頭を物理的に削除しない）ので、**一定以上進んだら古い部分を切り捨てる最適化**も可能（例：10000件ごとに `queue.splice()` でクリア）。
* ただし、問題の制約内（Q ≤ 100000）では、その必要は基本ありません。

---

## 📌 まとめ

| 操作 | 方法           | 時間計算量 | 説明                |
| -- | ------------ | ----- | ----------------- |
| 追加 | `enqueue(x)` | O(1)  | 配列末尾に追加           |
| 参照 | `front()`    | O(1)  | `queue[head]` を返す |
| 削除 | `dequeue()`  | O(1)  | `head++` で先頭をスキップ |

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題 | ユーザ | 言語 | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-06-06 10:19:00 | [A52 - Queue](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_az) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016) | 1000 | 513 Byte | **AC** | 33 ms | 25844 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66474916) |
| 2025-06-06 10:17:40 | [A52 - Queue](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_az) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002) | 1000 | 919 Byte | **AC** | 22 ms | 8888 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66474903) |
| 2025-06-06 10:16:24 | [A52 - Queue](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_az) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055) | 1000 | 459 Byte | **AC** | 40 ms | 16036 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66474894) |
| 2025-06-06 10:13:10 | [A52 - Queue](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_az) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000 | 887 Byte | **AC** | 99 ms | 66224 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66474852) |
| 2025-06-06 10:08:15 | [A52 - Queue](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_az) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000 | 838 Byte | **AC** | 121 ms | 66036 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66474792) |
| 2025-06-06 10:07:38 | [A52 - Queue](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_az) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000 | 837 Byte | **AC** | 155 ms | 72632 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66474790) |
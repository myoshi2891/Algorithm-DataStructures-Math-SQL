
---

### ポイント整理

* 左上 `(0, 0)` から右下 `(N-1, N-1)` への最短距離は常に `2*(N-1)`（右に N-1、下に N-1 移動）です。
* 最短距離より少ない回数では絶対に到達不可。
* それ以上の回数なら、遠回りして「余分に」移動できる。
* その余分な移動は「往復」などで増やせるが、上下左右移動は 1 回で 1 歩しか進まないため、**余分な歩数が偶数**でなければ戻ってこれない。

---

### 解法の条件

* `K >= 2 * (N - 1)`
* `(K - 2 * (N - 1)) % 2 === 0`

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題 | ユーザ | 言語 | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-05-22 12:24:26 | [A36 - Travel](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_aj) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Java (OpenJDK 17)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5005) | 1000 | 477 Byte | **AC** | 72 ms | 37740 KB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66032432) |
| 2025-05-22 12:22:57 | [A36 - Travel](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_aj) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055) | 1000 | 231 Byte | **AC** | 10 ms | 8700 KB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66032411) |
| 2025-05-22 12:21:28 | [A36 - Travel](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_aj) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002) | 1000 | 369 Byte | **AC** | 1 ms | 1716 KB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66032388) |
| 2025-05-22 12:20:15 | [A36 - Travel](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_aj) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016) | 1000 | 308 Byte | **AC** | 16 ms | 21412 KB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66032369) |
| 2025-05-22 12:12:42 | [A36 - Travel](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_aj) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000 | 350 Byte | **AC** | 43 ms | 42904 KB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66032252) |
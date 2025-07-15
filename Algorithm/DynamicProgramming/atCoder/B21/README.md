以下では、TypeScriptで実装した **「最長回文部分列 (Longest Palindromic Subsequence, LPS)」** において、各処理が何をしているのかを **図解・解析付きで詳細に解説** します。

---

## 🧩 問題の本質

「文字列からいくつかの文字を取り除いてできる最長の**回文部分列**の長さ」を求める問題です。

---

## 🔧 使用アルゴリズム：**動的計画法 (DP)**

以下のような2次元DP配列 `dp[i][j]` を使って、**S\[i..j] の範囲で作れる最長回文部分列の長さ**を記録します。

---

## 📘 入力例と構造の確認

### 入力：

```
S = "programming"
         ↑
      N = 11
```

---

## 🧮 初期化：1文字は必ず回文

```ts
for (let i = 0; i < N; i++) {
    dp[i][i] = 1;
}
```

### ✅ 図解（初期状態）

```text
dp = 11x11 の配列（全て 0 で初期化）

   p r o g r a m m i n g
p  1 . . . . . . . . . .
r  . 1 . . . . . . . . .
o  . . 1 . . . . . . . .
g  . . . 1 . . . . . . .
r  . . . . 1 . . . . . .
a  . . . . . 1 . . . . .
m  . . . . . . 1 . . . .
m  . . . . . . . 1 . . .
i  . . . . . . . . 1 . .
n  . . . . . . . . . 1 .
g  . . . . . . . . . . 1
```

---

## 🔁 遷移式の構築（長さ2以上の部分列）

```ts
for (let len = 2; len <= N; len++) {
  for (let i = 0; i <= N - len; i++) {
    const j = i + len - 1;
    if (S[i] === S[j]) {
      dp[i][j] = dp[i + 1][j - 1] + 2;
    } else {
      dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
    }
  }
}
```

---

### ✅ 図解：`dp[i][j]`の意味と更新方針

#### S = "gmmg" の例で考える（インデックス付き）

```text
S = g m m g
     0 1 2 3
```

* `dp[0][3]`: S\[0] = 'g', S\[3] = 'g' → 端が一致！
* 中央部 dp\[1]\[2] は 'mm' → 回文なので長さ2
* よって dp\[0]\[3] = dp\[1]\[2] + 2 = 4

```text
dp 配列の一部更新

   g m m g
g  1 . . 4
m  . 1 2 .
m  . . 1 .
g  . . . 1
```

---

### ✅ `S[i] === S[j]` の場合：

```ts
dp[i][j] = dp[i+1][j-1] + 2
```

→ 両端が同じなら、内側を包むように回文が延長される。

---

### ✅ `S[i] !== S[j]` の場合：

```ts
dp[i][j] = Math.max(dp[i+1][j], dp[i][j-1])
```

→ 片方を捨てて最長回文を保つ選択を行う。

---

## ✅ 全体図（"programming" の dp テーブル概略）

下記は完成したdpテーブルの一部（概略）です。

```text
   0 1 2 3 4 5 6 7 8 9 10
 p r o g r a m m i n  g
[1 . . . . . . . . . . ]
[. 1 . . . . . . . . . ]
[. . 1 . . . . . . . . ]
[. . . 1 . . . . . . . ]
[. . . . 1 . . . . . . ]
[. . . . . 1 . . . . . ]
[. . . . . . 1 . . . . ]
[. . . . . . . 1 . . . ]
[. . . . . . . . 1 . . ]
[. . . . . . . . . 1 . ]
[. . . . . . . . . . 1 ]
```

この中で、`dp[0][10]`（=全体での最長回文長）が最終答になります。

例：`programming` → `gmmg` を残すことで「長さ4」の回文が作れる

---

## ✅ 処理のまとめ表

| ステップ    | 内容                     | 計算量    |
| ------- | ---------------------- | ------ |
| 入力      | 標準入力から読み取り (`fs`)      | O(N)   |
| 配列初期化   | `dp[i][i] = 1`（1文字は回文） | O(N)   |
| DP更新ループ | `dp[i][j]` の2重ループ      | O(N^2) |
| 出力      | `dp[0][N-1]` を出力       | O(1)   |

---

## 📈 時間・空間計算量

* **時間計算量**：`O(N^2)`（最大 1,000×1,000 = 10^6）
* **空間計算量**：`O(N^2)`（約4MB）

---

## ✅ 最後に

この手法は、\*\*文字の並び替えができない場合の「削除のみ許される回文問題」\*\*で有効な典型解法です。

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題 | ユーザ | 言語 | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-07-15 21:54:11 | [B21 - Longest Subpalindrome](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ct) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002) | 1000 | 1412 Byte |  | 7 ms | 8188 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67625944) |
| 2025-07-15 21:45:46 | [B21 - Longest Subpalindrome](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ct) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016) | 1000 | 1336 Byte |  | 47 ms | 37492 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67625790) |
| 2025-07-15 21:43:46 | [B21 - Longest Subpalindrome](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ct) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055) | 1000 | 1417 Byte |  | 140 ms | 25636 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67625751) |
| 2025-07-15 21:36:41 | [B21 - Longest Subpalindrome](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ct) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000 | 1302 Byte |  | 62 ms | 61304 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67625616) |
| 2025-07-15 21:32:44 | [B21 - Longest Subpalindrome](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ct) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000 | 1080 Byte |  | 77 ms | 60920 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67625528) |
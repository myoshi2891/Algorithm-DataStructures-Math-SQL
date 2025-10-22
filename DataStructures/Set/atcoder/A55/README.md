---

## 🔁 前提：cards は常に「ソート済み配列」

```ts
const cards: number[] = [];
```

この `cards` 配列は、カードを昇順で管理します（例: `[20, 40, 77, 90]`）。
各クエリではこの配列に対して、**挿入 / 削除 / 検索**を行います。

---

## 📌 クエリの種類と処理

---

### ✅ クエリ1：`1 x` - カード x を追加

#### 🔧 処理内容：

- `cards` に `x` を **昇順を保ったまま挿入**
- `lowerBound(cards, x)` で挿入位置を探す
- `splice` を使ってその位置に挿入

#### 🧠 使用関数：

```ts
function lowerBound(arr, x): number;
```

これは「**x以上の最初の位置**」を探す二分探索です。

---

#### 🎯 例：

```
cards = [20, 40, 77]
クエリ: 1 50
```

#### 🔍 lowerBound の探索の様子：

```
x = 50
cards = [20, 40, 77]
          ↑   ↑   ↑
         0   1   2

20 < 50 → OK
40 < 50 → OK
77 >= 50 → ここに挿入
=> 挿入位置 = 2
```

#### ✍️ 挿入後：

```
cards = [20, 40, 50, 77]
```

---

### ✅ クエリ2：`2 x` - カード x を削除

#### 🔧 処理内容：

- `cards` から `x` を削除
- `lowerBound(cards, x)` で `x` のインデックスを探す
- `cards[idx] === x` で確認して `splice` で削除

---

#### 🎯 例：

```
cards = [20, 40, 50, 77]
クエリ: 2 40
```

#### 🔍 lowerBound の探索の様子：

```
x = 40
cards = [20, 40, 50, 77]
          ↑   ↑   ↑   ↑
         0   1   2   3

20 < 40 → OK
40 >= 40 → 見つかった
=> 削除位置 = 1
```

#### ✂️ 削除後：

```
cards = [20, 50, 77]
```

---

### ✅ クエリ3：`3 x` - x 以上の最小カードを探す

#### 🔧 処理内容：

- `lowerBound(cards, x)` で `x` 以上の最小値を探す
- `cards[idx]` が存在すれば出力、なければ `-1`

---

#### 🎯 例1：

```
cards = [20, 50, 77]
クエリ: 3 40
```

#### 🔍 探索：

```
x = 40
cards = [20, 50, 77]
          ↑   ↑   ↑
         0   1   2

20 < 40 → OK
50 >= 40 → 結果: 50
```

➡️ **出力：`50`**

---

#### 🎯 例2（存在しない場合）：

```
cards = [20, 50, 77]
クエリ: 3 80
```

#### 🔍 探索：

```
x = 80
全て < 80 → lowerBound returns 3（末尾）
=> cards[3] は存在しない
```

➡️ **出力：`-1`**

---

## 🧩 lowerBound 関数の図解

```ts
function lowerBound(arr, x): number;
```

これは、**`x` 以上の値が初めて現れる位置を返す**関数です。
二分探索を使って、`O(log N)` で位置を特定します。

---

### lowerBound の図解：

#### 配列：

```
arr = [10, 20, 30, 40, 50]
```

| x   | 戻り値 | 意味                                    |
| --- | ------ | --------------------------------------- |
| 5   | 0      | 全部 ≥ 5                                |
| 25  | 2      | 最初に ≥25 の位置は 30（インデックス2） |
| 40  | 3      | 40ちょうどが見つかる                    |
| 60  | 5      | 全部 < 60 → arr\[5] は存在しない        |

---

## 🧮 全体の流れ

```
入力読み込み
↓
クエリ数 Q の取得
↓
クエリを1つずつ処理（クエリ1,2はcards更新 / クエリ3は結果をresultに追加）
↓
最後に result を一括出力
```

---

## ✅ 結果出力：

```ts
console.log(result.join('\n'));
```

---

## 📘 まとめ

| クエリ | 処理               | 時間計算量                      |
| ------ | ------------------ | ------------------------------- |
| 1 x    | x を挿入           | O(N)（splice）、検索は O(log N) |
| 2 x    | x を削除           | O(N)（splice）、検索は O(log N) |
| 3 x    | x 以上の最小値探索 | O(log N)                        |

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題                                                                        | ユーザ                                            | 言語                                                                                                        | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果   | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |                                                                       |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2025-06-09 12:32:02                                                                           | [A55 - Set](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bc) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002)                   | 1000                                                                                    | 1352 Byte                                                                                 | **AC** | 333 ms                                                                                       | 7464 KiB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66617280) |
| 2025-06-09 12:24:48                                                                           | [A55 - Set](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bc) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055)          | 1000                                                                                    | 3597 Byte                                                                                 | **AC** | 1007 ms                                                                                      | 30220 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66617167) |
| 2025-06-09 12:23:19                                                                           | [A55 - Set](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bc) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055)          | 1000                                                                                    | 729 Byte                                                                                  | **AC** | 539 ms                                                                                       | 19620 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66617149) |
| 2025-06-09 12:11:32                                                                           | [A55 - Set](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bc) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000                                                                                    | 3656 Byte                                                                                 | **AC** | 193 ms                                                                                       | 76040 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66617007) |
| 2025-06-09 12:02:17                                                                           | [A55 - Set](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bc) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000                                                                                    | 1134 Byte                                                                                 | **AC** | 718 ms                                                                                       | 65004 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66616869) |
| 2025-06-09 11:57:46                                                                           | [A55 - Set](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bc) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009)     | 1000                                                                                    | 1322 Byte                                                                                 | **AC** | 1017 ms                                                                                      | 71760 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66616799) |

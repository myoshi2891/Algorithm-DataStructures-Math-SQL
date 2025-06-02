配列のサイズが最大 `N = 200000` という条件下で、メモリ使用量を**極力抑える**には、次のような戦略を取るのが有効です。

---

## ✅ メモリ削減のための戦略

### 1. **初期状態を仮定し、配列そのものを保持しない**

問題文では、`A[i] = i + 1` で初期化されていますが、全体を配列として保持する必要はありません。
**変更があった場所だけを記録**することで、無駄なメモリを使わずに済みます。

---

### 2. **差分のみ記録する：`Map`を使う**

変更された要素のみを `Map` で保持します。アクセス時は：

* 変更が記録されていればその値を使う
* 記録されていなければ初期値 `i + 1` を返す

---

### 3. **反転はフラグで管理**

実際に反転させるのではなく、`reversed` フラグを使ってインデックス変換で対応。

---
## ✅ メモリ効率の比較

| アプローチ         | メモリ使用量                  |
| ------------- | ----------------------- |
| 通常の配列（O(N)）   | 約 200,000 \* 4B ≒ 800KB |
| 差分Mapのみ（O(K)） | K件変更のみ記録、非常に軽い          |

---

## ✅ 注意点

* `Map` はハッシュ構造なので、要素数が少ないうちは非常に軽量。
* `変更件数` ≪ `N` であることが多いため、圧倒的に省メモリです。

---

前提として、初期の配列 `A = [1, 2, 3, 4, 5]`、つまり `A[i] = i + 1` で構成されており、**実際の配列を保持せず**、変更された要素だけ `Map` に記録します。

---

## 📌 状態を表す記号

* `N = 5`
* `reversed = false` または `true`
* `Map = {}` は変更を記録する差分マップ

---

## 🔁 操作1：更新 `1 x y`

### 入力例

```
1 4 8
```

### 処理の流れ（`reversed = false`）

```text
インデックスのずれに注意：
      入力では 1-indexed（1〜5）
      内部処理は 0-indexed（0〜4）

入力: 1 4 8 ⇒ x = 3, y = 8
配列が反転されていないのでそのまま変更：
  ⇒ Map[3] = 8
```

### 状態図

```
Index:       0   1   2   3   4
初期A:       1   2   3   4   5
Map:                 { 3: 8 }
reversed:    false
```

---

## 🔁 操作2：反転 `2`

### 入力例

```
2
```

### 処理の流れ

```text
反転フラグを反転するだけ。
reversed = !reversed ⇒ reversed = true
```

### 状態図

```
Index:       0   1   2   3   4
初期A:       1   2   3   4   5
Map:                 { 3: 8 }
reversed:    true（表示上は逆順として扱う）
```

---

## 🔍 操作3：取得 `3 x`

### 入力例

```
3 2
```

### 処理の流れ（`reversed = true`）

```text
x = 1（0-indexed）
反転中なので、実際に参照すべき位置は：
  x' = N - 1 - x = 4 - 1 = 3

Map に 3 があるので、Map[3] = 8 を返す
```

### 出力:

```
8
```

---

## ✅ 全体の視覚まとめ

### 配列の仮想構造（実配列は存在しない）

```
論理配列（見かけ上）:
  reversed = false: [1, 2, 3, 8, 5]
  reversed = true : [5, 8, 3, 2, 1]  ← 現在この状態
                         ↑
                      取得位置 x = 2（1-indexed）

内部構造:
  Map: { 3: 8 }  ← 実配列を持たず、変更だけ記録
```

---

## ✨ ポイント

| 操作      | 時間   | メモリ | 内容                     |
| ------- | ---- | --- | ---------------------- |
| `1 x y` | O(1) | 少   | `Map` に変更だけ記録          |
| `2`     | O(1) | 0   | `reversed` フラグをトグルするだけ |
| `3 x`   | O(1) | 少   | 実際のインデックスに変換して値取得      |

---

検索

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題 | ユーザ | 言語 | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-06-01 16:12:29 | [A44 - Change and Reverse](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ar) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Java (OpenJDK 17)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5005) | 1000 | 1481 Byte | **AC** | 251 ms | 59356 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66378486) |
| 2025-06-01 16:11:26 | [A44 - Change and Reverse](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ar) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002) | 1000 | 1119 Byte | **AC** | 45 ms | 14144 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66378453) |
| 2025-06-01 16:10:17 | [A44 - Change and Reverse](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ar) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016) | 1000 | 894 Byte | **AC** | 67 ms | 27148 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66378425) |
| 2025-06-01 16:08:45 | [A44 - Change and Reverse](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ar) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055) | 1000 | 917 Byte | **AC** | 105 ms | 37140 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66378392) |
| 2025-06-01 16:01:23 | [A44 - Change and Reverse](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ar) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000 | 837 Byte | **AC** | 189 ms | 81852 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66378214) |
| 2025-06-01 15:59:19 | [A44 - Change and Reverse](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ar) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000 | 843 Byte | **AC** | 193 ms | 77992 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66378165) |
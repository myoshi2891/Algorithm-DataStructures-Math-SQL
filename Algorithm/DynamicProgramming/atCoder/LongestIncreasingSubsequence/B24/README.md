TypeScript 実装の各処理について、**図解とともに詳細な解析**を行います。
問題は「2次元の箱ネスト問題」ですが、これは\*\*2次元 LIS（最長増加部分列）\*\*に帰着できます。

---

## 🧩 問題再掲

箱 A が箱 B に入るには：

```
A.X < B.X かつ A.Y < B.Y
```

回転不可。
つまり、「縦・横ともに小さい箱は、縦・横ともに大きい箱の中に入れられる」。

---

## 🧠 アルゴリズムの概要

1. `X` 昇順、`Y` 降順にソート
2. `Y` の LIS（最長増加部分列）を求める（Y方向に何個ネストできるか）

---

# 🔢 入力例

```
5
30 50
10 30
40 10
50 20
40 60
```

各箱を `(X, Y)` と表記します：

```
[30, 50], [10, 30], [40, 10], [50, 20], [40, 60]
```

---

# 🔧 ステップ①：ソート処理

### 条件：

* `X` 昇順
* 同じ `X` のときは `Y` 降順

```ts
boxes.sort((a, b) => {
  if (a[0] === b[0]) return b[1] - a[1]; // Y降順
  return a[0] - b[0]; // X昇順
});
```

### 📊 ソート結果：

```
[10, 30]
[30, 50]
[40, 60]  ← Y降順なので先
[40, 10]
[50, 20]
```

### 📌 なぜ Y を降順にする？

* 同じ X の中で Y が小さい方を後に回すことで、「X が同じ場合に複数の箱がネストされる誤り」を防ぐため。

---

# 🧮 ステップ②：Y の LIS を求める

### LISとは？

* 与えられた数列から「単調増加の部分列」で最大の長さを求める。
* LISにより「最大ネスト数」が求まる。

---

## 🎯 対象の Y の配列：

```
[30, 50, 60, 10, 20]
```

LIS を構築する様子を図解します。

### 初期状態：

```
lis = []
```

---

## ▶️ Y = 30：

* lis は空 → `30` を push

```
lis = [30]
```

---

## ▶️ Y = 50：

* `50 > 30` → push

```
lis = [30, 50]
```

---

## ▶️ Y = 60：

* `60 > 50` → push

```
lis = [30, 50, 60]
```

---

## ▶️ Y = 10：

* `10 < 30` → 二分探索で差し替え（最初の位置）

```
lis = [10, 50, 60]
```

---

## ▶️ Y = 20：

* `20 > 10 && < 50` → 2番目に差し替え

```
lis = [10, 20, 60]
```

---

## ✅ 最終 LIS = \[10, 20, 60]

* 長さは `3` → 最大ネスト数 = **3**

---

# 🧠 二分探索の詳細図

例えば `Y = 20` のとき、`lis = [10, 50, 60]` に対して：

```
binarySearch(lis, 20)
↓
mid = 1 → lis[1] = 50 > 20 → right = 1
mid = 0 → lis[0] = 10 < 20 → left = 1
→ 差し替え位置 = 1
```

---

# 💡 なぜこの方法で正しいのか？

* LIS により、常に「Y が昇順」なネストを構築する
* Xはソート済なので、Xの条件は保証されている
* Yは単調増加でなければならない → 最長長さを求めることでネスト数を最適化

---

## 🧾 最終出力

```ts
console.log(result); // → 3
```

---

# ✅ 最終まとめ（図で確認）

```
ソート後の箱:
(10,30) → (30,50) → (40,60) → (40,10) → (50,20)

対象Y:    30     →   50     →   60     →   10     →   20
LIS処理: [30]   → [30,50] → [30,50,60] → [10,50,60] → [10,20,60]
最長長さ: 3
```

---

# 📘 結論

* 箱ネスト問題は「2次元 LIS」として解ける
* ソート + 二分探索で `O(N log N)` を達成可能
* メモリ制約内（最大 `N = 100000`）でも高速・安全に動作

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題 | ユーザ | 言語 | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-07-17 17:16:02 | [B24 - Many Boxes](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cw) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002) | 1000 | 1829 Byte |  | 42 ms | 6920 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67661614) |
| 2025-07-17 17:13:24 | [B24 - Many Boxes](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cw) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016) | 1000 | 1823 Byte |  | 199 ms | 56844 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67661547) |
| 2025-07-17 17:11:31 | [B24 - Many Boxes](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cw) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055) | 1000 | 1239 Byte |  | 188 ms | 41944 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67661509) |
| 2025-07-17 17:02:58 | [B24 - Many Boxes](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cw) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000 | 1429 Byte |  | 214 ms | 81208 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67661269) |
| 2025-07-17 17:00:05 | [B24 - Many Boxes](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cw) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000 | 1270 Byte |  | 186 ms | 80712 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67661188) |
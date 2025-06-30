**締切付き作業スケジューリング**を、\*\*貪欲法 + 最大ヒープ（MaxHeap）\*\*で解いていきます。以下にステップごとの処理と、**図を交えた具体的な解説**

---

## 🔰 問題概要（再掲）

* 問題数 `N` 個
* 各問題 `i` にかかる時間 `T[i]` と締切 `D[i]`
* 各問題は**連続 `T[i]` 分の時間**が必要で、**試験開始から `D[i]` 分以内に終える必要がある**
* **できるだけ多くの問題を解く**のが目的

---

## 📘 入力例

```
4
20 70
30 50
30 100
20 60
```

各問題を `(T, D)` で表すと：

| 問題番号 | T  | D   |
| ---- | -- | --- |
| 1    | 20 | 70  |
| 2    | 30 | 50  |
| 3    | 30 | 100 |
| 4    | 20 | 60  |

---

## 🧩 ステップ①：締切でソート

```ts
problems.sort((a, b) => a.D - b.D);
```

* 締切が早い問題から順に処理していくことで、**締切に間に合わないリスクを最小化**します。

### 🖼 図：ソート後の順序

```
[ (30, 50), (20, 60), (20, 70), (30, 100) ]
    ↑          ↑          ↑         ↑
  問題2     問題4      問題1    問題3
```

---

## 🧩 ステップ②：時間を積み上げて問題を解く（ヒープ管理）

### 🧠 方針

* `totalTime += T[i]` で積み上げる
* もし `totalTime > D[i]` になったら、「一番時間がかかる問題」を除去（←ヒープで管理）

---

## 🧮 各ステップの図解付き解説

---

### ✅ ステップ0（初期状態）

```ts
totalTime = 0
heap = []
```

---

### ✅ ステップ1：問題2（30, 50）

```ts
totalTime += 30 → 30 <= 50 OK
heap.push(30)
```

🖼 ヒープ（最大ヒープ）

```
[30]
```

---

### ✅ ステップ2：問題4（20, 60）

```ts
totalTime += 20 → 50 <= 60 OK
heap.push(20)
```

🖼 ヒープ

```
[30, 20]
```

---

### ✅ ステップ3：問題1（20, 70）

```ts
totalTime += 20 → 70 <= 70 OK
heap.push(20)
```

🖼 ヒープ

```
[30, 20, 20]
```

---

### ✅ ステップ4：問題3（30, 100）

```ts
totalTime += 30 → 100 <= 100 OK
heap.push(30)
```

🖼 ヒープ

```
[30, 30, 20, 20]
```

---

## ✅ 結果：heapのサイズが答え（＝解けた問題数）

```ts
heap.size() → 4
```

---

## 🧠 締切オーバーが起きるケースのイメージ図（参考）

例：あるステップで `totalTime = 90`、次の問題が `(T = 30, D = 100)` のとき：

```
totalTime += 30 → 120 > 100 → NG！
⇒ 一番大きい T を削除（ヒープから）
```

🖼 Before:

```
Heap: [40, 30, 20] → totalTime = 90
+ New T = 30
⇒ totalTime = 120 > D = 100
```

🖼 After:

```
Heap.pop() → Remove 40
totalTime -= 40 → totalTime = 80（OK）
```

---

## 💡 なぜ「一番大きなTを削除」？

* できるだけ**多くの問題を解く**のが目標。
* 時間超過したら、**時間のかかる問題を外す方が他の問題をより多く残せる**から。

---

## ✅ 最終まとめ図

```
処理順: 問題2 → 問題4 → 問題1 → 問題3
     (30,50)   (20,60)   (20,70)   (30,100)

累積時間: 30 → 50 → 70 → 100（すべて締切内）

最終ヒープ内容: [30, 30, 20, 20]

解けた問題数 = ヒープのサイズ = 4 ✅
```

---
| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題 | ユーザ | 言語 | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-06-30 14:44:25 | [A75 - Examination](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bw) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016) | 1000 | 1461 Byte | **AC** | 16 ms | 21660 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67196693) |
| 2025-06-30 14:42:42 | [A75 - Examination](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bw) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002) | 1000 | 1469 Byte | **AC** | 1 ms | 1628 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67196652) |
| 2025-06-30 14:41:30 | [A75 - Examination](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bw) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055) | 1000 | 1129 Byte | **AC** | 20 ms | 10700 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67196627) |
| 2025-06-30 14:19:04 | [A75 - Examination](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bw) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000 | 2404 Byte | **AC** | 47 ms | 42956 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67196216) |
| 2025-06-30 14:14:11 | [A75 - Examination](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bw) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000 | 2277 Byte | **AC** | 41 ms | 42816 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67196132) |
| 2025-06-30 14:12:40 | [A75 - Examination](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_bw) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000 | 1015 Byte | **AC** | 42 ms | 42812 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67196100) |
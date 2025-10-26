以下では、問題のアルゴリズムを **図と具体例** を交えて、`countDivisiblePairs` 関数の各処理を段階的に詳しく説明します。

---

## 🎯 問題の本質

「**A\[x] + A\[y] が 100 の倍数（つまり mod 100 で 0）になるペア (x, y)**」の個数を求める問題です。
👉 **ペアの条件**: `(A[i] + A[j]) % 100 === 0` かつ `i < j`

---

## ✅ 全体アルゴリズム概要

**観察**:
2つの数 `a`, `b` に対し、

```ts
(a + b) % 100 === 0 ⇔ (a % 100 + b % 100) % 100 === 0
```

これを元に、**「余りごとの個数」** を数えて、ペアの数を計算します。

---

## 📦 入力例で具体的に見る

### 入力:

```
N = 9
A = [10, 20, 30, 40, 50, 60, 70, 80, 90]
```

### 各要素の mod 100 値とカウント:

| A\[i] | A\[i] % 100 |
| ----- | ----------- |
| 10    | 10          |
| 20    | 20          |
| 30    | 30          |
| 40    | 40          |
| 50    | 50          |
| 60    | 60          |
| 70    | 70          |
| 80    | 80          |
| 90    | 90          |

これを集計すると：

```txt
modCount[10] = 1
modCount[20] = 1
modCount[30] = 1
...
modCount[90] = 1
```

---

## 🧠 処理の詳細と図解

---

### 🟢 ステップ1: modCount 配列の作成

#### 目的：

各 A\[i] の `A[i] % 100` の出現回数をカウントします。

#### 処理：

```ts
const modCount: number[] = Array(100).fill(0);
for (let i = 0; i < N; i++) {
    modCount[A[i] % 100]++;
}
```

#### 図解：

```
mod 余り : 出現数（modCount 配列）

  0 : 0
 10 : 1  ← A[0] = 10
 20 : 1  ← A[1] = 20
 30 : 1
 40 : 1
 50 : 1
 60 : 1
 70 : 1
 80 : 1
 90 : 1
 他 : 0
```

---

### 🔵 ステップ2: (0,0), (50,50) の同値組み合わせを加算

#### 理由：

- `0 + 0 = 0`
- `50 + 50 = 100`

同じ余りから2つ選ぶ → \*_組み合わせ：C(n,2) = n_(n-1)/2\*\*

```ts
totalPairs += (modCount[0] * (modCount[0] - 1)) >> 1;
totalPairs += (modCount[50] * (modCount[50] - 1)) >> 1;
```

#### この例では：

```ts
modCount[0] = 0 → 0組
modCount[50] = 1 → C(1, 2) = 0組
```

---

### 🟡 ステップ3: (r, 100 - r) のペアを加算（r: 1～49）

#### 例：

- (10, 90)
- (20, 80)
- (30, 70)
- (40, 60)

→ 合計 4組

```ts
for (let r = 1; r < 50; r++) {
    totalPairs += modCount[r] * modCount[100 - r];
}
```

#### 図解：

| r    | 100 - r | modCount\[r] | modCount\[100 - r] | ペア数   |
| ---- | ------- | ------------ | ------------------ | -------- |
| 10   | 90      | 1            | 1                  | 1        |
| 20   | 80      | 1            | 1                  | 1        |
| 30   | 70      | 1            | 1                  | 1        |
| 40   | 60      | 1            | 1                  | 1        |
| 合計 |         |              |                    | **4** 組 |

---

### 🧾 結果出力：

```ts
return totalPairs; // => 4
```

---

## ✅ 最終図まとめ（全体の流れ）

```plaintext
入力: A = [10,20,30,40,50,60,70,80,90]
        ↓
各要素 mod 100 → カウント配列作成
        ↓
組 (0,0), (50,50) を計算 (C(n,2))
        ↓
組 (r, 100-r) を r=1〜49 で計算
        ↓
合計ペア数 → 出力
```

---

## ✅ 補足：なぜ O(N) で高速？

- 配列一回走査：O(N)
- `modCount` はサイズ100固定：O(100)
- 合計：O(N) 時間、O(100) 空間 → 1秒制限・1024MiB メモリ制限に**余裕で収まる**

---

## ✅ 確認用出力ログを一時追加したい場合

以下を一時的に関数内に加えるとデバッグ可能です：

```ts
console.log('modCount:', modCount.slice(0, 20)); // 先頭20個表示
```

---

質問があればどこでも補足します。必要なら、動作確認用の Jest テストコードも提供できます。
| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題 | ユーザ | 言語 | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) | |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-07-31 20:02:15 | [B40 - Divide by 100](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_dm) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002) | 1000 | 1170 Byte | | 1 ms | 1628 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/68067416) |
| 2025-07-31 20:00:54 | [B40 - Divide by 100](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_dm) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016) | 1000 | 1159 Byte | | 17 ms | 21692 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/68067397) |
| 2025-07-31 19:58:42 | [B40 - Divide by 100](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_dm) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055) | 1000 | 1340 Byte | | 20 ms | 10732 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/68067368) |
| 2025-07-31 19:50:25 | [B40 - Divide by 100](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_dm) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000 | 1204 Byte | | 42 ms | 42916 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/68067256) |
| 2025-07-31 19:47:53 | [B40 - Divide by 100](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_dm) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000 | 957 Byte | | 42 ms | 42816 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/68067221) |

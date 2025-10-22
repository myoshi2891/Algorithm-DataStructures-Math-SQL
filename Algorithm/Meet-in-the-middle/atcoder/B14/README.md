今回の問題に対して使われた **半分全列挙（Meet-in-the-middle）** の手法について、**概念・手順・各処理の図解**を用いて丁寧に説明します。

---

## 🔷 半分全列挙（Meet-in-the-middle）とは？

`N` がそこそこ大きく（例：N=30）の場合に、\*\*2ⁿ 全探索（部分集合全列挙）\*\*を直接行うと計算量が **2³⁰ ≒ 10⁹** になり、時間制限（1秒）内に終わりません。

これを回避するために：

### ✅ `N` 個の要素を **2つに分割**してそれぞれ `2^(N/2)` 通りだけ全列挙し、

### ✅ それらの **和の組み合わせ** で目的の値 `K` を探索する手法です。

---

## 🔷 処理の全体フロー

```txt
入力: N=6, K=30, A = [5, 1, 18, 7, 2, 9]
```

```
▼ Step 1: 配列を左右に分割
      A = [5, 1, 18, 7, 2, 9]
           ↑      ↑
       left     right
     [5, 1, 18] [7, 2, 9]
```

---

## 🔷 Step 2: 各グループの部分和を列挙

### 【左側3要素】の部分集合和（2^3 = 8通り）：

```
部分集合     和
--------    ----
{}           0
{5}          5
{1}          1
{18}         18
{5,1}        6
{5,18}       23
{1,18}       19
{5,1,18}     24
```

→ **leftSums = \[0, 5, 1, 18, 6, 23, 19, 24]**

### 【右側3要素】の部分集合和（2^3 = 8通り）：

```
部分集合     和
--------    ----
{}           0
{7}          7
{2}          2
{9}          9
{7,2}        9
{7,9}        16
{2,9}        11
{7,2,9}      18
```

→ **rightSums = \[0, 7, 2, 9, 9, 16, 11, 18]**

→ 重複を許して **ソート**：`[0, 2, 7, 9, 9, 11, 16, 18]`

---

## 🔷 Step 3: 片方（leftSums）を固定して、もう片方（rightSums）を **二分探索**

例えば：

```
K = 30
→ leftSum = 5 に対して、必要な rightSum = 25
→ leftSum = 6 に対して、必要な rightSum = 24
→ leftSum = 12 に対して、必要な rightSum = 18 ← 見つかった！
```

図解：

```txt
leftSum: 12     rightSums (sorted): [0, 2, 7, 9, 9, 11, 16, 18]
                          ↑ found 30 - 12 = 18
→ 合計 = 12 + 18 = 30 → 解あり
```

---

## 🔷 Step 4: 解が見つかれば "Yes"、見つからなければ "No"

---

## 🔷 処理ごとの詳細と図解

### 🔹 ① `getSubsetSums(arr: number[])` のイメージ

全ての部分集合をビットで表して列挙します。

#### 例: arr = \[5, 1, 18]

```
bit   subset     sum
000 → {}          0
001 → {5}         5
010 → {1}         1
011 → {5,1}       6
100 → {18}       18
101 → {5,18}     23
110 → {1,18}     19
111 → {5,1,18}   24
```

### 🔹 ② `binarySearch(arr, target)` のイメージ

ソート済配列で二分探索します。

```txt
arr = [0, 2, 7, 9, 9, 11, 16, 18], target = 18

→ 中央を探って左右に絞り込む
→ 18 は見つかる → true を返す
```

---

## 🔷 まとめ

| ステップ | 処理                           | 計算量            |
| -------- | ------------------------------ | ----------------- |
| 分割     | A を2つに分ける                | O(N)              |
| 列挙     | 各部分集合和を計算（最大 2¹⁵） | O(2^(N/2) \* N)   |
| ソート   | 右側の部分和をソート           | O(2^(N/2) \* log) |
| 探索     | 左側からループ＆右側で二分探索 | O(2^(N/2) \* log) |

→ **全体で O(2^(N/2) \* log(2^(N/2))) ≈ 3.3 × 10⁵** と高速！

---

## 🧠 この手法が有効な理由

- N ≤ 30 のとき、2^30 = 10億 通り全探索は **間に合わない**
- でも 2^15 = 約3万通りずつなら現実的 → **分割して合わせる！**

---

ここでは、コード内の各 `function` の**役割・内部処理・計算量**について詳しく解説し、特に `getSubsetSums` における **ビット操作による部分集合列挙の理由** を図解とともに明確に説明します。

---

## ✅ 各関数の詳細な解説

---

### ### ① `getSubsetSums(arr: number[]): number[]`

#### ● 概要：

- `arr` の全ての **部分集合の和** を列挙して返す。
- 例: `arr = [a, b, c]` の場合、空集合から `{a,b,c}` まで、`2^n` 通りの和を求める。

#### ● ビット全探索とは？

- 長さ `n` の配列に対して、`0〜2^n-1` の整数を **ビット列** として見なすことで、各部分集合を表すことができます。

#### 🔸 例： `arr = [5, 1, 18]` の場合

| bit列 | 対応する集合 | 和  |
| ----- | ------------ | --- |
| `000` | `∅`          | 0   |
| `001` | `{5}`        | 5   |
| `010` | `{1}`        | 1   |
| `011` | `{5,1}`      | 6   |
| `100` | `{18}`       | 18  |
| `101` | `{5,18}`     | 23  |
| `110` | `{1,18}`     | 19  |
| `111` | `{5,1,18}`   | 24  |

#### ● なぜビットで表現するのか？

- 各要素を選ぶかどうかは **2択（選ぶ/選ばない）** → 2進数（bit）で自然に表現できる。
- `bit & (1 << i)` によって、`i番目の要素を選ぶかどうか` を高速にチェックできる。

#### ● 実装のポイント：

```ts
for (let bit = 0; bit < 1 << n; bit++) {
    let sum = 0;
    for (let i = 0; i < n; i++) {
        if (bit & (1 << i)) {
            sum += arr[i]; // i番目を選ぶ
        }
    }
    result.push(sum);
}
```

#### ● 計算量：

- `2^n` 個の部分集合 → `O(2^n * n)` 時間（nは最大15なので余裕）

---

### ### ② `binarySearch(arr: number[], target: number): boolean`

#### ● 概要：

- ソート済み配列 `arr` に対して、値 `target` が存在するかを**二分探索**で確認。

#### ● 処理の流れ：

```ts
while (left <= right) {
    const mid = (left + right) >> 1;
    if (arr[mid] === target) return true;
    else if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
}
```

#### ● 特徴：

- 時間計算量：`O(log N)` と高速。
- 要素が昇順で整列されているため使用可能。

#### ● 用途：

- 左側の部分和 `x` に対して、`K - x` が右側に存在するかを確認するのに使用。

---

### ### ③ `main()`

#### ● 概要：

全体の制御を行う関数で、以下の手順を踏みます：

1. 入力の読み取り・パース（`fs.readFileSync`）
2. 配列 `A` を `left` と `right` に分割
3. `getSubsetSums` によって各側の部分和を計算
4. `rightSums` をソート（`binarySearch` 用）
5. `leftSums` の各値 `x` に対し、`K - x` を `rightSums` に対して探索
6. 合計 `K` が作れる組み合わせが見つかれば `"Yes"` を出力、なければ `"No"`

#### ● 具体的な処理フロー図：

```txt
A = [5, 1, 18, 7, 2, 9], N=6, K=30

     ┌────────────┐
     │  input     │ ← fs.readFileSync
     └────┬───────┘
          ↓
     ┌────────────┐
     │  Split A   │ → left = [5,1,18], right = [7,2,9]
     └────┬───────┘
          ↓
  ┌─────────────┐
  │ getSubsetSums│ → leftSums（8個）, rightSums（8個）
  └────┬────────┘
       ↓
  ┌───────────────┐
  │ sort rightSums│ → binarySearch用
  └────┬──────────┘
       ↓
  ┌─────────────────────────────┐
  │ loop x in leftSums          │
  │   → search K - x in rightSums│ ← binarySearch
  └──────────┬──────────────────┘
             ↓
    Yes (found) / No (not found)
```

---

## 🔶 `getSubsetSums` におけるビット列の利点まとめ

| 項目         | 内容                                                                     |
| ------------ | ------------------------------------------------------------------------ |
| 簡潔性       | 全ての組み合わせを `0`〜`2ⁿ-1` の整数ループで1行で表現可能               |
| 高速性       | ビット演算は整数演算なので非常に高速                                     |
| 実装の明快さ | `if (bit & (1 << i))` で「i番目の要素を使う」かどうかが一目で分かる      |
| 空間効率     | 明示的に配列を保持せずとも、部分集合をオンデマンドに計算できる           |
| 応用性の広さ | 部分集合列挙、ナップサック問題、bitDP などの幅広いアルゴリズムに利用可能 |

---

## ✅ まとめ

| 関数名          | 目的                     | 時間計算量       | ポイント                  |
| --------------- | ------------------------ | ---------------- | ------------------------- |
| `getSubsetSums` | 配列の部分和を列挙       | `O(2^n * n)`     | **ビット全探索**を活用    |
| `binarySearch`  | 値の探索（存在チェック） | `O(log n)`       | ソート済配列に高速探索    |
| `main`          | 全体の制御ロジック       | `O(2^n * log n)` | Meet-in-the-middle の本体 |

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題                                                                                       | ユーザ                                            | 言語                                                                                                        | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |                                                                       |
| --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2025-07-09 17:00:47                                                                           | [B14 - Another Subset Sum](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cm) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002)                   | 1000                                                                                    | 1407 Byte                                                                                 |      | 9 ms                                                                                         | 2112 KiB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67446328) |
| 2025-07-09 16:55:38                                                                           | [B14 - Another Subset Sum](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cm) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016)                  | 1000                                                                                    | 1576 Byte                                                                                 |      | 35 ms                                                                                        | 23812 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67446181) |
| 2025-07-09 16:51:51                                                                           | [B14 - Another Subset Sum](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cm) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055)          | 1000                                                                                    | 1039 Byte                                                                                 |      | 85 ms                                                                                        | 13228 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67446056) |
| 2025-07-09 16:33:32                                                                           | [B14 - Another Subset Sum](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cm) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000                                                                                    | 1382 Byte                                                                                 |      | 57 ms                                                                                        | 48880 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67445536) |
| 2025-07-09 16:28:53                                                                           | [B14 - Another Subset Sum](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_cm) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009)     | 1000                                                                                    | 1191 Byte                                                                                 |      | 79 ms                                                                                        | 48856 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/67445383) |

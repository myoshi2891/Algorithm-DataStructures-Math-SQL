---
## 💡 問題の再確認

与えられた `N` 枚のカードのそれぞれに整数 `Ai`（表）と `Bi`（裏）がある。
**選んだカードに対して：**

```
スコア = |ΣAi| + |ΣBi|
```

を最大化せよ。
---

## ✅ 解法全体のイメージ（図解）

### 1. カードを2次元ベクトルとして解釈

```
[カード i]
        Ai → 表
        Bi → 裏

つまりカード = (Ai, Bi) = 2次元のベクトル
```

これらを以下のように視覚化できます：

```
     ↑ B軸（裏）
     |
     |
(-1,1)         (1,1)
     |   *     |
     |    *    |
-----+---------+----→ A軸（表）
     |         |
     |   *     |
(-1,-1)        (1,-1)
```

---

## ✅ 処理ステップ解説（図付き）

---

### 🔷 ステップ 1: 4象限の符号を準備

```ts
const signs: [number, number][] = [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
];
```

これによって、下図の **4象限**（方向）すべてをカバー：

```
     ↑ B（裏）
     |
 Q2  |  Q1       ← AとBの符号：(+A, +B)
-----+-----
 Q3  |  Q4       ← AとBの符号：(-A, -B)
     |
     → A（表）
```

---

### 🔷 ステップ 2: 各象限についてスコア評価

図で表すと以下のように：

#### 例: 符号 (1, -1)（第4象限）

```
   Ai方向: →
   Bi方向: ↓（裏面反転）

カードの貢献ベクトル: (Ai, -Bi)

→ このベクトルの長さが正なら選ぶ
→ 選んだベクトルを加算して、最終スコア = |ΣA| + |ΣB|
```

```ts
for (const [sa, sb] of signs) {
    let sumA = 0;
    let sumB = 0;

    for (const [a, b] of cards) {
        const va = sa * a;
        const vb = sb * b;

        if (va + vb > 0) {
            sumA += a;
            sumB += b;
        }
    }

    const score = Math.abs(sumA) + Math.abs(sumB);
    if (score > maxScore) maxScore = score;
}
```

この処理で得られるスコアは、「**その象限方向に貢献するベクトルだけを選んだときの合計**」です。

---

### 🔷 各ベクトルの選択と貢献イメージ（例）

#### 入力例：

```
[2, 8]
[4, -5]
[5, -3]
[-4, 1]
[-2, -3]
```

#### 符号 (1, -1) を選ぶと：

- (2, 8) → (2, -8) → 2 + (-8) = -6 → ✗（スコア減るので除外）
- (4, -5) → (4, 5) → 4 + 5 = 9 → ○
- (5, -3) → (5, 3) → 5 + 3 = 8 → ○
- (-4, 1) → (-4, -1) → -5 → ✗
- (-2, -3) → (-2, 3) → 1 → ○

加算されるカード：

```
[4, -5]
[5, -3]
[-2, -3]
```

ΣA = 4 + 5 - 2 = 7
ΣB = -5 + (-3) + (-3) = -11
スコア = |7| + |−11| = 18

---

## ✅ 最終的に最大スコアを得る処理

4象限すべてを走査して：

```
maxScore = max( Q1, Q2, Q3, Q4 )
```

---

## ✅ 全体のフローまとめ図

```text
┌────────────┐
│ 入力カード │
└────┬───────┘
     ▼
 ┌────────────┐
 │4象限符号設定│
 └────┬───────┘
      ▼
┌──────────────────────┐
│ 各カードに対して     │
│ (符号 × A, 符号 × B) │
│ の和が正なら選ぶ     │
└────┬─────────────────┘
     ▼
┌────────────────┐
│ 各象限での      │
│ ΣA, ΣB → スコア計算 │
└────┬─────────────┘
     ▼
┌────────────┐
│ 最大スコア出力 │
└────────────┘
```

---

## ✅ なぜ正しいのか（理論的補足）

スコア関数 `|ΣA| + |ΣB|` は：

- 線形関数の **絶対値の和**
- 各カードを「選ぶか / 選ばないか」でしか操作できないため、
- 最終的に `(ΣA, ΣB)` ベクトルの向きと長さ（マンハッタン距離）を最大化することになる
- これは **4象限の符号組合せで全空間を完全に網羅**しているため、**全探索に等しい**

---

## ✅ 結論

この 4 象限探索による方法は：

- ベクトルの加算方向を全探索して
- 各方向で最もスコアに貢献するカードのみを選び
- 最大の `|ΣA| + |ΣB|` を返すため

**誤答が起きることはなく、TLE も起きない最適な方法**です。

---

各処理について詳細な図解で分析・説明します。この詳細解析では、カードスコア最大化問題の以下の側面を包括的に説明しました：

## **🎯 主要な解析ポイント**

### **1. 理論的基盤**

- 絶対値関数の数学的性質
- 4つのパターンへの場合分け
- 各パターンでの最適化目標

### **2. アルゴリズム設計**

- 貪欲法の適用理由
- 時間・空間計算量の詳細分析
- 実装の効率化技術

### **3. 具体的計算過程**

- 例題での各パターン計算
- 最適解の決定プロセス
- 視覚的な結果確認

### **4. 最適化技術**

- メモリ使用量の削減方法
- 実行時間短縮のテクニック
- キャッシュ効率の向上策

### **5. 実装上の考慮事項**

- 各言語での注意点
- エッジケースの処理
- 型安全性とパフォーマンスのバランス

この図解により、問題の本質から実装の詳細まで、アルゴリズムの全体像を理解できるようになっています。特に視覚的な要素を多用することで、抽象的な概念も直感的に把握できるよう工夫しました。

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題                                                                                    | ユーザ                                            | 言語                                                                                                        | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | AI tool         | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |                                                                       |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | --------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2025-08-02 14:44:59                                                                           | [B42 - Two Faced Cards](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_do) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002)                   | 1000                                                                                    | 1615 Byte                                                                                 | ChatGPT         | 17 ms                                                                                        | 6112 KiB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/68094502) |
| 2025-08-02 14:36:28                                                                           | [B42 - Two Faced Cards](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_do) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016)                  | 1000                                                                                    | 1417 Byte                                                                                 | ChatGPT         | 71 ms                                                                                        | 50212 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/68094366) |
| 2025-08-02 14:24:19                                                                           | [B42 - Two Faced Cards](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_do) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055)          | 1000                                                                                    | 8262 Byte                                                                                 | Claude Sonnet 4 | 92 ms                                                                                        | 25448 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/68094224) |
| 2025-08-02 14:15:43                                                                           | [B42 - Two Faced Cards](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_do) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055)          | 1000                                                                                    | 7911 Byte                                                                                 | Claude Sonnet 4 | 94 ms                                                                                        | 25376 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/68094091) |
| 2025-08-02 14:09:12                                                                           | [B42 - Two Faced Cards](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_do) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055)          | 1000                                                                                    | 1381 Byte                                                                                 | ChatGPT         | 125 ms                                                                                       | 33172 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/68094008) |
| 2025-08-02 13:59:27                                                                           | [B42 - Two Faced Cards](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_do) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000                                                                                    | 4080 Byte                                                                                 | Claude Sonnet 4 | 99 ms                                                                                        | 63408 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/68093876) |
| 2025-08-02 13:55:10                                                                           | [B42 - Two Faced Cards](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_do) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [TypeScript 5.1 (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5058) | 1000                                                                                    | 1385 Byte                                                                                 | ChatGPT         | 173 ms                                                                                       | 97500 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/68093803) |
| 2025-08-02 13:44:20                                                                           | [B42 - Two Faced Cards](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_do) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009)     | 1000                                                                                    | 4297 Byte                                                                                 | Claude Sonnet 4 | 141 ms                                                                                       | 63092 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/68093632) |
| 2025-08-02 13:40:47                                                                           | [B42 - Two Faced Cards](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_do) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009)     | 1000                                                                                    | 2472 Byte                                                                                 | Claude Sonnet 4 | 224 ms                                                                                       | 101492 KiB                                                                                   | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/68093563) |
| 2025-08-02 13:38:05                                                                           | [B42 - Two Faced Cards](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_do) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009)     | 1000                                                                                    | 1106 Byte                                                                                 | ChatGPT         | 183 ms                                                                                       | 97936 KiB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/68093517) |

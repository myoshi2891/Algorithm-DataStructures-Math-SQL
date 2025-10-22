---
## 💡 問題の本質

映画のスケジュール（開始・終了時間）が与えられており、**同時に複数の映画は見られない**という制約のもとで、**最大いくつの映画を連続で見られるか**を求めます。
---

## 🔢 入力例

```
3
123 86399
1 86400
86399 86400
```

映画は以下のようになっています：

| 映画番号 | 開始時間 | 終了時間 |
| -------- | -------- | -------- |
| 1        | 123      | 86399    |
| 2        | 1        | 86400    |
| 3        | 86399    | 86400    |

---

## 🔄 ステップ1：終了時間でソート

終了時間で昇順ソートするとこうなります：

```
映画1: 123 - 86399
映画3: 86399 - 86400
映画2: 1 - 86400
↓ 終了時間順に並び替え
[映画1, 映画3, 映画2]
```

図示すると：

```
時間軸（例: 0〜86400秒）
|---- 映画1 ----|    （終了: 86399）
              |-- 映画3 --| （終了: 86400）
|------------- 映画2 -------------|（終了: 86400）
```

---

## 🔄 ステップ2：貪欲法で選ぶ（終わったらすぐ次へ）

### 初期値：

- `currentTime = 0`（まだ何も見てない）
- `count = 0`

### 映画1: 123 - 86399

- 開始 123 >= `currentTime = 0` → ✅ 見られる！
- 映画1を選び、`currentTime = 86399`
- `count = 1`

### 映画3: 86399 - 86400

- 開始 86399 >= `currentTime = 86399` → ✅ 見られる！
- 映画3を選び、`currentTime = 86400`
- `count = 2`

### 映画2: 1 - 86400

- 開始 1 < `currentTime = 86400` → ❌ 見られない（映画3と時間が被る）

---

## ✅ 最終結果

- 見られる映画は2本 → **出力: `2`**

---

## 🎯 視覚的まとめ（タイムライン）

```text
時間軸（秒）:

0         123                  86399     86400
|----------|---------------------|---------|
             [ 映画1 ] --------->|
                                  [ 映画3 ]--->

  [ 映画2 ]--------------------------------->  ← 長すぎて見られない
```

---

## 🧠 なぜ終了時間でソートするの？

- **早く終わる映画から見ることで、後の映画の選択肢を最大化**できるためです。
- これが「貪欲法」の本質です。

---

## ✅ まとめ

- 映画を**終了時間でソート**
- 現在時刻より開始時間が**同じか後ろ**の映画だけ選ぶ
- 最後に選んだ映画の**終了時間を現在時刻として更新**
- \*\*貪欲法（Greedy Algorithm）\*\*で最大数を効率的に求められる

---

## 🧠 1. 貪欲法とは？

**その場その場で最も良いと思われる選択（局所最適）をすることで、最終的に最適解（または良い解）を得ようとする手法。**

> 「欲張ってその瞬間にベストなものを選び続ける」から\*\*Greedy（貪欲）\*\*という名前が付いています。

---

## 🧩 2. 具体的な流れ（一般的な構造）

1. **ソートや整列**：対象をある基準で並び替える（例：終了時間、重さ、利益など）。
2. **選択基準に従ってループ**：その時点で選べる中で最良の選択を行う。
3. **状態を更新**：選んだ結果に応じて次の選択条件を更新する。

---

## 🎯 3. 特徴

| 特徴                      | 説明                                                   |
| ------------------------- | ------------------------------------------------------ |
| ✅ 高速                   | ソート + 線形走査などで `O(N log N)` で済む場合が多い  |
| ✅ 実装がシンプル         | 再帰や複雑な分岐を使わず書けることが多い               |
| ⚠ 最適解でない場合もある | 「局所最適」な選択が「全体最適」にならないことがある   |
| ⚠ 正しさの証明が必要     | 使える場面では正解だが、**常に正解になるわけではない** |

---

## 🎥 4. 今回の映画スケジューリング問題での貪欲法

### 問題：

- 映画を最大何本見られるか（時間が重ならないように）

### 貪欲戦略：

- **終了時間が早い映画から見る**
  → 次に見られる映画の選択肢が増える（＝将来に希望を残す）

### なぜ正しい？

- 「終了が早い」映画を選ぶことで、次の映画の開始時間の制約を最小限にできるから。
- この戦略が「常に最も自由度の高い選択を残す」ことに繋がっており、**最適解が得られることが証明されている問題**です。

---

## 📘 5. 代表的な貪欲法の問題

| 問題                              | 貪欲の戦略例                                         |
| --------------------------------- | ---------------------------------------------------- |
| 活動選択問題（映画など）          | 終了時間が早い順に選ぶ                               |
| ナップサック（fractional）        | 重さあたりの価値が高い順に詰める                     |
| 区間スケジューリング              | 開始・終了時間で貪欲に選択                           |
| 最小硬貨問題（特定条件で）        | 大きな硬貨から順に選ぶ（ただし最適にならない場合も） |
| プリム/クラスカル法（最小全域木） | 辺の重みが小さい順に選ぶ                             |

---

## ❌ 使えない例（注意点）

以下のようなケースでは貪欲法が**誤った答えを出す**ことがあります：

### 例：0/1ナップサック問題（Fractionalでない）

- 貪欲法では最も「価値/重さ」の高い物を選びがちだが、**部分的に取れない**場合は最適でない。
- → 動的計画法（DP）が必要。

---

## ✅ まとめ

| 項目         | 内容                                       |
| ------------ | ------------------------------------------ |
| 定義         | その場で最良の選択をするアルゴリズム設計法 |
| メリット     | 高速・実装が簡単                           |
| デメリット   | 必ずしも最適解になるとは限らない           |
| 使える場面   | 選択が未来の選択に悪影響を与えないとき     |
| 映画問題では | 終了時間でソートし、順に選べば最適になる   |

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題                                                                                                      | ユーザ                                            | 言語                                                                                                    | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果   | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |                                                                       |
| --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 2025-05-25 19:31:25                                                                           | [A39 - Interval Scheduling Problem](https://atcoder.jp/contests/tessoku-book/tasks/math_and_algorithm_bn) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Java (OpenJDK 17)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5005)            | 1000                                                                                    | 936 Byte                                                                                  | **AC** | 1115 ms                                                                                      | 72764 KB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66155186) |
| 2025-05-25 19:29:57                                                                           | [A39 - Interval Scheduling Problem](https://atcoder.jp/contests/tessoku-book/tasks/math_and_algorithm_bn) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055)      | 1000                                                                                    | 529 Byte                                                                                  | **AC** | 389 ms                                                                                       | 50520 KB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66155158) |
| 2025-05-25 19:27:49                                                                           | [A39 - Interval Scheduling Problem](https://atcoder.jp/contests/tessoku-book/tasks/math_and_algorithm_bn) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002)               | 1000                                                                                    | 1122 Byte                                                                                 | **AC** | 95 ms                                                                                        | 12620 KB                                                                                     | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66155100) |
| 2025-05-25 19:25:48                                                                           | [A39 - Interval Scheduling Problem](https://atcoder.jp/contests/tessoku-book/tasks/math_and_algorithm_bn) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016)              | 1000                                                                                    | 660 Byte                                                                                  | **AC** | 823 ms                                                                                       | 159292 KB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66155072) |
| 2025-05-25 19:23:51                                                                           | [A39 - Interval Scheduling Problem](https://atcoder.jp/contests/tessoku-book/tasks/math_and_algorithm_bn) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016)              | 1000                                                                                    | 620 Byte                                                                                  | **AC** | 793 ms                                                                                       | 175512 KB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66155042) |
| 2025-05-25 19:15:01                                                                           | [A39 - Interval Scheduling Problem](https://atcoder.jp/contests/tessoku-book/tasks/math_and_algorithm_bn) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000                                                                                    | 644 Byte                                                                                  | **AC** | 588 ms                                                                                       | 138592 KB                                                                                    | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66154883) |

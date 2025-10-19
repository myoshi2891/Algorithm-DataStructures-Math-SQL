
---

## 🧩 問題のイメージ

**前提：**

* トンネルの長さは `L` メートル。
* `N` 人がトンネル内にいて、それぞれ位置 `Ai`、方向 `Bi`（`E` or `W`）に向かって秒速 1m で移動中。
* 人がすれ違ったら方向を変えるが、**実質的には「すれ違うだけ」と見なせる**ため、**誰が最後に出るか**を判定するだけでよい。

---

## ✅ 処理概要：出口までの時間を求める

人ごとに出口までの時間を求め、最大を取ればOK。

| 人の位置 Ai | 方向 Bi | 出口までの距離 | 出るまでの時間（秒） |
| ------- | ----- | ------- | ---------- |
| 20      | E     | L - 20  | 80         |
| 50      | E     | L - 50  | 50         |
| 70      | W     | 70      | 70         |

図で表すと：

```
0           20     50     70             100
|-----------|------|------|--------------|
W出口       人1→   人2→   ←人3           E出口
```

→ 最長時間は `80` 秒（人1が最も時間がかかる）

---

## 🧠 改善コードの流れと図解

### ステップ 1：最初の行（NとLの取得）

```
入力例：
3 100
20 E
50 E
70 W
```

1行目：`3 100` → N=3, L=100 を保存

```plaintext
読み取った値:
N = 3
L = 100
```

---

### ステップ 2：各行を逐次読み取り、最大時間を更新

処理の様子を図で表すと：

```
人データ      | 処理           | 計算結果  | maxTime 更新
-------------|----------------|-----------|--------------
20 E         | L - 20 = 80    | 80        | maxTime = 80
50 E         | L - 50 = 50    | 50        | maxTime = 80（更新なし）
70 W         | 70             | 70        | maxTime = 80（更新なし）
```

---

## 🧰 メモリ効率の解説（図）

### ❌ 元のコード（メモリ非効率）

```plaintext
input = [
  "3 100",  ← 入力全体を保存
  "20 E",
  "50 E",
  "70 W"
]
→ Nが大きいと input[] が巨大になる
```

### ✅ 修正後コード（メモリ効率良）

```plaintext
ステップごとに読み取り：
1: "3 100"  → N, L を保持
2: "20 E"   → すぐに処理 → maxTime = 80
3: "50 E"   → すぐに処理 → maxTime = 80
4: "70 W"   → すぐに処理 → maxTime = 80
→ input[] は存在しない！保持するのは N, L, maxTime のみ
```

---

## 🔚 最終的なポイントまとめ（図示）

```
         入力 →    行ごと処理 →    時間計算 →   最大時間を保持
                 （1人ずつ）                    （O(1)メモリ）
```

* 💾 **メモリ消費は最小限（一定）**
* ⏱️ **計算量は O(N)** → 高速
* 🧠 **「すれ違いは無視してよい」という物理的簡略化を活用**

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題 | ユーザ | 言語 | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-05-31 11:16:57 | [A43 - Travel 3](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_aq) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Java (OpenJDK 17)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5005) | 1000 | 542 Byte | **AC** | 500 ms | 62832 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66284622) |
| 2025-05-31 11:11:47 | [A43 - Travel 3](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_aq) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002) | 1000 | 496 Byte | **AC** | 135 ms | 6508 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66284528) |
| 2025-05-31 11:10:15 | [A43 - Travel 3](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_aq) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016) | 1000 | 316 Byte | **AC** | 54 ms | 21392 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66284488) |
| 2025-05-31 11:07:57 | [A43 - Travel 3](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_aq) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055) | 1000 | 429 Byte | **AC** | 66 ms | 8572 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66284442) |
| 2025-05-31 11:01:38 | [A43 - Travel 3](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_aq) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000 | 732 Byte | **AC** | 156 ms | 55312 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66284306) |
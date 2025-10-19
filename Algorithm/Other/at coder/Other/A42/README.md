
---

## 🎯 問題再掲（要点）

* 生徒それぞれに体力 `A[i]` と気力 `B[i]` が与えられている
* 任意の生徒グループについて：

  * 体力の最大値と最小値の差 ≤ `K`
  * 気力の最大値と最小値の差 ≤ `K`
* そのようなグループの中で、**最大人数を求める**

---

## 🧠 解法の概要（図つき）

この問題は、2次元座標上に点（生徒）をプロットしたとき、**K×Kの正方形内に入る最大点数を求める**問題とみなせます。

例えば、次のように生徒たちを `体力 (x軸)`、`気力 (y軸)` に配置すると：

```
   ↑ 気力 B
  |
  |                         ●
  |         ●
  |   ●
  |               ●
  +------------------------→ 体力 A
```

この点群の中から、K×K の範囲内に収まる最大の点数（人数）を探すことが目標です。

---

## 🔄 ステップごとの処理

### Step 1️⃣：生徒を体力（A）でソート

まず体力（A）で生徒を昇順にソートすることで、体力の差がK以下の範囲を前から順に確認できます。

```js
students.sort((s1, s2) => s1.a - s2.a);
```

* **目的**：体力の差がK以下になるウィンドウを効率的に作るため

---

### Step 2️⃣：体力の差がK以内の部分集合を全探索

```js
for (let i = 0; i < N; i++) {
  let temp = [];

  for (let j = i; j < N; j++) {
    if (students[j].a - students[i].a > K) break;
    temp.push(students[j]);
  }
```

* **目的**：`students[i]` を始点とし、体力差が `K` 以下の範囲にいる生徒を `temp` に集める
* 体力の差がKを超えたら `break` することで、探索範囲を効率化

📌 この時点で、temp\[] は体力が `[students[i].a, students[i].a + K]` の範囲にある生徒のリスト

---

### Step 3️⃣：その中で気力の差がK以下になる最大人数を探索

```js
temp.sort((s1, s2) => s1.b - s2.b); // 気力でソート

for (let l = 0; l < temp.length; l++) {
  for (let r = l; r < temp.length; r++) {
    if (temp[r].b - temp[l].b > K) break;
    maxCount = Math.max(maxCount, r - l + 1);
  }
}
```

ここでも同様に、ソート済み配列に対してスライドウィンドウのような処理を行い、**気力の差がK以内の最大人数**を求めます。

---

## 🖼️ 図で説明（処理のイメージ）

```
点群（体力×気力）座標：

               ↑ 気力
            70 +           ●
            60 +       ●       ← B[r]
            50 +     ●
            40 +   ●   ← B[l]
            30 + ●
               +----------------→ 体力
                 A[i]     A[j]     （差 ≤ K）

↓ 赤枠がK×K以内の範囲

                +-----------+
                |           |
                |    ● ●    |
                |   ●   ●   |
                |  ●        |
                +-----------+
```

この枠に入る点（生徒）の数が、条件を満たす最大人数の候補となります。

---

## ⚡ 効率性について

* 外側のループ：`O(N)`
* 内側の体力フィルター：最大 `O(N)`
* 気力ソート：`O(N log N)`
* 気力フィルター：最大 `O(N)`

➡ 全体で `O(N^2 log N)` ほどで解け、N=300 でも余裕で間に合います。

---

## ✅ この手法の強み

| ポイント | 説明                     |
| ---- | ---------------------- |
| 正確性  | 条件（最大 - 最小 ≤ K）を厳密に満たす |
| 汎用性  | 気力と体力がどのような分布でも対応可能    |
| 効率性  | 不必要な全探索を避け、ソートと区間探索で処理 |

---

## 🧪 おまけ：この問題の応用範囲

この問題は以下のような問題にも応用可能です：

* 2次元空間での「最大密度エリア」問題
* スケジューリングにおける「許容差内でのグループ化」
* 商品レコメンドなどでの「類似度が近いグループの最大化」

---

## 📦 まとめ

| ステップ | 処理            | 効果               |
| ---- | ------------- | ---------------- |
| 1️⃣  | 生徒を体力順にソート    | 体力差K以内を効率的に抽出    |
| 2️⃣  | 体力差K以内の生徒を収集  | 候補集合の縮小          |
| 3️⃣  | その中で気力差K以内を探索 | 条件を厳密に満たす最大人数を取得 |

---

| [提出日時](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=created) | 問題 | ユーザ | 言語 | [得点](https://atcoder.jp/contests/tessoku-book/submissions/me?desc=true&orderBy=score) | [コード長](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=source_length) | 結果 | [実行時間](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=time_consumption) | [メモリ](https://atcoder.jp/contests/tessoku-book/submissions/me?orderBy=memory_consumption) |  |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 2025-05-30 11:24:50 | [A42 - Soccer](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ap) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Java (OpenJDK 17)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5005) | 1000 | 1567 Byte | **AC** | 164 ms | 42532 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66261340) |
| 2025-05-30 11:23:38 | [A42 - Soccer](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ap) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Python (CPython 3.11.4)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5055) | 1000 | 662 Byte | **AC** | 34 ms | 8584 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66261317) |
| 2025-05-30 11:19:25 | [A42 - Soccer](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ap) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [Go (go 1.20.6)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5002) | 1000 | 1624 Byte | **AC** | 10 ms | 3836 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66261236) |
| 2025-05-30 11:15:36 | [A42 - Soccer](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ap) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [PHP (php 8.2.8)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5016) | 1000 | 1196 Byte | **AC** | 239 ms | 21664 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66261160) |
| 2025-05-30 11:09:09 | [A42 - Soccer](https://atcoder.jp/contests/tessoku-book/tasks/tessoku_book_ap) | [myoshizumi](https://atcoder.jp/users/myoshizumi) | [JavaScript (Node.js 18.16.1)](https://atcoder.jp/contests/tessoku-book/submissions/me?f.Language=5009) | 1000 | 945 Byte | **AC** | 74 ms | 48784 KiB | [詳細](https://atcoder.jp/contests/tessoku-book/submissions/66261041) |
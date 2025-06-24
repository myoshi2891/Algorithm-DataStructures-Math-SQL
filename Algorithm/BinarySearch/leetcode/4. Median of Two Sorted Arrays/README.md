
---

## 🎯 目的

与えられた **ソート済み配列 `nums1` と `nums2`** を統合したときの **中央値（median）** を求める。
ただし、**O(log(min(m, n)))** の時間で解くことが条件。

---

## 🔑 アルゴリズムの核心アイデア

短い配列 `nums1` を基準に「**分割位置を二分探索**」して、
両配列を「左右に分割」し、**左側の最大値・右側の最小値** を使って中央値を導出する。

---

## 🧠 イメージ例：nums1 = \[1, 3], nums2 = \[2]

合計要素数 = 3（奇数）

```
nums1 = [1, 3]
nums2 = [2]
```

---

## 🧮 ステップ 1: 二分探索による分割位置の選定

### 配列全体の長さ `(m + n + 1) // 2 = 2`

中央値は「左側2個、右側1個」に分かれるような分割を探す。

---

### ✅ Step 1.1：partitionX = 1（nums1を1個で分ける）

```
nums1 = [1 | 3]
nums2 = [ | 2]  ← partitionY = 2 - 1 = 1

nums2 = [2]
        [2 | ]
```

* maxLeftX = 1
* minRightX = 3
* maxLeftY = 2
* minRightY = +∞（右側が空）

### ✅ 条件チェック

```
maxLeftX (1) <= minRightY (∞) ✔
maxLeftY (2) <= minRightX (3) ✔
```

→ 条件クリア！ここが正しい分割。

---

### 🎯 中央値の求め方（奇数）

合計要素数が奇数なので、中央値は：

```
max(maxLeftX, maxLeftY) = max(1, 2) = 2
```

---

### ✅ 図で表すと：

```
配列統合 = [1, 2, 3]
              ↑
            中央値 = 2
```

---

## 🧮 別パターン：nums1 = \[1, 2], nums2 = \[3, 4]

合計要素数 = 4（偶数）

---

### Step 1.1: partitionX = 1

```
nums1 = [1 | 2]
nums2 = [3 | 4]

maxLeftX = 1
minRightX = 2
maxLeftY = 3
minRightY = 4

条件: maxLeftX (1) <= minRightY (4) ✔
     maxLeftY (3) <= minRightX (2) ✘
```

→ 左のY側が大きすぎる → Xの分割を増やす。

---

### Step 1.2: partitionX = 2

```
nums1 = [1, 2 | ]
nums2 = [ | 3, 4]

maxLeftX = 2
minRightX = ∞
maxLeftY = -∞
minRightY = 3

条件: maxLeftX (2) <= minRightY (3) ✔
     maxLeftY (-∞) <= minRightX (∞) ✔
```

→ 正しい分割！

---

### 🎯 中央値の求め方（偶数）

```
(max(maxLeftX, maxLeftY) + min(minRightX, minRightY)) / 2
= (max(2, -∞) + min(∞, 3)) / 2 = (2 + 3) / 2 = 2.5
```

---

### ✅ 図で表すと：

```
配列統合 = [1, 2, 3, 4]
                  ↑↑
             中央2要素 → (2 + 3) / 2 = 2.5
```

---

## 🔄 全体の処理フローまとめ

```txt
1. nums1 を短い方の配列にする。
2. nums1 の中で二分探索開始（partitionX を探す）。
3. partitionX が決まると partitionY も決まる。
4. maxLeftX, minRightX, maxLeftY, minRightY を求める。
5. 以下の条件で分割の正しさを判断：
    - maxLeftX <= minRightY
    - maxLeftY <= minRightX
6. 条件を満たせば中央値を計算：
    - 奇数 → max(maxLeftX, maxLeftY)
    - 偶数 → (max(maxLeftX, maxLeftY) + min(minRightX, minRightY)) / 2
7. 条件に合わなければ、partitionX を動かして再探索。
```

---

## ✍️ 補足：図でまとめた概念図（抽象）

```
nums1:       A1_left | A1_right
nums2:       A2_left | A2_right

条件:
  max(A1_left) <= min(A2_right)
  max(A2_left) <= min(A1_right)

中央値:
  奇数 → max(max(A1_left), max(A2_left))
  偶数 → (max(max(A1_left), max(A2_left)) + min(min(A1_right), min(A2_right))) / 2
```

---

以下では、Python (CPython 3.11.4) を用いて定義された `swapPairs` 関数について、**図解付きで各処理をステップごとに分解・解析**します。

---

## 🎯 問題概要

与えられた **単方向連結リスト**に対し、**隣接するノードを 2 つずつスワップ**し、新たなリストの先頭を返す。

---

## ✅ 処理概要コード（抜粋）

```python
dummy = ListNode(0)
dummy.next = head
prev = dummy

while prev.next and prev.next.next:
    first = prev.next
    second = first.next

    first.next = second.next
    second.next = first
    prev.next = second

    prev = first

return dummy.next
```

---

## 🧠 処理ステップごとの図解解析

### 🔹 ステップ 0：初期状態

#### 入力:

```
head = [1] -> [2] -> [3] -> [4] -> None
```

### 🔹 ステップ 1：ダミーノードの導入

```python
dummy = ListNode(0)
dummy.next = head
```

#### 構造:

```
dummy -> [0] -> [1] -> [2] -> [3] -> [4] -> None
             ↑     ↑
           prev   head
```

* `dummy` を使うことで、先頭を入れ替える場合でもロジックが簡潔になります。
* `prev` はスワップ対象ペアの **直前ノード** を指す。

---

### 🔹 ステップ 2：1回目のスワップ

```python
first = prev.next         # first: [1]
second = first.next       # second: [2]

first.next = second.next  # [1] → [3]
second.next = first       # [2] → [1]
prev.next = second        # [0] → [2]
```

#### 構造（変更前）:

```
[0] -> [1] -> [2] -> [3] -> [4]
```

#### 構造（変更後）:

```
[0] -> [2] -> [1] -> [3] -> [4]
       ↑     ↑
     prev  first
```

* `first.next` を `second.next` に変更
* `second.next` を `first` に変更
* `prev.next` を `second` に変更

---

### 🔹 ステップ 3：次のペアへ進める

```python
prev = first  # [1]
```

#### 現在のリスト構造:

```
[0] -> [2] -> [1] -> [3] -> [4]
                  ↑     ↑
                prev  next swap
```

---

### 🔹 ステップ 4：2回目のスワップ

```python
first = prev.next        # [3]
second = first.next      # [4]

first.next = second.next # [3] → None
second.next = first      # [4] → [3]
prev.next = second       # [1] → [4]
```

#### 構造（変更前）:

```
[0] -> [2] -> [1] -> [3] -> [4] -> None
```

#### 構造（変更後）:

```
[0] -> [2] -> [1] -> [4] -> [3] -> None
```

---

### 🔹 ステップ 5：終了

次のノードが存在しないため `while prev.next and prev.next.next:` の条件が満たされずループ終了。

```python
return dummy.next
```

#### 最終出力:

```
[2] -> [1] -> [4] -> [3] -> None
```

---

## ⏱️ 処理時間・メモリ計算

| 項目    | 計算量                  |
| ----- | -------------------- |
| 時間計算量 | `O(n)` （n = ノード数）    |
| 空間計算量 | `O(1)` （定数メモリ）       |
| 破壊的処理 | ✅ ノードの値は変更せず、リンクのみ変更 |

---

## 🔁 処理フロー図まとめ（各ステップ）

```
[0] -> [1] -> [2] -> [3] -> [4]
↓        ↓      ↓
prev   first  second

Step1 Swap:
[0] -> [2] -> [1] -> [3] -> [4]

Step2 Swap:
[0] -> [2] -> [1] -> [4] -> [3]
```

---

## ✅ 補足：境界ケースへの対応

* `head = None` → `dummy.next = None`
* `head = [1]` → `prev.next.next = None` ですぐ終了（スワップ不要）

---

ご希望があれば、同様の図解を **Typescript** や **JavaScript** 実装でも提示可能です。

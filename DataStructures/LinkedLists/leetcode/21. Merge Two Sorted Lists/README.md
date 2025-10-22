以下は、`mergeTwoLists` 関数の**処理フローを図解しながら具体的に解析・説明**します。

---

## 問題の再確認

与えられた2つのソート済み連結リスト

```
list1: 1 → 2 → 4
list2: 1 → 3 → 4
```

これらを一つのソート済みリストにマージします。

---

## 処理フロー（図解）

### 1️⃣ 初期化（dummyノード作成）

```ts
const dummy: ListNode = new ListNode(0);
let current: ListNode = dummy;
```

- **目的**：
    - マージしたリストの**先頭ノード操作を簡単にするためのダミーノード**を用意。
    - `current` は新しいリストの構築位置を示すポインタ。

```
dummy → 0 → null
          ↑
       current
```

---

### 2️⃣ メインループ（list1 と list2 を比較しながら結合）

#### **ループ1回目**

- `list1.val = 1`, `list2.val = 1` → 同値なので `list1` を選択

```
current.next → list1(1)

dummy → 0 → 1 → null
                  ↑
               current
```

`list1` を次に進めます → `list1 = list1.next`
`current` も次に進めます → `current = current.next`

---

#### **ループ2回目**

- `list1.val = 2`, `list2.val = 1` → `list2` を選択

```
current.next → list2(1)

dummy → 0 → 1 → 1 → null
                       ↑
                    current
```

`list2` を次に進めます
`current` も次に進めます

---

#### **ループ3回目**

- `list1.val = 2`, `list2.val = 3` → `list1` を選択

```
current.next → list1(2)

dummy → 0 → 1 → 1 → 2 → null
                              ↑
                           current
```

---

#### **ループ4回目**

- `list1.val = 4`, `list2.val = 3` → `list2` を選択

```
current.next → list2(3)

dummy → 0 → 1 → 1 → 2 → 3 → null
                                   ↑
                                current
```

---

#### **ループ5回目**

- `list1.val = 4`, `list2.val = 4` → 同値なので `list1` を選択

```
current.next → list1(4)

dummy → 0 → 1 → 1 → 2 → 3 → 4 → null
                                        ↑
                                     current
```

---

### 3️⃣ 残りのリストを接続

この時点で `list1` → `null`
`list2` → `4 → null` が残っています。

```ts
current.next = list2;
```

```
dummy → 0 → 1 → 1 → 2 → 3 → 4 → 4 → null
```

---

### 4️⃣ 結果返却

```ts
return dummy.next;
```

```
1 → 1 → 2 → 3 → 4 → 4 → null
```

---

## **全体図まとめ**

```
list1: 1 → 2 → 4
list2: 1 → 3 → 4

[マージ処理開始]

dummy: 0 → [1] → [1] → [2] → [3] → [4] → [4] → null

[最終結果]
1 → 1 → 2 → 3 → 4 → 4 → null
```

---

## **計算量とメモリの具体的解析**

| 項目           | 説明                                             |
| -------------- | ------------------------------------------------ |
| **時間計算量** | O(N + M)（list1とlist2の全ノードを1回ずつ操作）  |
| **空間計算量** | O(1)（`dummy`と`current`だけ追加。ノード再利用） |

---

## **なぜ dummy ノードを使うのか？**

### 問題点

リストの先頭が動的に変わる場合、**毎回先頭チェックが必要になり複雑になる**

### 解決策

ダミーノードを使えば、最初に仮のノードを1つ置くことで、
`current.next = ...` の操作を繰り返すだけで済みます。

---

## **まとめ**

- **再帰なし（スタックオーバーフロー無し）**
- **メモリ O(1)：実質ポインタ操作のみ**
- **ソート済みリストが保証されているからこの戦略が有効**

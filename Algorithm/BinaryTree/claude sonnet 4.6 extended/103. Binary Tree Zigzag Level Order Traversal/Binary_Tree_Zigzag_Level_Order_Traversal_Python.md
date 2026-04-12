> 🎯 **[algo-beginner スキル発火]**
> 言語/カテゴリ: Python (CPython 3.11.10)
> 適用ルールセット: 共通5ルール + Python固有4ルール
> 参照ファイル: references/common.md + references/python.md

---

# 1. 問題分析

> 💡 **この問題は一言で言うと**「二分木を階層ごとに読み取り、偶数階層は左→右、奇数階層は右→左と**交互にジグザグで**値を収集する問題」です。

## Pythonで解く際に特に気をつけるべきCPython特有の注意点

BFS（幅優先探索）の実装では **キューの先頭から要素を取り出す操作が頻繁に発生**します。`list.pop(0)` は先頭要素を取り出しますが、これは残り全要素を1つずつ左にシフトするため **O(n) のコスト**がかかります。CPythonの `collections.deque`（両端キュー）を使えば `popleft()` で **O(1)** を実現できます。ノード数が最大2000という制約でも、deque を使う習慣をつけることが Python で BFS を書く上での鉄則です。

## 競技プログラミング視点

- 全ノードを一度だけ訪問 → 時間計算量（＝処理にかかる手間の目安）**O(n)**
- 追加で使うメモリは各階層の値リスト + deque → 空間計算量 **O(n)**
- `deque.popleft()` で先頭取り出しを O(1) に保つ
- `list.reverse()` はインプレース操作（＝新しいリストを作らず元のリストを直接逆順にする操作）なので余計なメモリを使わない

## 業務開発視点

- `Optional[TreeNode]`（＝`TreeNode` または `None` のどちらかを表す型）で `root` の型を明示 → pylance（VSCodeの静的型チェッカー）がエラーを実行前に検出できる
- `root` が `None` のケースを最初にガード節（＝早期リターン）で弾く
- 各階層の「反転するかどうか」の判定ロジックを変数で分離し、意図を読みやすくする

## Python特有分析

| データ構造の選択    | 理由                                                       |
| ------------------- | ---------------------------------------------------------- |
| `collections.deque` | BFS のキュー。`popleft()` が O(1)（`list.pop(0)` は O(n)） |
| `list`              | 各階層の値収集用。末尾への `append` が O(1)                |
| `list.reverse()`    | ジグザグ反転。インプレース操作でメモリ節約                 |

> 📖 **このセクションで登場した用語**
>
> - **CPython**：最も広く使われる Python の実装。C言語で書かれており、`deque` などの組み込みデータ構造の操作がC言語レベルで高速に動く
> - **BFS（幅優先探索）**：木やグラフを「階層ごと」に左から右へ探索する方法。キューを使う
> - **インプレース操作**：新しいオブジェクトを作らず、既存のオブジェクトを直接書き換える操作。`list.reverse()` がその例
> - **O(1)**：入力の大きさに関わらず、常に一定の時間で済む操作（最速）
> - **ガード節**：関数の冒頭で特殊なケースをチェックし、すぐ `return` する書き方

---

# 2. 採用アルゴリズムと根拠

> 💡 同じ問題でも解き方は複数あります。Python では「**C実装の関数を使えるか**」と「**不要なメモリアロケーションが起きるか**」がパフォーマンスに大きく影響するため、その観点も含めて比較します。

| アプローチ                                 | 時間計算量 | 空間計算量 | Python実装コスト | 可読性 | 標準ライブラリ活用  | CPython最適化 | 備考                                           |
| ------------------------------------------ | ---------- | ---------- | ---------------- | ------ | ------------------- | ------------- | ---------------------------------------------- |
| **BFS + deque + reverse**                  | O(n)       | O(n)       | 低               | ★★★    | `collections.deque` | ✅ 適         | **採用**。最もシンプルで高速                   |
| BFS + deque + `collections.deque` 両端挿入 | O(n)       | O(n)       | 中               | ★★☆    | `collections.deque` | ✅ 適         | `appendleft` で挿入方向を制御。やや複雑        |
| DFS（再帰）+ 各階層に append               | O(n)       | O(n)+O(h)  | 中               | ★★☆    | なし                | ⚠️ 再帰コスト | 再帰深度がノード数に依存。CPython は再帰が遅い |
| list を使った BFS（pop(0) 使用）           | O(n²)      | O(n)       | 低               | ★★★    | なし                | ❌ 非最適     | `pop(0)` が O(n) で最悪 O(n²) になる           |

- **選択理由**: `deque` + `reverse()` はどちらもCPythonのC実装。Pythonインタープリタを介さずに処理されるため最速。コードの意図も「BFSで収集 → 奇数階層を逆順」と直読できて可読性も最高
- **DFSを選ばなかった理由**: CPythonのデフォルト再帰上限は1000。ノード数最大2000の制約では `sys.setrecursionlimit` が必要になり、スタックオーバーフローのリスクも残る
- **`pop(0)` を選ばなかった理由**: `list.pop(0)` はO(n)のコスト。全ノード分繰り返すと O(n²) になり、`deque` の使用と比べて明確に非効率

> 📖 **このセクションで登場した用語**
>
> - **時間計算量**：入力の大きさに対して処理にかかる手間がどう増えるかの目安
> - **空間計算量**：処理中に使うメモリ量がどう増えるかの目安
> - **C実装**：Python コードではなく、内部でC言語で実装された関数。Pure Python より大幅に高速
> - **再帰上限**：CPython はデフォルトで関数が1000回以上入れ子になるとエラー（RecursionError）を出す

---

# 3. 実装パターン

> 💡 **コードの大まかな構造（骨格）**
>
> 1. `root` が `None` なら空リストを即リターン（ガード節）
> 2. `deque` にルートノードを入れて BFS 開始
> 3. 各階層のノード数を固定し、全ノードを取り出して値を収集・子を deque に追加
> 4. `len(result) % 2 == 1` が奇数なら `.reverse()` で逆順にする
> 5. 全階層の結果リストを返す

---

## 【業務開発版を使う場面】

チームで長期間メンテナンスするプロダクションコードに向きます。型ヒントと docstring を充実させることで、後から読んだ人がコードの意図を理解しやすくなります。pylance による静的型チェックも通るため、実行前にバグを検出できます。

```python
from collections import deque
from typing import Optional


class Solution:
    def zigzagLevelOrder(self, root: Optional[TreeNode]) -> list[list[int]]:
        """
        二分木のジグザグレベルオーダー走査を返す。

        Args:
            root: 二分木のルートノード（None の場合は空ツリー）

        Returns:
            各階層の値リストを格納した 2次元リスト。
            偶数階層は左→右、奇数階層は右→左の順。

        Complexity:
            Time:  O(n) - 全ノードを一度だけ訪問
            Space: O(n) - deque と結果リストの合計
        """
        # ── ガード節 ─────────────────────────────────────────────
        # root が None（空ツリー）なら即座に空リストを返す。
        # 後続の処理でノード属性にアクセスして AttributeError が起きるのを防ぐ。
        if root is None:
            return []

        # ── 結果格納用リストの初期化 ──────────────────────────────
        # 各階層の値リストを順に格納していく。最終的にこれを返す。
        result: list[list[int]] = []

        # ── deque（両端キュー）の初期化 ──────────────────────────
        # BFS のキューには必ず collections.deque を使う。
        # list.pop(0) は先頭を取り出すたびに残り全要素を左シフトするため O(n) のコスト。
        # deque.popleft() は C実装 で O(1)。全ノード分繰り返すと差は歴然になる。
        queue: deque[TreeNode] = deque([root])

        # ── BFS メインループ ──────────────────────────────────────
        # queue が空になるまで繰り返す。
        # 「queue が空 = 未処理のノードがなくなった」ことを意味する。
        while queue:

            # 現在の階層にいるノード数を「今」確定させる。
            # ループ中に子ノードを queue に追加していくので、
            # 「今の階層のノード数」をループ開始時点で固定しておかないと
            # 次の階層のノードまで同じ階層として処理してしまう。
            level_size: int = len(queue)

            # この階層のノード値を格納する一時リスト。
            # あらかじめサイズが分かっているので list を選択（deque より高速）。
            level_values: list[int] = []

            # ── 現在の階層を全て処理する ──────────────────────────
            for _ in range(level_size):

                # queue の先頭からノードを取り出す。
                # deque.popleft() は O(1)。list.pop(0) と違ってシフト操作が発生しない。
                node: TreeNode = queue.popleft()

                # 現在ノードの値を収集する。
                # ジグザグ処理は後でまとめて行うため、ここでは単純に追加。
                # list.append() は O(1)（C実装）のため高速。
                level_values.append(node.val)

                # 左の子ノードが存在すれば次の階層用に queue の末尾に追加する。
                # Python の if は None・0・空リストなどを False と判定するが、
                # TreeNode は自前クラスなのでここでは `is not None` で明示的にチェック。
                if node.left is not None:
                    queue.append(node.left)

                # 右の子ノードも同様に queue の末尾に追加する。
                if node.right is not None:
                    queue.append(node.right)

            # ── ジグザグ処理（偶奇による方向切り替え）────────────
            # len(result) は「今まで完了した階層数」と等しい。
            #   len(result) が偶数（0, 2, 4…）→ 左→右（そのまま）
            #   len(result) が奇数（1, 3, 5…）→ 右→左（逆順）
            #
            # 最適化前（新しいリストを作る方法）:
            #   level_values = level_values[::-1]  ← 新しいリストを生成するため O(k) のアロケーション発生
            #
            # 最適化後（インプレース操作）:
            #   level_values.reverse()  ← 同じリストを直接逆順にする。新しいリストを作らないので高速
            #
            # なぜ reverse() が速いか: C言語実装のインプレース操作。
            # メモリアロケーション（＝新しいメモリ領域を確保する操作）が発生しない。
            if len(result) % 2 == 1:
                level_values.reverse()

            # 処理済み階層の値リストを最終結果に追加する。
            result.append(level_values)

        # 全階層を処理した結果を返す。
        return result
```

---

## 【競技プログラミング版を使う場面】

LeetCode など制限時間内に正解を出すことが目的のコードに向きます。型ヒントを最小限に抑え、エラーハンドリングを省略した上でロジックを短く書いています。

### 非推奨: 誤例（コピー禁止）

> ⚠️ **競技版の補足**: 下記の内包表記版は `queue.popleft()` で値を取り出してしまうため子ノードの追加が別途必要であり、未完成のままでは動作しません。実際の提出では業務版のコードがそのままシンプルで使いやすいため、競技の場でも業務版を推奨します。

```python
from collections import deque
from typing import Optional


class Solution:
    def zigzagLevelOrder(self, root: Optional[TreeNode]) -> list[list[int]]:
        # root が None なら即リターン
        if not root:
            return []

        result, queue = [], deque([root])

        while queue:
            # 今の階層のノード数を固定して値を収集
            level = [queue.popleft().val for _ in range(len(queue))]
            # 奇数階層（result に奇数個が溜まっているとき）は逆順
            if len(result) % 2 == 1:
                level.reverse()
            result.append(level)

            # 子ノードを追加（内包表記で手短に書く）
            # ※この版では子の追加を別途行う必要がある（下記参照）

        return result
```

---

# 4. 動作トレース

入力: `root = [3, 9, 20, null, null, 15, 7]`

```
【ツリーの形状】
        3          ← 階層 0（len(result)=0 → 偶数 → 左→右）
       / \
      9   20       ← 階層 1（len(result)=1 → 奇数 → 右→左）
         /  \
        15   7     ← 階層 2（len(result)=2 → 偶数 → 左→右）

┌──────────────────────────────────────────────────────────────┐
│ 初期状態                                                      │
│   queue   = deque([Node(3)])                                  │
│   result  = []                                                │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ Step 1: 階層 0 の処理（len(result)=0 → 偶数 → そのまま）      │
│                                                              │
│   level_size = 1                                             │
│   ─ popleft() → Node(3) を取り出す                           │
│       val=3 → level_values = [3]                             │
│       left=Node(9)  → queue.append(Node(9))                  │
│       right=Node(20) → queue.append(Node(20))                │
│                                                              │
│   len(result)=0 → 偶数 → reverse() しない                    │
│   result.append([3])                                         │
│                                                              │
│   queue  = deque([Node(9), Node(20)])                        │
│   result = [[3]]                                             │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ Step 2: 階層 1 の処理（len(result)=1 → 奇数 → 逆順）         │
│                                                              │
│   level_size = 2                                             │
│   ─ popleft() → Node(9)  → level_values = [9]               │
│       left=None, right=None → queue への追加なし             │
│   ─ popleft() → Node(20) → level_values = [9, 20]           │
│       left=Node(15) → queue.append(Node(15))                 │
│       right=Node(7)  → queue.append(Node(7))                 │
│                                                              │
│   len(result)=1 → 奇数 → level_values.reverse()             │
│   level_values = [20, 9]（インプレースで変更・メモリ節約）    │
│   result.append([20, 9])                                     │
│                                                              │
│   queue  = deque([Node(15), Node(7)])                        │
│   result = [[3], [20, 9]]                                    │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ Step 3: 階層 2 の処理（len(result)=2 → 偶数 → そのまま）      │
│                                                              │
│   level_size = 2                                             │
│   ─ popleft() → Node(15) → level_values = [15]              │
│   ─ popleft() → Node(7)  → level_values = [15, 7]           │
│       全て子なし → queue への追加なし                         │
│                                                              │
│   len(result)=2 → 偶数 → reverse() しない                    │
│   result.append([15, 7])                                     │
│                                                              │
│   queue  = deque([])  ← 空!                                  │
│   result = [[3], [20, 9], [15, 7]]                           │
└──────────────────────────────────────────────────────────────┘

✅ while queue: → queue が空 → ループ終了
🎉 最終出力: [[3], [20, 9], [15, 7]]
```

---

# Python最適化ポイント まとめ

```python
# ❌ 最適化前：list.pop(0) は O(n)
queue = [root]
node = queue.pop(0)   # 残り全要素をシフトするため遅い

# ✅ 最適化後：deque.popleft() は O(1)
from collections import deque
queue = deque([root])
node = queue.popleft()  # C実装・シフト操作なし
# なぜ速いか: deque は内部的に双方向リンクリストで実装されており、
#            先頭要素の取り出しにシフト操作が不要。C言語レベルで処理される。

# ❌ 最適化前：スライスで新しいリストを作る
level_values = level_values[::-1]  # 新しいリストをアロケーション

# ✅ 最適化後：インプレース操作で既存リストを逆順にする
level_values.reverse()  # 新しいリストを作らない。C実装で高速。
# なぜ速いか: メモリアロケーションが発生しない。同じリストを直接書き換えるだけ。
```

> 📖 **このセクションで登場した用語**
>
> - **`collections.deque`**：前からも後ろからも O(1) で追加・取り出しができる「両端開きの箱」。`list` の先頭操作（O(n)）と比べて BFS のキューに最適
> - **`popleft()`**：`deque` の先頭要素を O(1) で取り出すメソッド。`list.pop(0)` の O(n) と対比される
> - **`list.reverse()`**：リストをインプレースで逆順にする C実装メソッド。スライス `[::-1]` より速くメモリ節約にもなる
> - **インプレース操作**：新しいオブジェクトを作らず、既存のオブジェクトを直接書き換える操作。メモリアロケーションが発生しない
> - **`Optional[TreeNode]`**：`TreeNode` または `None` のどちらかであることを表す型ヒント。pylance が `None` の可能性を検出してくれる
> - **ガード節**：関数の先頭で特殊ケースをチェックし `return` する書き方。後続の処理をシンプルに保てる
> - **メモリアロケーション**：新しいメモリ領域を動的に確保する操作。頻繁に発生すると速度が落ちる

## バグの精査

競技プログラミング版の問題箇所を特定します。

```python
# ❌ バグのあるコード
while queue:
    level = [queue.popleft().val for _ in range(len(queue))]  # ← 問題1 & 2
```

**問題1：子ノードをキューに追加していない**
内包表記の中で `popleft()` でノードを取り出していますが、そのノードの `.left` / `.right` を `queue` に追加する処理が**完全に抜け落ちています**。次の階層のノードがキューに入らないため、ルートと第1階層しか処理されません。

**問題2：`len(queue)` の評価タイミング**
`range(len(queue))` は内包表記の**開始時点**で一度だけ評価されます。しかし問題1のせいで子が追加されないため、2テストケース目以降（第2階層以降が存在する木）で誤った結果になります。

---

## 修正版

```python
# Runtime 0 ms
# Beats 100.00%
# Memory 19.45 MB
# Beat 60.53%

from collections import deque
from typing import Optional


class Solution:
    def zigzagLevelOrder(self, root: Optional[TreeNode]) -> list[list[int]]:
        # root が None なら即リターン（空ツリーのガード節）
        if not root:
            return []

        # result: 全階層の結果、queue: BFS 用の両端キュー
        result: list[list[int]] = []
        queue: deque[TreeNode] = deque([root])

        while queue:
            # 現在の階層のノード数を先に固定する。
            # ここで固定しないと、子を追加するたびに len(queue) が変わり
            # 「今の階層」と「次の階層」の境界が崩れてしまう。
            level_size = len(queue)
            level: list[int] = []

            for _ in range(level_size):
                # popleft() は deque の先頭を O(1) で取り出す（list.pop(0) の O(n) と違う）
                node = queue.popleft()
                level.append(node.val)

                # ✅ 修正箇所：子ノードを必ずキューに追加する
                # 元の競技版ではここが丸ごと抜けていたため
                # 第2階層以降が処理されなかった。
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)

            # 奇数階層（result に奇数個溜まっているとき）は逆順にする。
            # reverse() はインプレース操作なので新しいリストを作らず高速。
            if len(result) % 2 == 1:
                level.reverse()

            result.append(level)

        return result
```

---

## 動作トレース（修正版での確認）

入力: `root = [3, 9, 20, null, null, 15, 7]`

```
初期状態: queue = deque([Node(3)])、result = []

─ Step 1: 階層 0（len(result)=0 → 偶数 → そのまま）─────────────
  level_size = 1
  ループ1回目:
    popleft() → Node(3)、level = [3]
    ✅ Node(9)  を queue に追加
    ✅ Node(20) を queue に追加
  reverse しない → result = [[3]]
  queue = deque([Node(9), Node(20)])

─ Step 2: 階層 1（len(result)=1 → 奇数 → 逆順）────────────────
  level_size = 2
  ループ1回目:
    popleft() → Node(9)、level = [9]
    子なし → queue 変化なし
  ループ2回目:
    popleft() → Node(20)、level = [9, 20]
    ✅ Node(15) を queue に追加
    ✅ Node(7)  を queue に追加
  reverse() → [20, 9] → result = [[3], [20, 9]]
  queue = deque([Node(15), Node(7)])

─ Step 3: 階層 2（len(result)=2 → 偶数 → そのまま）────────────
  level_size = 2
  ループ1回目: popleft() → Node(15)、level = [15]
  ループ2回目: popleft() → Node(7)、 level = [15, 7]
  reverse しない → result = [[3], [20, 9], [15, 7]]
  queue = deque([])  ← 空

✅ while queue: が False → ループ終了
🎉 出力: [[3], [20, 9], [15, 7]]
```

---

## 業務版との差分まとめ

| 観点          | 業務開発版                                        | 修正後の競技版                             |
| ------------- | ------------------------------------------------- | ------------------------------------------ |
| 型ヒント      | `deque[TreeNode]`・`list[list[int]]` など完全付与 | `result`・`queue` のみ付与（pylance 対応） |
| null チェック | `is not None` で明示的                            | `if node.left:` で省略形                   |
| docstring     | あり（Args / Returns / Complexity）               | なし                                       |
| ロジック      | 完全同一 ✅                                       | 完全同一 ✅                                |

> 📖 **このセクションで登場した用語**
>
> - **インプレース操作**：新しいオブジェクトを作らず元のオブジェクトを直接書き換える操作。`list.reverse()` がその例でメモリ節約になる
> - **ガード節**：関数の先頭で特殊ケースをチェックし即 `return` する書き方。後続の処理をシンプルに保てる
> - **`deque.popleft()`**：先頭要素を O(1) で取り出す操作。`list.pop(0)` の O(n) と対比される

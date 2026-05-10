> 🎯 **[algo-beginner スキル発火]**
> 言語/カテゴリ: Python (CPython 3.11.10)
> 適用ルールセット: 共通5ルール + Python固有ルール
> 参照ファイル: references/common.md + references/python.md

---

# 🌳 Minimum Depth of Binary Tree — Python 完全解説

---

## 1. 問題分析結果

> 💡 **一言で言うと**：「木の根から最も近い"末端ノード（葉）"までの、最短の道のり（ノード数）を求める問題」です。

### ⚠️ Python/CPython 特有の注意点（最初に確認）

BFS（幅優先探索）の実装では、Python標準リスト `list` の `pop(0)` を使いたくなりますが、**リストの先頭削除は O(n) のコスト**がかかります（全要素を1つずつ左にずらすため）。代わりに `collections.deque`（デック）の `popleft()` を使うことで O(1) に改善できます。ノード数が最大 `10^5` の場合、この差は無視できません。また、再帰（DFS）を使う場合は Python のデフォルト再帰深度制限（`sys.getrecursionlimit()` = 1000）に注意が必要です。

---

### 競技プログラミング視点

- **制約分析**：ノード数は最大 `10^5`。O(n) のアルゴリズムで十分
- **最速手法**：BFS で最初の葉を見つけた瞬間に即 `return`（早期終了）
- **メモリ最小化**：`deque` を使いキューのサイズを木の幅に抑える
- **CPython最適化**：`collections.deque` は C 実装。`popleft()` が O(1) でリストより大幅に速い

### 業務開発視点

- **型安全設計**：`Optional[TreeNode]` を正しく使い、pylance エラーが出ないようにする
- **エラーハンドリング**：`root` が `None` のケース（空の木）を先に処理する
- **可読性**：BFS の「なぜこう書くか」をコメントで明示する

### Python特有分析

| 観点                    | 採用           | 理由                                       |
| ----------------------- | -------------- | ------------------------------------------ |
| `collections.deque`     | ✅             | `popleft()` が O(1)。`list.pop(0)` は O(n) |
| 再帰（DFS）             | 参考として提示 | 深い木で再帰制限リスクあり                 |
| `sys.setrecursionlimit` | 競技版で考慮   | デフォルト1000を超える木に対応             |

> 📖 **このセクションで登場した用語**
>
> - **CPython**：最も広く使われるPythonの実装。C言語で書かれており、`deque`などの組み込みデータ構造がC実装のため高速
> - **O(n)**：ノード数が2倍になると処理も約2倍になること
> - **GIL**：Pythonスレッドが同時に実行されないようにするロック機構。今回はシングルスレッドなので影響なし
> - **再帰深度制限**：Pythonが再帰呼び出しを許可する最大回数。デフォルトは1000回

---

## 2. 採用アルゴリズムと根拠

> 💡 同じ問題でも解き方は複数あります。「速さ」「メモリ」「Pythonとの相性」の3軸で比べて最適なものを選びます。

| アプローチ        | 時間計算量 | 空間計算量 | Python実装コスト | 可読性 | 標準ライブラリ活用           | CPython最適化    | 備考                     |
| ----------------- | ---------- | ---------- | ---------------- | ------ | ---------------------------- | ---------------- | ------------------------ |
| **BFS（deque）**  | O(n)       | O(w)※1     | 低               | ★★★    | `collections.deque`（C実装） | ◎ 適             | **採用**：早期終了で最速 |
| DFS 再帰          | O(n)       | O(h)※2     | 最低             | ★★★    | なし                         | △ 深い木でリスク | 再帰制限に注意           |
| DFS 反復（stack） | O(n)       | O(h)       | 低               | ★★☆    | `list`（スタック代用）       | △                | 全葉を確認が必要         |

※1 `w` = 木の最大幅（完全二分木では O(n/2)）
※2 `h` = 木の高さ（最悪 O(n)、平均 O(log n)）

**選択理由**：「最短深さ」を求める問題では **BFS が自然に最適**です。BFS は浅い層から順に探索するため、最初に葉を見つけた瞬間にそれが確実に最短距離です。DFS（再帰）は全葉を確認してから比較するため、BFS の早期終了の恩恵がありません。さらに `collections.deque` は C 実装なので、Pure Python のリストより `popleft()` が大幅に高速です。

> 📖 **このセクションで登場した用語**
>
> - **BFS（幅優先探索）**：木を「浅い順・横に広がる順」に探索する方法。キュー（FIFO）を使う
> - **DFS（深さ優先探索）**：木を「根から葉まで一本道に深く潜る」方法。再帰またはスタックを使う
> - **collections.deque**：前からも後ろからも O(1) で出し入れできる「両端開きの箱」。C実装のため`list`より高速
> - **早期終了**：答えが確定した瞬間にループを抜けること。不要な処理をスキップして高速化できる

---

## 3. 実装パターン

> 💡 **コードの大まかな骨格**
>
> 1. `root` が `None`（空の木）なら即 `0` を返す
> 2. `deque` にルートノードと深さ `1` を入れてBFS開始
> 3. キューから取り出し → 葉なら即 `return`、子があればキューに追加
> 4. （到達しないが）全探索後のフォールバック

---

### 【業務開発版を使う場面】

チームで長期間メンテナンスするプロダクションコードに向きます。型ヒントと `pylance` 対応、docstring、入力検証を完備しており、コードを初めて読む人でも意図が理解しやすい構造になっています。

```python
from typing import Optional
from collections import deque


# LeetCodeが提供するTreeNodeクラス（定義済みなので実際には不要）
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right


class Solution:
    def minDepth(self, root: Optional[TreeNode]) -> int:
        """
        二分木の最小深さ（根から最も近い葉までのノード数）を返す。

        アルゴリズム: BFS（幅優先探索）
        - deque を使いキューを O(1) で操作する
        - 最初に葉を見つけた時点で即 return（早期終了）

        Args:
            root: 二分木の根ノード。None の場合は空の木を意味する

        Returns:
            最小深さ（整数）。空の木の場合は 0。

        Raises:
            特に例外は発生しない（None は正常入力として処理する）

        Time Complexity:  O(n) — 最悪ケースで全ノードを1回ずつ処理
        Space Complexity: O(w) — w は木の最大幅（キューに同時に入る最大ノード数）
        """

        # ────────────────────────────────────────
        # エッジケース: 空の木（root が None）
        # 根がなければ「葉までの道」自体が存在しないため 0 を返す
        # ────────────────────────────────────────
        if root is None:
            return 0

        # ────────────────────────────────────────
        # BFS 用キューを初期化する
        # deque を使う理由：
        #   list の popleft() は O(n)（全要素を左にずらすコストが発生する）
        #   deque の popleft() は O(1)（ポインタを動かすだけで完結する）
        # タプル (ノード, 現在の深さ) でペアを管理し、深さを外部変数で持たずに済ませる
        # ────────────────────────────────────────
        queue: deque[tuple[TreeNode, int]] = deque()
        queue.append((root, 1))  # 根ノードは深さ1からスタート

        # ────────────────────────────────────────
        # キューが空になるまでBFSを続ける
        # ────────────────────────────────────────
        while queue:

            # キューの先頭からノードと深さを取り出す
            # popleft() で FIFO（先入れ先出し）を実現 → 浅い順に処理される
            node, depth = queue.popleft()

            # ────────────────────────────────────
            # 葉ノード判定: 左も右も子がない = 葉
            # BFS は浅い順に処理するため、最初に見つかった葉が
            # 必ず最小深さを持つ → 即 return できる
            # ────────────────────────────────────
            if node.left is None and node.right is None:
                return depth  # 🎯 最小深さ確定

            # 左の子が存在する場合のみキューに追加
            # None の子を追加すると後で NullPointerError 相当のバグになるため
            # ここで必ずチェックする
            if node.left is not None:
                queue.append((node.left, depth + 1))

            # 右の子が存在する場合のみキューに追加（左と同様の理由）
            if node.right is not None:
                queue.append((node.right, depth + 1))

        # ────────────────────────────────────────
        # ここには通常到達しない
        # root が None でない有効な木なら必ず葉が存在するため
        # pylance に「int を返す」ことを保証するためのフォールバック
        # ────────────────────────────────────────
        return 0
```

---

### 動作トレース（業務開発版）

#### Example 1: `root = [3,9,20,null,null,15,7]`

```
         3
        / \
       9   20
          /  \
         15    7

初期状態:
  queue = deque([ (Node(3), 1) ])

─── ループ1回目 ───
  popleft() → (Node(3), depth=1)
  Node(3).left  = Node(9)  → null でない
  Node(3).right = Node(20) → null でない
  → 葉でない（両方に子がいる）
  queue に追加: (Node(9), 2), (Node(20), 2)
  queue = deque([ (Node(9),2), (Node(20),2) ])

─── ループ2回目 ───
  popleft() → (Node(9), depth=2)
  Node(9).left  = None
  Node(9).right = None
  → 🎯 両方 None = 葉ノード！ return 2

Answer: 2 ✅
```

#### Example 2: `root = [2,null,3,null,4,null,5,null,6]`（⚠️ 罠あり）

```
  2
   \
    3
     \
      4
       \
        5
         \
          6  ← 唯一の葉

─── ループ1回目 ───
  popleft() → (Node(2), depth=1)
  Node(2).left  = None  ← None だが...
  Node(2).right = Node(3)  ← 右の子がある！
  → ⚠️ 罠：left が None でも right がいるので葉ではない
  → left は追加しない、right だけ追加
  queue = deque([ (Node(3), 2) ])

─── ループ2〜5回目（同様に繰り返し）───
  Node(3) → right=Node(4) → 葉でない、深さ3追加
  Node(4) → right=Node(5) → 葉でない、深さ4追加
  Node(5) → right=Node(6) → 葉でない、深さ5追加

─── ループ6回目 ───
  popleft() → (Node(6), depth=5)
  Node(6).left  = None
  Node(6).right = None
  → 🎯 葉ノード発見！ return 5

Answer: 5 ✅
```

---

### 【競技プログラミング版を使う場面】

LeetCode・AtCoder など制限時間内に正解を出すことが目的のコードに向きます。型ヒントや docstring は最小限にし、コードの短さと実行速度を優先した書き方になっています。

```python
from typing import Optional
from collections import deque


class Solution:
    def minDepth(self, root: Optional[TreeNode]) -> int:
        # 空の木は深さ0
        if not root:
            return 0

        # deque でキューを初期化（popleft が O(1) のため list より高速）
        q: deque[tuple[TreeNode, int]] = deque([(root, 1)])

        while q:
            node, d = q.popleft()

            # 葉ノード発見 → 即 return（BFS なのでこれが最小深さ）
            if not node.left and not node.right:
                return d

            # 子を追加（None は追加しない）
            if node.left:
                q.append((node.left, d + 1))
            if node.right:
                q.append((node.right, d + 1))

        return 0  # pylance 用フォールバック（実際には到達しない）
```

---

### 参考：DFS 再帰版（可読性最高・競技向け）

> **DFS 再帰版を使う際の注意**：Python のデフォルト再帰深度は `1000` です。直線状の木（例2のような木）でノード数が 1000 を超えると `RecursionError` が発生します。LeetCode では制約上ノード数が最大 `10^5` なので、**競技版でもBFS推奨**です。参考として示します。

```python
from typing import Optional


class Solution:
    def minDepth(self, root: Optional[TreeNode]) -> int:
        # ベースケース: 木が空なら深さ0
        if root is None:
            return 0

        # ────────────────────────────────────────
        # 重要な罠：片方が None のノードは葉ではない
        # 左が None → 左方向に葉はない → 右だけ再帰する
        # ────────────────────────────────────────
        if root.left is None:
            # 左の子がないので右方向のみ探索し、自分自身の分(+1)を足す
            return 1 + self.minDepth(root.right)

        if root.right is None:
            # 右の子がないので左方向のみ探索し、自分自身の分(+1)を足す
            return 1 + self.minDepth(root.left)

        # 両方の子が存在する場合: 両方探索して小さい方 + 自分自身の1
        return 1 + min(self.minDepth(root.left), self.minDepth(root.right))
```

---

## 4. 検証

> 💡 エッジケースのテストは、アルゴリズムが「ふつうの入力」だけでなく「極端な入力」でも正しく動くかを確かめるためのものです。

| ケース              | 入力                      | 期待値 | 理由                    |
| ------------------- | ------------------------- | ------ | ----------------------- |
| 空の木              | `root = None`             | `0`    | 根がなければ葉もない    |
| 根のみ（ノード1つ） | `root = [1]`              | `1`    | 根自体が葉              |
| 左偏り木            | `[1, 2, null, 3]`         | `3`    | 右がないので左のみ      |
| 右偏り木（直線）    | `[2,null,3,null,4]`       | `3`    | 全ノードが一直線        |
| 完全二分木          | `[3,9,20,null,null,15,7]` | `2`    | 深さ2の葉が最短         |
| 最大制約            | ノード数 `10^5`           | —      | TLE・MLE が起きないこと |

> 📖 **このセクションで登場した用語**
>
> - **エッジケース**：空のツリー・ノード1つ・直線状の木など、境界的な条件のこと
> - **RecursionError**：再帰の呼び出し回数が `sys.getrecursionlimit()`（デフォルト1000）を超えたときに発生するエラー
> - **TLE（Time Limit Exceeded）**：制限時間超過。計算量が大きすぎると発生する
> - **MLE（Memory Limit Exceeded）**：メモリ制限超過。大きなデータ構造を持ちすぎると発生する
> - **フォールバック**：「本来は到達しないが念のため書いておく処理」。pylance の型チェックを通すためにも必要

---

## まとめ

| 観点                  | 内容                                                                     |
| --------------------- | ------------------------------------------------------------------------ |
| **問題の本質**        | 根から最も近い葉までの最短ノード数                                       |
| **最大の罠**          | 片方の子が `None` のノードは「葉」ではない                               |
| **採用手法**          | BFS（`collections.deque` で O(1) popleft）                               |
| **時間計算量**        | O(n)：最悪ケースで全ノード探索                                           |
| **空間計算量**        | O(w)：キューの最大サイズは木の最大幅                                     |
| **Python のポイント** | `list.pop(0)` ではなく `deque.popleft()` を使うことで O(n) → O(1) に改善 |

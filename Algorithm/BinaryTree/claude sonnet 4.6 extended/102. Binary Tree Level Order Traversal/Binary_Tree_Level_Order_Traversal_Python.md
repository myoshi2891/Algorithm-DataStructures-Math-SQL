> 🎯 **[algo-beginner スキル発火]**
> 言語/カテゴリ: Python
> 適用ルールセット: 共通5ルール + Python固有5ルール
> 参照ファイル: references/common.md + references/python.md

---

# LeetCode 102 · Binary Tree Level Order Traversal — Python版（訂正済み完全版）

---

## 1. 問題分析結果

> 💡 **この問題は一言で言うと「木を上から下へ、同じ高さのノードをまとめてグループ化する問題」です。**

```
        3          ← 深さ0: [3]
       / \
      9  20        ← 深さ1: [9, 20]
         / \
        15   7     ← 深さ2: [15, 7]

出力: [[3], [9, 20], [15, 7]]
```

**Pythonで解く際のCPython特有の注意点：**
キューの実装には `list.pop(0)` ではなく **`collections.deque` の `popleft()`** を使うことが必須です。`list.pop(0)` は先頭要素を取り出した後、残り全要素を1つずつ前にずらす O(n) 操作ですが、`deque.popleft()` はC言語実装の双方向連結リスト（＝各要素が「前の要素」と「次の要素」へのポインタを持つ構造）のため O(1) で済みます。また今回の訂正の核心として、**`val` が `0` のとき `or` トリックが壊れる**という落とし穴があります。制約が `-1000 <= val <= 1000` なので `0` は普通に登場し、前回の競技版はこれで Wrong Answer になっていました。

---

### 競技プログラミング視点

- 入力サイズ ≤ 2000 なので O(n) あれば十分
- `deque` + BFS が最速・最シンプル
- **`val = 0` を含む制約**を必ず確認してから実装テクニックを選ぶ

### 業務開発視点

- `Optional[TreeNode]` で「ノードがあるかないか」を型で明示し、`None` 参照エラーを事前に防ぐ
- pylance（型チェッカー）がエラーを検出できるよう、戻り値の型まで明示する
- `is not None` を使うことでPEP8（＝Pythonの公式コーディング規約）に準拠した書き方になる

### Python特有分析

- `collections.deque`：C言語実装の双方向キュー。`popleft()` が O(1) で動く
- `vals.append(node.val)`：`append()` もC実装のため高速。`0` を含む全整数を正しく扱える
- `if node.left:` による子ノードの存在確認：`None` は falsy なので自然に弾ける

> 📖 **このセクションで登場した用語**
>
> - **CPython**：最も広く使われるPythonの実装。C言語で書かれており `deque` などもC実装のため高速
> - **falsy（フォールシー）**：Pythonで `if` の条件式が `False` 相当と見なされる値。`0`, `None`, `[]`, `""` などが該当する
> - **BFS（幅優先探索）**：グラフや木を「横方向に広がりながら」探索する方法
> - **PEP8**：Pythonの公式スタイルガイド。`== None` より `is None` / `is not None` を推奨している

---

## 2. 採用アルゴリズムと根拠

> 💡 同じ問題でも解き方は複数あります。Pythonでは「どのデータ構造がC実装で速いか」と「制約に `0` が含まれるか」が重要な選択基準です。

| アプローチ          | 時間計算量 | 空間計算量 | Python実装コスト | 可読性 | 標準ライブラリ活用  | CPython最適化        | 備考                       |
| ------------------- | ---------- | ---------- | ---------------- | ------ | ------------------- | -------------------- | -------------------------- |
| **BFS + `deque`**   | O(n)       | O(n)       | 低               | ★★★    | `collections.deque` | ✅ 適                | ✅ 今回の選択              |
| DFS（再帰）         | O(n)       | O(n)       | 中               | ★★☆    | なし                | △ 再帰オーバーヘッド | 深さ情報の引数管理が必要   |
| BFS + `list.pop(0)` | O(n²)      | O(n)       | 低               | ★★★    | なし                | ❌ 不適              | 先頭削除が O(n) になる     |
| BFS + `or` トリック | O(n)       | O(n)       | 低               | ★☆☆    | `collections.deque` | ✅ 適                | ❌ `val=0` で Wrong Answer |

**選択理由：**
`or` トリックを選ばなかった理由は、`0 or 式` は左辺が `0`（falsy）のとき右辺の `extend()` が評価され、その戻り値 `None` がリストに入ってしまうからです。`list.pop(0)` を選ばなかった理由は先頭削除が O(n) になるからです。**シンプルな `for` ループ + `append()` の組み合わせが最も安全かつ高速です。**

> 📖 **このセクションで登場した用語**
>
> - **`or` トリック**：`A or B` で「A が falsy なら B を評価する」性質を副作用のある処理に悪用するテクニック。`val=0` のような falsy な値が来ると壊れる
> - **`extend()`**：イテラブルの全要素をまとめて `deque` や `list` の末尾に追加するメソッド。戻り値は `None`
> - **O(n²)**：入力が2倍になると処理が約4倍になること。`list.pop(0)` をループの中で呼ぶと発生する

---

## 3. 実装パターン

> 💡 **コードの大まかな骨格**
>
> 1. `root` が `None` なら空リストを即返す
> 2. `deque` にルートを入れてBFS開始
> 3. ループ毎に「今の階のサイズ」を `len(queue)` で**変数に保存して固定**
> 4. その数だけ `popleft()` し、値を収集・子をキューに積む
> 5. 今の階の配列を結果リストに追加

---

### 【業務開発版を使う場面】

チームで長期間メンテナンスするプロダクションコードに向きます。型ヒントとエラーハンドリングを充実させることで、後から読んだ人が意図を理解しやすい構造になっています。pylanceによる静的解析が有効に機能します。

```python
from __future__ import annotations
from collections import deque
from typing import Optional


# LeetCode が提供する TreeNode 定義（提出時はそのまま使う）
# class TreeNode:
#     def __init__(
#         self,
#         val: int = 0,
#         left: Optional[TreeNode] = None,
#         right: Optional[TreeNode] = None,
#     ) -> None:
#         self.val = val
#         self.left = left
#         self.right = right


class Solution:
    """
    Binary Tree Level Order Traversal (LeetCode #102)

    BFS（幅優先探索）+ collections.deque を使って
    木を上から下へ階層ごとにグループ化して返す。
    """

    def levelOrder(self, root: Optional[TreeNode]) -> list[list[int]]:
        """
        二分木のレベル順トラバーサルを返す（業務開発版）

        Args:
            root: 二分木のルートノード（None の場合は空ツリー）

        Returns:
            各階層の値を格納した2次元リスト。
            空ツリーの場合は空リスト []。

        Complexity:
            Time:  O(n) — 各ノードを1回だけ処理する
            Space: O(n) — キューに最大で最下層のノード数が入る
        """
        # ────────────────────────────────────────────────────────────
        # ① root が None（空ツリー）のとき、即座に空リストを返す。
        #    Optional[TreeNode] 型のため、root に対して直接 .val 等を
        #    呼ぶと pylance がエラーを検出する。ここで None を弾くことで
        #    以降は TreeNode として扱える（型の絞り込み）。
        # ────────────────────────────────────────────────────────────
        if root is None:
            return []

        # ────────────────────────────────────────────────────────────
        # ② 結果を格納する2次元リスト
        #    result[0] = 深さ0の値リスト、result[1] = 深さ1の値リスト、...
        # ────────────────────────────────────────────────────────────
        result: list[list[int]] = []

        # ────────────────────────────────────────────────────────────
        # ③ collections.deque をキューとして使う。
        #    list.pop(0) は O(n) だが deque.popleft() は O(1)。
        #    deque はC言語で実装された双方向キューで
        #    先頭・末尾への追加・削除が常に高速。
        # ────────────────────────────────────────────────────────────
        queue: deque[TreeNode] = deque([root])

        # ────────────────────────────────────────────────────────────
        # ④ キューが空になるまでループ（= 全ノードを処理し終えるまで）
        # ────────────────────────────────────────────────────────────
        while queue:
            # 今この瞬間のキューの長さ = 「現在の階のノード数」。
            # ループ中に queue の長さは変化するため、変数に保存して固定する。
            # これが BFS で「1階ぶんをまとめて処理する」核心の1行。
            level_size: int = len(queue)

            # 今の階のノード値を格納する一時リスト
            level_values: list[int] = []

            for _ in range(level_size):
                # popleft() でキューの先頭ノードを O(1) で取り出す
                node: TreeNode = queue.popleft()

                # 取り出したノードの値を今の階の配列に追加する。
                # append() はC実装のため高速。
                # val が 0 の場合も正しく追加される（or を使わない理由）。
                level_values.append(node.val)

                # ── 次の階の準備：子ノードをキューの末尾に追加 ──
                # None チェックをしてから追加することで、
                # キューの中身が常に TreeNode 型であることを保証する。
                # これにより pylance の型エラーも防げる。
                if node.left is not None:
                    queue.append(node.left)
                if node.right is not None:
                    queue.append(node.right)

            # 今の階の値リストを結果に追加
            result.append(level_values)

        return result
```

---

### 【競技プログラミング版を使う場面】

LeetCode などで制限時間内に正解を出すことが目的のコードに向きます。型ヒントの最小化とコードの短縮を優先しつつ、**前回の `or` トリックによるバグを完全に排除**しています。`val = 0` を含む全テストケースで正しく動作します。

```python
# Runtime 0 ms
# Beats 100.00%
# Memory 19.92 MB
# Beats 70.45%

from collections import deque
from typing import Optional


class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> list[list[int]]:
        # root が None または存在しない場合は即座に空リストを返す。
        # `not root` は `root is None` と同等。
        # TreeNode の __bool__ は定義されていないため None チェックとして機能する。
        if not root:
            return []

        result: list[list[int]] = []

        # C実装の deque でキューを初期化。
        # popleft() が O(1) のためキューとして最適。
        queue: deque[TreeNode] = deque([root])

        while queue:
            # ── 今の階のサイズをループ前に固定する ──
            # ここが競技版でも絶対に省略できない核心部分。
            # ループ内で popleft()/append() が起きると queue の長さが変化するため、
            # 先に変数へ保存しておかないと「今の階」の範囲がずれる。
            level_size = len(queue)
            vals: list[int] = []

            for _ in range(level_size):
                # 先頭ノードを O(1) で取得
                node = queue.popleft()

                # val を直接 append する。
                # 前回の `node.val or extend(...)` トリックは
                # val=0 のとき 0（falsy）と判定されて壊れるため使わない。
                vals.append(node.val)

                # 子が存在する場合のみキューへ追加（None は falsy なので自然に弾ける）
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)

            result.append(vals)

        return result
```

---

### 🔍 動作トレース（`root = [3, 9, 20, null, null, 15, 7]`）

```
ツリー:
    3
   / \
  9  20
     / \
    15   7

初期状態:
  queue  = deque([Node(3)])
  result = []

━━━━━━━━━━ while ループ 1回目（深さ0） ━━━━━━━━━━
  level_size = 1   ← ここで固定。以降 queue が変わっても影響しない
  vals = []

  i=0: node = queue.popleft() → Node(3)   queue = deque([])
       vals.append(3)  → [3]       ← val が 0 でも正しく追加される
       node.left  = Node(9)  → queue.append → queue = deque([Node(9)])
       node.right = Node(20) → queue.append → queue = deque([Node(9), Node(20)])

  result.append([3]) → result = [[3]]

━━━━━━━━━━ while ループ 2回目（深さ1） ━━━━━━━━━━
  level_size = 2   ← len(queue)=2 をここで固定
  vals = []

  i=0: node = queue.popleft() → Node(9)    queue = deque([Node(20)])
       vals.append(9)   → [9]
       node.left  = None → スキップ
       node.right = None → スキップ

  i=1: node = queue.popleft() → Node(20)   queue = deque([])
       vals.append(20)  → [9, 20]
       node.left  = Node(15) → queue.append → queue = deque([Node(15)])
       node.right = Node(7)  → queue.append → queue = deque([Node(15), Node(7)])

  result.append([9, 20]) → result = [[3], [9, 20]]

━━━━━━━━━━ while ループ 3回目（深さ2） ━━━━━━━━━━
  level_size = 2
  vals = []

  i=0: node = queue.popleft() → Node(15)   queue = deque([Node(7)])
       vals.append(15)  → [15]
       node.left  = None → スキップ, node.right = None → スキップ

  i=1: node = queue.popleft() → Node(7)    queue = deque([])
       vals.append(7)   → [15, 7]
       node.left  = None → スキップ, node.right = None → スキップ

  result.append([15, 7]) → result = [[3], [9, 20], [15, 7]]

━━━━━━━━━━ queue が空 → ループ終了 ━━━━━━━━━━
戻り値: [[3], [9, 20], [15, 7]] ✅
```

---

## 4. 前回バグの総括

| 項目             | 前回の競技版（❌ Wrong Answer）             | 今回の訂正版（✅ Accepted）                 |
| ---------------- | ------------------------------------------- | ------------------------------------------- |
| `val = 0` のとき | `0 or extend(...)` → `None` がリストに混入  | `vals.append(node.val)` → 正しく `0` を追加 |
| 階のサイズ固定   | `or` トリックで子の追加と混在し計算がずれる | `level_size = len(queue)` を先に変数へ保存  |
| `type: ignore`   | 型の問題を強引に無視していた                | 不要なトリックを排除したので不要            |
| pylance 対応     | `type: ignore` を使っており型安全でない     | 全型ヒントが正しく解決される                |

> 📖 **このセクションで登場した用語**
>
> - **`deque([root])`**：`deque` を初期値ありで生成する書き方。`deque()` を作ってから `append()` するより1行で書ける
> - **`popleft()`**：`deque` の先頭要素を O(1) で取り出すメソッド。`list.pop(0)` の O(n) と必ず区別すること
> - **`is not None`**：`None` かどうかの比較は `== None` ではなく `is not None` と書くのがPythonの慣習（PEP8準拠）
> - **型の絞り込み（Type Narrowing）**：`if root is None: return []` の後、pylance が `root` を `TreeNode` 型と自動判断する機能

---

## 5. 計算量まとめ

| 項目           | 値   | 理由                                                                          |
| -------------- | ---- | ----------------------------------------------------------------------------- |
| **時間計算量** | O(n) | 各ノードをキューへの追加・取り出しでちょうど1回ずつ処理する                   |
| **空間計算量** | O(n) | キューに最大で「最も広い階のノード数」が入る。完全二分木の最下層は最大 n/2 個 |

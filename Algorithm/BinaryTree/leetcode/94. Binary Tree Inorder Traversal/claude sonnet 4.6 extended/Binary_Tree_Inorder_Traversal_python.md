# Binary Tree Inorder Traversal — Python Edition

## 1. 問題分析結果

### 競技プログラミング視点

- **制約分析**: N ≤ 100 と極小。O(N) 時間・O(N) 空間が理論下界
- **最速手法**: 明示スタックによる反復実装。Python の関数呼び出しオーバーヘッドを回避
- **CPython最適化**: `list.append()` は C 実装で O(1) 均償。`list.pop()` も同様

### 業務開発視点

- **型安全設計**: `Optional[TreeNode]`、`list[int]` で Pylance 完全対応
- **エラーハンドリング**: 空木（`None`）はガード節で即 `[]` を返し、例外を発生させない
- **可読性**: フェーズをコメントで明示し、意図を self-documenting に

### Python特有分析

- **データ構造選択**: スタックは `list`（`append`/`pop` ともに O(1) で deque 不要）
- **再帰 vs 反復**: Python のデフォルト再帰上限は 1,000。反復実装が本番安全
- **`while` + `list.pop()`**: CPython の C レイヤーで動作し最速

---

## 2. 採用アルゴリズムと根拠

- **選択**: 反復（明示スタック）+ カーソルポインタ方式
- **Python最適化戦略**: `list.append` / `list.pop` を直接呼び出し、属性ルックアップを最小化
- **トレードオフ**: 再帰より数行多いが、スタックオーバーフロー耐性と Follow-up 要件を同時に満たす

---

## 3. 実装パターン

### 業務開発版（型安全・可読性重視）

```python
# Runtime 0 ms
# Beats 100.00%
# Memory 19.22 MB
# Beats 85.80%

# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

from __future__ import annotations
from typing import Optional


class Solution:
    """
    Binary Tree Inorder Traversal
    中順走査（左 → 根 → 右）を反復スタックで実装。
    Follow-up: 再帰を使わない反復解。
    """

    def inorderTraversal(self, root: Optional[TreeNode]) -> list[int]:
        """
        二分木の中順走査を反復で実行する。

        Args:
            root: 二分木の根ノード（None = 空木）

        Returns:
            中順走査の値リスト。空木の場合は空リスト。

        Complexity:
            Time:  O(N) — 全ノードを一度だけ訪問
            Space: O(N) — 明示スタックの最大深さ（最悪: 左偏木）
        """
        # ガード: 空木は即座に空リストを返す
        if root is None:
            return []

        result: list[int] = []
        stack: list[TreeNode] = []
        current: Optional[TreeNode] = root

        while current is not None or stack:

            # ── フェーズ1: 左端まで潜りながらスタックに積む ──────────────
            while current is not None:
                stack.append(current)   # 右・自身は後回し
                current = current.left  # 左へ進む

            # ── フェーズ2: スタック top を取り出して訪問 ─────────────────
            # ループ条件より stack が空でないことは保証済み
            node: TreeNode = stack.pop()
            result.append(node.val)     # ← 中順で値を記録

            # ── フェーズ3: 右部分木へカーソルを移す ──────────────────────
            current = node.right        # None なら次ループで即 pop フェーズへ

        return result
```

---

### 競技プログラミング版（性能最優先）

```python
from typing import Optional


class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> list[int]:
        """
        中順走査 反復実装（最速版）

        Time:  O(N)
        Space: O(N)
        """
        res: list[int] = []
        stk: list[TreeNode] = []
        cur = root

        while cur or stk:
            # 左端まで積む
            while cur:
                stk.append(cur)
                cur = cur.left
            # 訪問 → 右へ
            cur = stk.pop()
            res.append(cur.val)
            cur = cur.right

        return res
```

---

## 4. アルゴリズムアプローチ比較

| アプローチ                  | 時間計算量 | 空間計算量 | Python実装コスト | 可読性 | 標準ライブラリ活用 | CPython最適化 | 備考                                                |
| --------------------------- | ---------- | ---------- | ---------------- | ------ | ------------------ | ------------- | --------------------------------------------------- |
| **A: 再帰 DFS**             | O(N)       | O(N)       | 低               | ★★★    | —                  | 不適          | 再帰上限 1,000 でスタックオーバーフローリスク       |
| **B: 反復（明示スタック）** | O(N)       | O(N)       | 中               | ★★★    | `list`             | 適            | Follow-up 要件を満たす。本実装 ✅                   |
| **C: Morris Traversal**     | O(N)       | O(1)       | 高               | ★☆☆    | —                  | 不適          | ノード書き換えで副作用あり、Python では実装コスト高 |

---

## 5. 動作トレース

`root = [1, null, 2, 3]` を例に。

```
ツリー:
    1
     \
      2
     /
    3
```

| ステップ | current | stack（底→top） | result    | 操作                        |
| -------- | ------- | --------------- | --------- | --------------------------- |
| 初期     | 1       | []              | []        | —                           |
| Ph1      | None    | [1]             | []        | 1 を push、left=None で停止 |
| Ph2      | —       | []              | [1]       | pop→1、val=1 を記録         |
| Ph3      | 2       | []              | [1]       | current = right(2)          |
| Ph1      | 3→None  | [2, 3]          | [1]       | 2 push → 3 push             |
| Ph2      | —       | [2]             | [1, 3]    | pop→3、val=3 を記録         |
| Ph3      | None    | [2]             | [1, 3]    | current = right(None)       |
| Ph2      | —       | []              | [1, 3, 2] | pop→2、val=2 を記録         |
| Ph3      | None    | []              | [1, 3, 2] | ループ終了                  |

**Output: `[1, 3, 2]` ✅**

---

## Python固有の最適化観点まとめ

| 観点                 | 本実装での適用                                                 |
| -------------------- | -------------------------------------------------------------- |
| **Pylance 型安全**   | `Optional[TreeNode]`・`list[int]`・`list[TreeNode]` で完全対応 |
| **CPython 最速操作** | `list.append` / `list.pop` は C 実装 O(1) 均償                 |
| **再帰回避**         | 明示スタックでデフォルト再帰上限（1,000）の制約を完全回避      |
| **Pure function**    | 入力ツリーへの書き込みゼロ、副作用なし                         |
| **エッジケース**     | `root is None` ガードで空木を即返却、例外発生なし              |

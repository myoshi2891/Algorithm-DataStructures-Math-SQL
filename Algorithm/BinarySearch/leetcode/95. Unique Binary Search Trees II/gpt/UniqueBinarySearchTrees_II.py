# ## 1. 多角的問題分析

# ### 競技プログラミング視点

# * **最速手法**：区間 `[l, r]` に対し根候補 `i` を全列挙し、左 `[l, i-1]`・右 `[i+1, r]` の**全組合せ**を直積で合成する**分割統治 + 区間メモ化**。
#   同一区間の再計算を避けるだけで、実質的に**出力サイズ（カタラン数 `C_n`）に近い**下限コストに収束。
# * **メモリ**：出力（全木）が支配的。アルゴリズム側は「区間→列挙結果」メモのみで抑制。
# * **境界**：`n ≤ 8` なので Python でも十分間に合う（`C_8 = 143`）。

# ### 業務開発視点

# * **可読性/保守性**：`TreeNode` 型を厳密化（`Optional[TreeNode]`）、内部関数 `build(l, r)` を閉包内へ局所化。
# * **エラーハンドリング**：LeetCode 入力は有効前提だが、**防御的チェック**を軽く入れても良い（本実装は軽量に留める）。
# * **拡張容易性**：`__slots__` によりメモリを抑えつつ、プロパティ集合を固定して予期せぬ属性追加を防止。

# ### Python特有考慮（CPython 3.11+）

# * **データ構造**：辞書（`dict`）で区間メモ、キーはタプル `(l, r)`（ハッシュ安定・高速）。
# * **実装最適化**：

#   * ループは `for` ベースでオーバーヘッド最小化。
#   * `__slots__` による Node インスタンスの小型化（属性辞書を持たない）。
#   * 局所変数へのバインドで attribute 参照回数を削減（小さな最適化）。

# ---

# ## 2. アルゴリズム比較表

# | アプローチ                 | 時間計算量           | 空間計算量                  | Python実装コスト | 可読性 | 標準ライブラリ活用   | CPython最適化 | 備考           |
# | --------------------- | --------------- | ---------------------- | ----------- | --- | ----------- | ---------- | ------------ |
# | 方法A: 分割統治 + 区間メモ化（採用） | ≈ **O(Cₙ · n)** | ≈ **O(Cₙ · n)**（出力＋メモ） | 低           | 高   | dict（区間→結果） | 適          | 最短実装で重複計算を排除 |
# | 方法B: 区間長ボトムアップ DP     | ≈ **O(Cₙ · n)** | ≈ **O(Cₙ · n)**        | 中           | 中   | list/dict   | 適          | 表構築が煩雑で利得小   |
# | 方法C: 素朴再帰（非メモ化）       | 指数              | 指数                     | 低           | 中   | —           | 不適         | 小規模のみ現実的     |

# > 生成本数が `Cₙ` のため、**出力線形**以上は不可避。

# ---

# ## 3. Python特有最適化ポイント

# * **`__slots__`** で `TreeNode` を軽量化（属性辞書を省略）。
# * **辞書メモ化**で再計算回避。`(l, r)` をキーにしてハッシュ衝突・比較コストを最小化。
# * **ループ主体**かつ**最小限の一時オブジェクト**。
# * **イミュータブル方針**：構築後の木を変更しない前提で**部分木参照の共有**を許容（深いコピーは行わない）。
#   ※ LeetCode 側は構造検証・シリアライズのみで破壊的変更を行わないため安全。

# ---

# ## 4. 実装（**LeetCode 形式 / Class 形式 / pylance 互換の型注釈**）

# ```python
from __future__ import annotations

from typing import Dict, List, Optional, Tuple


# LeetCode 既定の定義（必要十分な最小実装）
class TreeNode:
    """
    Binary Tree Node with fixed attribute layout for memory efficiency.
    """

    __slots__ = ("val", "left", "right")

    def __init__(
        self,
        val: int = 0,
        left: Optional["TreeNode"] = None,
        right: Optional["TreeNode"] = None,
    ) -> None:
        self.val: int = val
        self.left: Optional["TreeNode"] = left
        self.right: Optional["TreeNode"] = right


class Solution:
    """
    Unique Binary Search Trees II
    1..n の値で構造的に一意な BST をすべて生成して返す。

    Time:   おおよそ O(C_n * n)
    Space:  おおよそ O(C_n * n)（出力＋区間メモ）
    """

    def generateTrees(self, n: int) -> List[Optional[TreeNode]]:
        """
        Args:
            n: 1 <= n <= 8

        Returns:
            BST の根ノードを格納した配列（各要素が 1 本の木）

        Raises:
            TypeError: n が整数でない（LeetCode 入力は有効前提のため通常は発生しない）
            ValueError: n が負（同上）
        """
        # --- 軽量な防御的チェック（LeetCode の制約内では通過） ---
        if not isinstance(n, int):
            raise TypeError("n must be an integer")
        if n < 0:
            raise ValueError("n must be non-negative")
        if n == 0:
            # 問題定義上は 1..n だが、0 は空配列を素直に返す
            return []

        # 区間 [l, r] -> 生成可能な根ノード配列（null を含み得る）
        memo: Dict[Tuple[int, int], List[Optional[TreeNode]]] = {}

        def build(l: int, r: int) -> List[Optional[TreeNode]]:
            """
            区間 [l, r] 内の値のみを用いて作れる BST をすべて生成。
            空区間は [None]（空木 1 通り）で表す。
            """
            if l > r:
                return [None]

            key = (l, r)
            cached = memo.get(key)
            if cached is not None:
                return cached

            # ループ内の attribute 参照回数を抑えるため、局所変数化
            out: List[Optional[TreeNode]] = []
            for root_val in range(l, r + 1):
                left_trees = build(l, root_val - 1)
                right_trees = build(root_val + 1, r)

                # 直積で全組合せを合成
                for lt in left_trees:
                    for rt in right_trees:
                        # 新規 root（部分木参照は共有：不変前提）
                        out.append(TreeNode(root_val, lt, rt))

            memo[key] = out
            return out

        return build(1, n)


# ```

# ---

# ## 5. 検証（方針のみ・コードは不要）

# * **境界**：`n=1`（1 本のみ）、`n=2/3`（手計算で一致確認）、`n=8`（件数 143）。
# * **型チェック**：`List[Optional[TreeNode]]` を返し、`TreeNode` メンバは `int` と `Optional[TreeNode]` に限定（pylance 警告なし）。
# * **不変性**：返却後に木を変更しなければ、部分木共有による副作用は発生しない（LeetCode の使用法と合致）。

# ---

# ### まとめ

# * **分割統治 + 区間メモ化**が最小実装で最速クラス。
# * `__slots__`・辞書メモ・素直なループで **CPython に優しい**実装。
# * 型注釈は `Optional[TreeNode]`・戻り値 `List[Optional[TreeNode]]` を明示し、**pylance 互換**。

# ### 1. 問題分析結果

# #### 競技プログラミング視点

# * **最速手法**：単調増加スタック（インデックスを積む）。各要素は高々1回 `push/pop` され、一次走査で終了（**O(n)**）。
# * **メモリ最小化**：補助配列はスタックのみ（**O(n)**）。`deque` は不要で `list`（末尾操作 O(1)）が最適。

# #### 業務開発視点

# * **可読性/保守性**：`leftIndex`・`width` 等の用語で境界を明確化。境界処理は番兵（末尾に高さ0相当を仮定）で一括。
# * **型安全性/エラーハンドリング**：プロダクション版では入力検証、競プロ版（LeetCode実行）は前提を信頼して最速化。

# #### Python特有分析

# * **CPython特性**：`list.append`/`list.pop` は C 実装で高速。`while` 内でローカル変数へ多用代入し属性参照を減らすと速い。
# * **標準ライブラリ**：追加構造不要。`list` が最小・最速。
# * **GIL**：CPUバウンドで並行化の旨味なし（一次ループなので単スレッドで十分）。

# ---

# ### 2. アルゴリズム比較表

# | アプローチ                 | 時間計算量      | 空間計算量 | Python実装コスト | 可読性 | 標準ライブラリ活用 | CPython最適化 | 備考          |
# | --------------------- | ---------- | ----- | ----------- | --- | --------- | ---------- | ----------- |
# | 方法A: 単調増加スタック         | O(n)       | O(n)  | 低           | 高   | list      | 適          | 最速・実務/競プロ定番 |
# | 方法B: 分割統治（最小値探索にセグ木等） | O(n log n) | O(n)  | 高           | 中   | —         | 普通         | 実装重く保守コスト高  |
# | 方法C: 全区間二重ループ         | O(n²)      | O(1)  | 低           | 高   | —         | 不適         | n=1e5で不可    |

# ---

# ### 3. 採用アルゴリズムと根拠

# * **選択**：方法A（単調増加スタック）。
# * **理由**：線形時間で最小補助メモリ、境界条件が番兵で単純化しバグを避けやすい。
# * **Python最適化戦略**：

#   * ローカル変数への束縛で属性/グローバル参照を削減。
#   * 末尾番兵（`i == n` で `curr = 0`）により単一ループ。
#   * 例外はプロダクション版のみ（ホットパス外）。

# ---

# ### 4. 検証

# * **境界**：`[0]`, `[2]`, `[0,0,0]`, `[2,1,2]`, 単調増加 `[1,2,3,4]`, 単調減少 `[4,3,2,1]`, 問題例 `[2,1,5,6,2,3]`。
# * **型**：`List[int]` 前提（LeetCode）。pylance対応の型注釈を付与。

# ---

# ## 実装（LeetCode形式 / Class 形式, CPython 3.11+）

# ```python
from __future__ import annotations

from typing import List


class Solution:
    """
    Largest Rectangle in Histogram を解くクラス。

    2パターンを提供:
      - solve_competitive: 競技向け（最速・前提信頼）
      - solve_production:  業務向け（入力検証つき）
    LeetCode では largestRectangleArea が評価対象。
    """

    def largestRectangleArea(self, heights: List[int]) -> int:
        """
        LeetCode 評価対象：競技向け最速実装を呼び出し
        """
        return self.solve_competitive(heights)

    # ---------- 業務開発向け（入力検証つき） ----------
    def solve_production(self, heights: List[int]) -> int:
        """
        業務開発向け実装（型安全・エラーハンドリング重視）

        Args:
            heights: 各棒の高さ（整数, 0..1e4, len 1..1e5）
        Returns:
            最大長方形面積
        Raises:
            TypeError: 要素が整数でない場合
            ValueError: 制約違反・空配列など
        """
        self._validate_input(heights)
        # エッジケース
        if len(heights) == 1:
            v: int = heights[0]
            return v if v >= 0 else 0
        return self._mono_stack_max_area(heights)

    # ---------- 競技プログラミング向け（最速） ----------
    def solve_competitive(self, heights: List[int]) -> int:
        """
        競技プログラミング向け最適化実装（前提を信頼）
        Time: O(n), Space: O(n)
        """
        return self._mono_stack_max_area(heights)

    # ---------- 共通：単調増加スタック本体 ----------
    def _mono_stack_max_area(self, heights: List[int]) -> int:
        """
        単調増加スタックで最大長方形面積を求める中核処理。
        - スタックはインデックスを保持
        - i==n のとき curr=0 を与えて残りを排出（番兵）
        """
        n: int = len(heights)
        stack: List[int] = []  # インデックスを保持（単調増加）
        max_area: int = 0

        # ローカル束縛で高速化
        h = heights
        st = stack
        ma = 0
        top_index: int

        for i in range(n + 1):
            curr: int = 0 if i == n else h[i]
            # 現在の高さがスタック頂点より低い → 面積確定
            while st and curr < h[st[-1]]:
                top_index = st.pop()
                height = h[top_index]
                left = st[-1] if st else -1  # 直前に残った更に低い棒
                width = i - left - 1
                area = height * width
                if area > ma:
                    ma = area
            st.append(i)

        max_area = ma
        return max_area

    # ---------- 入力検証 ----------
    def _validate_input(self, data: List[int]) -> None:
        if not isinstance(data, list):
            raise TypeError("heights must be a list of integers")
        n = len(data)
        if n == 0:
            raise ValueError("heights must not be empty")
        if n > 100_000:
            raise ValueError("length out of bounds: [1, 1e5]")
        # 値域チェック（整数・非負・上限）
        for v in data:
            if not isinstance(v, int):
                raise TypeError("all elements must be integers")
            if v < 0 or v > 10_000:
                raise ValueError("element out of bounds: [0, 1e4]")


# ```

# **要点**

# * `largestRectangleArea` は LeetCode規約のシグネチャで、内部は最速版を使用。
# * スタックはインデックス保持、`i == n` に番兵 `0` を与え一括排出。
# * 変数のローカル束縛で CPython のディスパッチ回数を削減し高速化。

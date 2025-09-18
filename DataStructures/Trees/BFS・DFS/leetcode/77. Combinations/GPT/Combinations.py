# ## 1. 問題分析結果

# ### 制約

# * `1 <= n <= 20`
# * `1 <= k <= n`
# * 出力サイズは最大 `C(20, 10) = 184,756` → 十分に処理可能。

# ### 適切なアルゴリズム

# * **バックトラッキング** が最適。
# * `O(C(n, k))` の時間計算量で全組み合わせを列挙できる。
# * 空間計算量は `O(k)`（再帰スタック + 部分解答保持）。

# ---

# ## 2. Python特有最適化戦略

# * **リスト内包表記** より再帰の方が直感的で可読性高い。
# * **append / pop のペア処理** → Python リストで O(1)。
# * itertools の `combinations` も利用可能だが、競技プログラミングでは明示的バックトラッキングが推奨される。

# ---

# ## 3. 実装 (leetcode フォーマット)

# ```python
from typing import List


class Solution:
    def combine(self, n: int, k: int) -> List[List[int]]:
        """
        Return all possible combinations of k numbers out of range [1..n].

        Args:
            n (int): Upper bound of range (inclusive).
            k (int): Size of each combination.

        Returns:
            List[List[int]]: All combinations.

        Time Complexity: O(C(n, k))
        Space Complexity: O(k) for recursion depth
        """
        result: List[List[int]] = []
        path: List[int] = []

        def backtrack(start: int) -> None:
            if len(path) == k:
                result.append(path.copy())
                return
            for i in range(start, n + 1):
                path.append(i)
                backtrack(i + 1)
                path.pop()

        backtrack(1)
        return result


# ```

# ## 4. 検証ポイント

# * **境界値**

#   * `n=1, k=1` → `[[1]]`
#   * `n=4, k=2` → `[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]`
# * **型安全性**

#   * `pylance` 対応 (`List[List[int]]` の型注釈あり)。

# ---

# ✅ この実装は **競技プログラミングで十分高速**、かつ **業務開発でも可読性・保守性を確保** しています。

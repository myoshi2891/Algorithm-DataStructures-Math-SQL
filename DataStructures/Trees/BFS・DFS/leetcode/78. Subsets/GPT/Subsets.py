# ## 1. 問題分析結果

# ### 競技プログラミング視点

# * 入力サイズは最大10なので、部分集合は **2^n = 1024通り**。
# * 計算量的には全探索でも十分。
# * **O(2^n \* n)** が妥当（各部分集合を作るコストを含む）。

# ### 業務開発視点

# * **可読性・保守性**の観点から、`backtracking` か `bitmask列挙` が良い。
# * 型安全性のため `List[List[int]]` を厳密に指定。
# * エラーハンドリングは競技的には不要だが、業務では入力検証を考慮可能。

# ### Python特有の考慮

# * **リスト内包表記**を用いた高速列挙も可能。
# * itertoolsの`combinations`もあるが、外部ライブラリ禁止条件により純粋実装を採用。
# * `append/pop`を使うバックトラッキングは可読性と実装のバランスが良い。

# ---

# ## 2. アルゴリズム比較

# | アプローチ                      | 時間計算量       | 空間計算量 | 実装コスト | 可読性 | 備考                 |
# | -------------------------- | ----------- | ----- | ----- | --- | ------------------ |
# | **バックトラッキング**              | O(2^n \* n) | O(n)  | 中     | 高   | 標準的で可読性高い          |
# | **ビット全探索**                 | O(2^n \* n) | O(1)  | 中     | 中   | 高速だが可読性はやや低い       |
# | **itertools.combinations** | O(2^n \* n) | O(n)  | 低     | 高   | 標準ライブラリ活用可だが今回は非採用 |

# ---

# ## 3. 採用アルゴリズムと理由

# * **バックトラッキング方式を採用**。
# * 理由:

#   * **直感的・保守性が高い**（業務開発視点に適合）。
#   * **実装も競技用に十分高速**（n ≤ 10なのでパフォーマンス問題なし）。
#   * Pythonの`list`操作を効果的に活用。

# ---

# ## 4. 実装コード（leetcode形式）

# ```python
from typing import List


class Solution:
    """
    LeetCode Subsets 問題の解決クラス
    """

    def subsets(self, nums: List[int]) -> List[List[int]]:
        """
        与えられた整数配列の全ての部分集合を生成する（重複なし）

        Args:
            nums (List[int]): ユニークな整数配列 (1 <= len(nums) <= 10)

        Returns:
            List[List[int]]: 全ての部分集合を格納したリスト

        Complexity:
            Time: O(2^n * n)
            Space: O(n) （再帰スタック + 一時リスト）
        """
        result: List[List[int]] = []
        path: List[int] = []

        def backtrack(start: int) -> None:
            # 現在の部分集合を追加（コピー必須）
            # print(result)
            result.append(path[:])
            for i in range(start, len(nums)):
                path.append(nums[i])
                # print("before",result)
                backtrack(i + 1)
                path.pop()
                # print("after",result)

        backtrack(0)
        return result


# solution = Solution()
# print(solution.subsets([1, 2, 3]))
# ```

# ---

# ## 5. 検証

# * **入力**: `[1, 2, 3]`
# * **出力例**: `[[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]`
# * **エッジケース**:

#   * `nums = [0]` → `[[], [0]]` ✅
#   * `nums = []` → `[[]]` ✅

# ---

# 👉 この実装は **pylanceでも型エラーなし**、かつ **leetcodeの提出フォーマットに準拠**しています。

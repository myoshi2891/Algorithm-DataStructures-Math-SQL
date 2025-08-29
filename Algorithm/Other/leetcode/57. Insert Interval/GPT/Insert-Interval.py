# ```python
from typing import List

class Solution:
    def insert(self, intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
        """
        Insert a new interval into a sorted list of non-overlapping intervals.

        Args:
            intervals (List[List[int]]): 既存の区間（非重複かつ開始位置で昇順ソート済み）
                                         各要素は [start, end]
            newInterval (List[int]): 挿入する新しい区間 [start, end]

        Returns:
            List[List[int]]: 新しい区間を挿入し、必要に応じてマージした結果の区間リスト

        計算量:
            時間計算量: O(n) （各区間を1度だけ走査）
            空間計算量: O(n) （結果を新しい配列に格納）
        """
        result: List[List[int]] = []
        i: int = 0
        n: int = len(intervals)

        # 1. newInterval の開始より前の区間を追加
        while i < n and intervals[i][1] < newInterval[0]:
            result.append(intervals[i])
            i += 1

        # 2. newInterval と重なる区間をマージ
        while i < n and intervals[i][0] <= newInterval[1]:
            newInterval[0] = min(newInterval[0], intervals[i][0])
            newInterval[1] = max(newInterval[1], intervals[i][1])
            i += 1
        result.append(newInterval)

        # 3. 残りの区間を追加
        while i < n:
            result.append(intervals[i])
            i += 1

        return result
# ```

# ---

# ### ✅ この実装の特徴

# * **Pylance 型エラーなし**

#   * `intervals: List[List[int]]`
#   * `newInterval: List[int]`
#   * 戻り値: `List[List[int]]`
#     → すべて `typing.List` を用いて型を明示しています。

# * **計算量**

#   * **時間計算量:** O(n) → 各区間を最大1回だけ走査
#   * **空間計算量:** O(n) → 結果リスト用に追加メモリを使用

# * **LeetCode 提出用形式**
#   `class Solution:` + `def insert(...)` でそのまま提出可能です。


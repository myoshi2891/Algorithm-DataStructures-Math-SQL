# ```python
from typing import List

class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        """
        Merge overlapping intervals.

        Args:
            intervals (List[List[int]]): 
                2次元配列 [ [start1, end1], [start2, end2], ... ]
                1 <= len(intervals) <= 10^4
                0 <= starti <= endi <= 10^4

        Returns:
            List[List[int]]: 
                重なりをすべてマージした非重複区間の配列

        Time Complexity:
            O(n log n) （ソート処理が支配的）

        Space Complexity:
            O(n) （結果配列に依存）
        """

        # 入力が空の場合はそのまま返す
        if not intervals:
            return []

        # 開始時間でソート O(n log n)
        intervals.sort(key=lambda x: x[0])

        merged: List[List[int]] = []
        current: List[int] = intervals[0]

        # 各区間を順に処理
        for start, end in intervals[1:]:
            # currentの終了と次の開始を比較してオーバーラップ判定
            if start <= current[1]:
                # マージ：終了時間を最大値に更新
                current[1] = max(current[1], end)
            else:
                # オーバーラップが無ければ結果に追加
                merged.append(current)
                current = [start, end]

        # 最後の区間を追加
        merged.append(current)

        return merged
# ```

# ---

# ### 実装のポイント

# * **型注釈あり** (`List[List[int]]`) → Pylance の型解析でもエラーが出ません
# * **処理時間**: ソートが支配的なので O(n log n)
# * **メモリ**: 出力用の `merged` に O(n) が必要、それ以外は定数オーバーヘッドのみ

# 👉 ご希望なら、**各ステップでのリスト状態を図解付きで説明**するバージョンもお出しできますが追加しますか？

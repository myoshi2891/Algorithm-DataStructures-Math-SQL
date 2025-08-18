from typing import List

class Solution:
    def permute(self, nums: List[int]) -> List[List[int]]:
        """
        パラメーター:
        nums: List[int] - distinct integers を要素にもつ配列 (長さ 1 <= len(nums) <= 6)

        返却値:
        List[List[int]] - nums の全ての順列を格納した二次元配列

        アルゴリズム:
        - in-place swap を用いたバックトラッキングにより順列を生成
        - 再帰の深さ = len(nums) で探索を終了し、結果を保存
        - メモリ消費を抑えるために nums のコピーは結果保存時のみ行う

        計算量:
        - 時間計算量: O(n * n!) （各順列のコピー操作 O(n)）
        - 空間計算量: O(n) （再帰スタック深さ）
        """
        result: List[List[int]] = []

        def backtrack(start: int) -> None:
            # 順列が完成した場合
            if start == len(nums):
                result.append(nums[:])  # nums のコピーを保存
                return
            for i in range(start, len(nums)):
                # swap
                nums[start], nums[i] = nums[i], nums[start]
                backtrack(start + 1)
                # 元に戻す
                nums[start], nums[i] = nums[i], nums[start]

        backtrack(0)
        return result

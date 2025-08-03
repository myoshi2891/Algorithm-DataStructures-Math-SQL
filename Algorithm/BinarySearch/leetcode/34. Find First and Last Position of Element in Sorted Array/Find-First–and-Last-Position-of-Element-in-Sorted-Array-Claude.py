# この問題は「Find First and Last Position of Element in Sorted Array」で、O(log n)の時間計算量が要求されているため、二分探索を使用します。
# Runtime
# 0
# ms
# Beats
# 100.00%
# Memory
# 19.28
# MB
# Beats
# 20.36%
# ## 解法の説明

# この解決策では、二分探索を2回使用してO(log n)の時間計算量を実現しています：

# ### アルゴリズムの概要
# 1. **最初の位置を見つける**: targetと等しい値が見つかっても、より左側に同じ値がある可能性があるため、左側を継続して探索
# 2. **最後の位置を見つける**: targetと等しい値が見つかっても、より右側に同じ値がある可能性があるため、右側を継続して探索

# ### 計算量
# - **時間計算量**: O(log n) - 二分探索を2回実行
# - **空間計算量**: O(1) - 定数の追加メモリのみ使用

# ### 型安全性とPylance対応
# - すべての変数に明示的な型アノテーションを使用
# - `List[int]`型を使用してリストの要素型を明示
# - 関数の引数と戻り値の型を明記
# - `typing`モジュールから`List`をインポート

# ### エラーハンドリング
# - 空の配列の場合は早期に`[-1, -1]`を返却
# - targetが見つからない場合の適切な処理

# ### メモリ効率
# - 新しいデータ構造を作成せず、既存の配列に対してインプレースで操作
# - 変数の再利用によりメモリ使用量を最小化

# この実装は、LeetCodeの制約条件（配列長10^5、値の範囲-10^9から10^9）を満たし、すべてのエッジケースを適切に処理します。

from typing import List

class Solution:
    def searchRange(self, nums: List[int], target: int) -> List[int]:
        """
        ソートされた配列から指定された値の最初と最後の位置を見つける
        
        Args:
            nums: ソートされた整数配列 (非降順)
            target: 検索対象の値
            
        Returns:
            [開始位置, 終了位置]のリスト。見つからない場合は[-1, -1]
            
        Time Complexity: O(log n)
        Space Complexity: O(1)
        """
        if not nums:  # 空の配列の場合
            return [-1, -1]
        
        # 最初の位置を見つける
        first_pos = self._find_first_position(nums, target)
        if first_pos == -1:  # targetが存在しない場合
            return [-1, -1]
        
        # 最後の位置を見つける
        last_pos = self._find_last_position(nums, target)
        
        return [first_pos, last_pos]
    
    def _find_first_position(self, nums: List[int], target: int) -> int:
        """
        targetの最初の出現位置を二分探索で見つける
        
        Args:
            nums: ソートされた整数配列
            target: 検索対象の値
            
        Returns:
            最初の出現位置のインデックス。見つからない場合は-1
        """
        left: int = 0
        right: int = len(nums) - 1
        result: int = -1
        
        while left <= right:
            mid: int = left + (right - left) // 2  # オーバーフロー回避
            
            if nums[mid] == target:
                result = mid  # 見つけたが、より左側にある可能性があるので継続
                right = mid - 1  # 左側を探索
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        
        return result
    
    def _find_last_position(self, nums: List[int], target: int) -> int:
        """
        targetの最後の出現位置を二分探索で見つける
        
        Args:
            nums: ソートされた整数配列
            target: 検索対象の値
            
        Returns:
            最後の出現位置のインデックス
        """
        left: int = 0
        right: int = len(nums) - 1
        result: int = -1
        
        while left <= right:
            mid: int = left + (right - left) // 2  # オーバーフロー回避
            
            if nums[mid] == target:
                result = mid  # 見つけたが、より右側にある可能性があるので継続
                left = mid + 1  # 右側を探索
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        
        return result


# テスト用のコード
def test_solution() -> None:
    """テストケースを実行"""
    solution = Solution()
    
    # Example 1
    nums1: List[int] = [5, 7, 7, 8, 8, 10]
    target1: int = 8
    result1: List[int] = solution.searchRange(nums1, target1)
    print(f"Test 1: nums={nums1}, target={target1} => {result1}")  # Expected: [3, 4]
    
    # Example 2
    nums2: List[int] = [5, 7, 7, 8, 8, 10]
    target2: int = 6
    result2: List[int] = solution.searchRange(nums2, target2)
    print(f"Test 2: nums={nums2}, target={target2} => {result2}")  # Expected: [-1, -1]
    
    # Example 3
    nums3: List[int] = []
    target3: int = 0
    result3: List[int] = solution.searchRange(nums3, target3)
    print(f"Test 3: nums={nums3}, target={target3} => {result3}")  # Expected: [-1, -1]
    
    # Additional test cases
    nums4: List[int] = [1]
    target4: int = 1
    result4: List[int] = solution.searchRange(nums4, target4)
    print(f"Test 4: nums={nums4}, target={target4} => {result4}")  # Expected: [0, 0]
    
    nums5: List[int] = [2, 2]
    target5: int = 2
    result5: List[int] = solution.searchRange(nums5, target5)
    print(f"Test 5: nums={nums5}, target={target5} => {result5}")  # Expected: [0, 1]


if __name__ == "__main__":
    test_solution()
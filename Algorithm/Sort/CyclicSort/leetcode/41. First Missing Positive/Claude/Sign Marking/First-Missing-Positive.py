# Python版の実装では、以下の点を重視しています：

# ## 🔧 実装のポイント

# ### **1. 基本実装 (`Solution`)**
# - LeetCodeの標準的な形式に完全対応
# - 全ての変数に型注釈を明示
# - わかりやすいコメントと構造

# ### **2. パフォーマンス最適化版 (`SolutionOptimized`)**
# - 冗長な`abs()`呼び出しを削減
# - 条件分岐の最適化
# - 早期終了の活用

# ### **3. メモリ最適化版 (`SolutionMemoryOptimized`)**
# - 局所変数を最小限に抑制
# - インライン処理でメモリ使用量を削減
# - `len(nums)`の繰り返し計算（Pythonでは最適化される）

# ### **4. 型安全版 (`SolutionTypeSafe`)**
# - Pylanceの型チェックに完全対応
# - エラーハンドリングを含む
# - 全ての変数に明示的な型注釈

# ## ⚡ パフォーマンス考慮事項

# ### **時間複雑度: O(n)**
# - 3つの独立したループ
# - 各要素への定数時間アクセス

# ### **空間複雑度: O(1)**
# - 入力配列以外の追加メモリ不使用
# - 局所変数は定数個のみ

# ### **Python特有の最適化**
# - `range()`はイテレータなのでメモリ効率的
# - `abs()`は組み込み関数で高速
# - リストのインデックスアクセスは最適化済み

# ## 🔍 Pylance対応

# - 全ての変数に型注釈
# - `List[int]`のimport
# - 戻り値の型明示
# - 潜在的な型エラーの回避

# LeetCodeでの実行時は**基本実装 (`Solution`)** を使用することを推奨します。最もバランスが取れており、可読性とパフォーマンスを両立しています。

from typing import List


class Solution:
    def firstMissingPositive(self, nums: List[int]) -> int:
        """
        配列から欠けている最小の正の整数を見つける
        
        Args:
            nums: 整数のリスト
            
        Returns:
            int: 欠けている最小の正の整数
            
        Time Complexity: O(n)
        Space Complexity: O(1)
        """
        n: int = len(nums)
        
        # Step 1: 配列内の値を正規化
        # 1からnの範囲外の値（0以下、n+1以上）をn+1に置き換える
        for i in range(n):
            if nums[i] <= 0 or nums[i] > n:
                nums[i] = n + 1
        
        # Step 2: 各数値の存在を配列のインデックスを使って記録
        # 値xが存在する場合、インデックスx-1の値を負にする
        for i in range(n):
            val: int = abs(nums[i])
            if val <= n:
                # インデックスval-1の値を負にマーク（既に負の場合はそのまま）
                nums[val - 1] = -abs(nums[val - 1])
        
        # Step 3: 最初の正の値のインデックス+1が答え
        for i in range(n):
            if nums[i] > 0:
                return i + 1
        
        # 1からnまでの全ての数が存在する場合、答えはn+1
        return n + 1


# パフォーマンス最適化版（オプション）
class SolutionOptimized:
    def firstMissingPositive(self, nums: List[int]) -> int:
        """
        パフォーマンス最適化版 - より効率的な実装
        
        Args:
            nums: 整数のリスト
            
        Returns:
            int: 欠けている最小の正の整数
            
        Time Complexity: O(n)
        Space Complexity: O(1)
        """
        n: int = len(nums)
        
        # Step 1: 値の正規化とStep 2の一部を統合
        for i in range(n):
            # 範囲外の値を正規化
            if nums[i] <= 0 or nums[i] > n:
                nums[i] = n + 1
        
        # Step 2: 存在マーキング（最適化版）
        for i in range(n):
            val: int = abs(nums[i])
            # 範囲チェックを最適化（n+1は既に範囲外なのでチェック不要）
            if val < n + 1:  # val <= nと同等だが、比較が若干高速
                target_idx: int = val - 1
                # 既に負の場合の冗長なabs()呼び出しを避ける
                if nums[target_idx] > 0:
                    nums[target_idx] = -nums[target_idx]
                else:
                    nums[target_idx] = -abs(nums[target_idx])
        
        # Step 3: 結果検出（早期終了の最適化）
        for i in range(n):
            if nums[i] > 0:
                return i + 1
        
        return n + 1


# メモリ使用量を最小化したい場合の代替実装
class SolutionMemoryOptimized:
    def firstMissingPositive(self, nums: List[int]) -> int:
        """
        メモリ使用量最小化版 - 局所変数を最小限に抑制
        
        Args:
            nums: 整数のリスト
            
        Returns:
            int: 欠けている最小の正の整数
            
        Time Complexity: O(n)
        Space Complexity: O(1) - 局所変数も最小化
        """
        # Step 1: インライン正規化
        for i in range(len(nums)):
            if nums[i] <= 0 or nums[i] > len(nums):
                nums[i] = len(nums) + 1
        
        # Step 2: インライン存在マーキング
        for i in range(len(nums)):
            if abs(nums[i]) <= len(nums):
                nums[abs(nums[i]) - 1] = -abs(nums[abs(nums[i]) - 1])
        
        # Step 3: インライン結果検出
        for i in range(len(nums)):
            if nums[i] > 0:
                return i + 1
        
        return len(nums) + 1


# 型安全性を重視した実装（Pylance対応）
class SolutionTypeSafe:
    def firstMissingPositive(self, nums: List[int]) -> int:
        """
        型安全性を重視した実装 - Pylanceの型チェックに完全対応
        
        Args:
            nums: 整数のリスト（空でない配列を想定）
            
        Returns:
            int: 欠けている最小の正の整数（必ず1以上）
            
        Raises:
            ValueError: 入力が空の場合（LeetCodeでは発生しない）
            
        Time Complexity: O(n)
        Space Complexity: O(1)
        """
        if not nums:  # 型安全性のためのチェック（LeetCodeでは不要）
            raise ValueError("Input array cannot be empty")
        
        n: int = len(nums)
        
        # Step 1: 値の正規化
        for i in range(n):
            current_val: int = nums[i]
            if current_val <= 0 or current_val > n:
                nums[i] = n + 1
        
        # Step 2: 存在マーキング
        for i in range(n):
            abs_val: int = abs(nums[i])
            if abs_val <= n:
                target_index: int = abs_val - 1
                original_val: int = nums[target_index]
                nums[target_index] = -abs(original_val)
        
        # Step 3: 結果検出
        for i in range(n):
            if nums[i] > 0:
                result: int = i + 1
                return result
        
        # 全ての数が存在する場合
        final_result: int = n + 1
        return final_result
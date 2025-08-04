# ## 🐍 **Python実装の最適化ポイント**

# ### **1. 型安全性**
# - `typing.List` を使用した厳密な型指定
# - すべての変数に型アノテーションを明示
# - Pylance の型チェックに完全対応

# ### **2. パフォーマンス最適化**
# ```python
# # メモリ効率
# left: int = 0                    # O(1) 空間
# right: int = len(nums) - 1       # O(1) 空間

# # 時間効率
# mid: int = left + (right - left) // 2  # 整数除算で高速化
# ```

# ### **3. LeetCode特有の考慮事項**

# **処理時間最適化:**
# - `//` 演算子使用（`math.floor()` より高速）
# - 条件分岐の順序最適化（最も可能性の高いケースを先に）
# - 不要な関数呼び出しを排除

# **メモリ消費最適化:**
# - 追加のデータ構造を使用しない
# - インプレースでポインター操作のみ
# - O(1) 空間計算量を維持
# Runtime
# 0
# ms
# Beats
# 100.00%
# Memory
# 18.21
# MB
# Beats
# 93.65%

# ### **4. Python特有の利点**
# ```python
# # 整数オーバーフロー耐性（Pythonの自動多精度整数）
# mid: int = left + (right - left) // 2

# # 型安全な比較演算
# if nums[mid] == target:  # 型推論により安全
# ```

# ### **5. 実行時間の期待値**
# - **Best Case**: O(1) - 最初の中点でヒット
# - **Average Case**: O(log n) - 典型的なバイナリサーチ
# - **Worst Case**: O(log n) - 完全な範囲削減

# この実装はLeetCodeのPython環境で最適なパフォーマンスを発揮し、型エラーも発生しません。

from typing import List


class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        """
        ソート済み配列内でターゲット値のインデックスを検索し、
        見つからない場合は挿入すべき位置のインデックスを返す
        
        Args:
            nums (List[int]): ソート済みの重複なし整数配列
            target (int): 検索対象の整数値
            
        Returns:
            int: ターゲットが見つかった場合はそのインデックス、
                 見つからない場合は挿入位置のインデックス
        """
        left: int = 0
        right: int = len(nums) - 1
        
        # バイナリサーチでO(log n)の時間計算量を実現
        while left <= right:
            # オーバーフローを避けるため、中点計算を最適化
            # Python では整数オーバーフローは発生しないが、ベストプラクティスとして採用
            mid: int = left + (right - left) // 2
            
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                left = mid + 1
            else:
                right = mid - 1
        
        # ターゲットが見つからない場合、leftが挿入位置を示す
        return left
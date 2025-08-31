# ```python
from typing import List


class Solution:
    def generateMatrix(self, n: int) -> List[List[int]]:
        """
        n x n の行列を渦巻き状に 1 から n^2 まで埋める関数

        Parameters:
        -----------
        n : int
            行列のサイズ (1 <= n <= 20)

        Returns:
        --------
        List[List[int]]
            渦巻き状に数値が配置された n x n 行列
        """
        # 結果を格納する n x n 行列を 0 で初期化
        matrix: List[List[int]] = [[0] * n for _ in range(n)]
        
        # 境界を管理する変数
        top: int = 0
        bottom: int = n - 1
        left: int = 0
        right: int = n - 1
        
        # 現在の数値
        num: int = 1
        
        # 境界が交差しない限りループ
        while top <= bottom and left <= right:
            # 1. 上の行を左から右へ埋める
            for col in range(left, right + 1):
                matrix[top][col] = num
                num += 1
            top += 1
            
            # 2. 右の列を上から下へ埋める
            for row in range(top, bottom + 1):
                matrix[row][right] = num
                num += 1
            right -= 1
            
            # 3. 下の行を右から左へ埋める（残っている場合）
            if top <= bottom:
                for col in range(right, left - 1, -1):
                    matrix[bottom][col] = num
                    num += 1
                bottom -= 1
            
            # 4. 左の列を下から上へ埋める（残っている場合）
            if left <= right:
                for row in range(bottom, top - 1, -1):
                    matrix[row][left] = num
                    num += 1
                left += 1
        
        return matrix
# ```

# ## 計算量解析

# | 項目 | 計算量 | 備考 |
# |------|--------|------|
# | 時間計算量 | O(n²) | 各要素を1回ずつ訪問 |
# | 空間計算量 | O(n²) | 結果の行列のみ（追加メモリは O(1)） |
# | 実行時間目安 | 約 0.1〜1ms | n=20 での LeetCode 環境 |
# | メモリ使用目安 | 約 1〜2KB | n=20 での理論値 |

# ## アルゴリズムのポイント

# * **境界管理**: `top`, `bottom`, `left`, `right` で現在の有効範囲を管理
# * **4方向の移動**: 右→下→左→上の順序で渦巻き状に数値を配置
# * **境界チェック**: 各方向の移動後に境界を更新し、重複を防止
# * **効率性**: 追加の visited 配列を使わず、境界管理のみで実装
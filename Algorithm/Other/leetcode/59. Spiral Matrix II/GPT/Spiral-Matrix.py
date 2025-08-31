# * Python 3.11.4
# * `class Solution` 形式（LeetCode準拠）
# * Pylance の型チェック対応
# * 関数単位で処理を分離
# * 処理時間・メモリ消費を最適化（O(n²)、in-placeな追加のみ）

# ```python
from typing import List

class Solution:
    def generateMatrix(self, n: int) -> List[List[int]]:
        """
        螺旋状に 1 から n^2 までを埋め込んだ n x n の行列を生成する
        
        Args:
            n (int): 行列のサイズ (1 <= n <= 20)
        
        Returns:
            List[List[int]]: 螺旋状に数字を埋め込んだ n x n の2次元リスト
        """
        # 結果用の n x n 行列を 0 で初期化
        matrix: List[List[int]] = [[0] * n for _ in range(n)]
        
        # 境界の初期化
        left: int = 0
        right: int = n - 1
        top: int = 0
        bottom: int = n - 1
        
        # 埋め込む数字の開始値
        num: int = 1
        target: int = n * n
        
        # 螺旋状に埋めるループ
        while num <= target:
            # 上端の行を左→右に埋める
            for col in range(left, right + 1):
                matrix[top][col] = num
                num += 1
            top += 1
            
            # 右端の列を上→下に埋める
            for row in range(top, bottom + 1):
                matrix[row][right] = num
                num += 1
            right -= 1
            
            # 下端の行を右→左に埋める
            if top <= bottom:
                for col in range(right, left - 1, -1):
                    matrix[bottom][col] = num
                    num += 1
                bottom -= 1
            
            # 左端の列を下→上に埋める
            if left <= right:
                for row in range(bottom, top - 1, -1):
                    matrix[row][left] = num
                    num += 1
                left += 1
        
        return matrix
# ```

# ---

# ### ✅ 設計上のポイント

# * **計算量**

#   * 各要素を一度だけ埋めるため **O(n²)**
# * **メモリ消費量**

#   * 結果の行列 `O(n²)` のみ。追加の配列は使わない。
# * **Pylance 型チェック**

#   * `n: int` と `List[List[int]]` を明示。

# ---

# 必要なら、次に **各処理の図解付き解析** を作って、
# `n=3` の例で「左から右 → 上から下 → 右から左 → 下から上」の順番を図解して解説できます。

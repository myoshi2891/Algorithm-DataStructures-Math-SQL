# ```python
from typing import List

class Solution:
    def rotate(self, matrix: List[List[int]]) -> None:
        """
        Function: rotate
        ----------------
        Rotates an n x n matrix in-place by 90 degrees clockwise.

        Parameters
        ----------
        matrix : List[List[int]]
            A 2D square matrix (n x n) that will be modified directly.

        Returns
        -------
        None
            The input matrix is modified in-place. No return value.

        Complexity
        ----------
        Time Complexity: O(n^2)
            - We traverse all elements once (transpose + reverse rows).
        Memory Usage: O(1)
            - In-place modification without extra matrix allocation.
        """
        n: int = len(matrix)

        # Step 1: Transpose the matrix (swap elements across the diagonal)
        for i in range(n):
            for j in range(i + 1, n):
                matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]

        # Step 2: Reverse each row to complete the 90-degree rotation
        for i in range(n):
            matrix[i].reverse()
# ```

# ---

# ### 🔎 処理の流れ

# 1. **転置 (Transpose)**

#    * `matrix[i][j]` と `matrix[j][i]` を入れ替えて行と列を交換。
# 2. **行の反転 (Row Reverse)**

#    * 各行を左右反転して90度回転を完成させる。

# ---

# ✅ **時間計算量**: O(n²) （最大 n=20 なので高速）
# ✅ **メモリ使用量**: O(1) （入力行列を直接操作、追加の配列を使わない）
# ✅ **型定義**: `List[List[int]]` を使用、`None` を返すことで **Pylance の型チェックにも準拠**

# このまま **LeetCode (Python 3, CPython 3.11.4)** で提出可能です。

# ---

# 必要なら、先ほどのように **図解での処理解析（Python版）** も併せて示しますか？

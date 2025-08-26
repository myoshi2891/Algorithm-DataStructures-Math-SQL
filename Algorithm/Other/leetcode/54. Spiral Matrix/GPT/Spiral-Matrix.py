# 「教材（インタラクティブ解説）」に使えるように、Python (CPython 3.11.4) で **型を明示** し、**処理時間とメモリ効率を考慮**したコードを示します。さらに各処理を **関数に分けて責務を明確化** し、`Pylance` 型エラーにも対応できるようにしています。

# ---

# # 📘 問題

# `m x n` 行列を「渦巻き状」に走査し、要素を **順番に 1 次元リストとして返す**。

# ---

# # 🐍 Python コード

# ```python
from typing import List


class Solution:
    def spiralOrder(self, matrix: List[List[int]]) -> List[int]:
        """
        与えられた m x n 行列をスパイラル順（渦巻き順）に走査し、その要素を返す。

        Args:
            matrix (List[List[int]]): m x n の整数行列 (1 <= m,n <= 10)

        Returns:
            List[int]: 渦巻き順に並べられた要素のリスト
        """

        # ✅ 出力結果を格納するリスト
        result: List[int] = []

        # ✅ 行と列の境界を設定
        top: int = 0
        bottom: int = len(matrix) - 1
        left: int = 0
        right: int = len(matrix[0]) - 1

        # ✅ 境界が交差しない限りループ
        while top <= bottom and left <= right:
            # --- 1. 上の行（左→右）
            for col in range(left, right + 1):
                result.append(matrix[top][col])
            top += 1

            # --- 2. 右の列（上→下）
            for row in range(top, bottom + 1):
                result.append(matrix[row][right])
            right -= 1

            # --- 3. 下の行（右→左）※残っていれば
            if top <= bottom:
                for col in range(right, left - 1, -1):
                    result.append(matrix[bottom][col])
                bottom -= 1

            # --- 4. 左の列（下→上）※残っていれば
            if left <= right:
                for row in range(bottom, top - 1, -1):
                    result.append(matrix[row][left])
                left += 1

        return result
# ```

# ---

# # ⚡ 計算量解析

# * **時間計算量**:
#   各要素を **1 度だけ走査**するので

#   $$
#   O(m \times n)
#   $$
# * **空間計算量**:
#   出力リスト `result` のみ保持するので

#   $$
#   O(m \times n)
#   $$

#   （追加の配列や visited フラグを持たない）

# ---

# # 📊 図解（処理の流れ）

# 例:

# ```
# matrix = [
#   [1, 2, 3],
#   [4, 5, 6],
#   [7, 8, 9]
# ]
# ```

# ### ステップごとの境界移動

# ```
# 初期状態: top=0, bottom=2, left=0, right=2

# 1. 上の行 →   1 → 2 → 3
#    top = 1

# 2. 右の列 ↓   6 → 9
#    right = 1

# 3. 下の行 ←   8 → 7
#    bottom = 1

# 4. 左の列 ↑   4
#    left = 1

# 5. 残り:       5
# ```

# 最終結果 → `[1,2,3,6,9,8,7,4,5]`

# ---

# ✅ この実装は **効率性・型の安全性・教育用解説** の3点を満たしています。

# ---

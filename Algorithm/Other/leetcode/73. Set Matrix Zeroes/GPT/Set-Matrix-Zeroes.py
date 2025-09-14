# # 1. 問題分析

# ## 競技プログラミング視点

# * **実行速度最優先**

#   * 行列サイズは最大 200×200 = 40,000 要素なので、O(m·n) アルゴリズムなら余裕。
#   * 定数倍を抑えるためにループを増やさず一度の走査でマーキング。
# * **メモリ効率重視**

#   * O(1) 追加メモリで解ける（1行目・1列目をフラグ領域として再利用）。
# * **Pythonの制約**

#   * for ループは高速化のためにローカル変数キャッシュ（`row = matrix[i]` など）。
#   * 過剰なオブジェクト生成を避ける。

# ## 業務開発視点

# * **可読性・保守性**

#   * 行列のゼロ化の手順を明確に分割（フラグ判定 → マーキング → 更新 → 1行目/1列目反映）。
#   * 関数に型ヒントを付け、`Pylance` で静的解析を効かせる。
# * **エラーハンドリング**

#   * 非リスト入力や空行列は早期 return または例外。
#   * ValueError / TypeError を適切に投げる。

# ## Python特有の考慮点

# * list が基本（deque は不要）。
# * `any()` で1行目・1列目のゼロ判定を高速化。
# * 内包表記よりも単純 for ループで V8/C レベル最適化を活かす。
# * GIL により並列化は意味が薄いのでシングルスレッド処理で十分。

# ---

# # 2. アルゴリズム比較

# | アプローチ             | 時間計算量          | 空間計算量  | 実装コスト | 可読性 | Python標準ライブラリ活用 | 備考    |
# | ----------------- | -------------- | ------ | ----- | --- | --------------- | ----- |
# | 方法A: 先頭行・列をフラグに使う | O(m·n)         | O(1)   | 低     | 高   | any()           | 最も効率的 |
# | 方法B: 行・列を集合で記録    | O(m·n)         | O(m+n) | 中     | 高   | set()           | 実装は簡単 |
# | 方法C: 各ゼロを即反映      | O(m²·n²) worst | O(1)   | 低     | 高   | なし              | 小規模専用 |

# ---

# # 3. 実装方針

# * **選択したアプローチ**: 方法A（1行目・1列目をフラグに利用、O(1) 空間）
# * **選択理由**:

#   * O(m·n) で十分速い。
#   * 追加メモリ不要で最適。
#   * 行列サイズ制約に対して過不足なし。
# * **Python最適化ポイント**:

#   * `any()` を使った初期フラグ判定。
#   * ループ内で `row = matrix[i]` にキャッシュ。
#   * インデックス走査を利用し hidden class の安定性を維持。

# ---

# # 4. コード実装例

# ```python
from typing import List


class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        """
        In-place: If an element is 0, set its entire row and column to 0.
        Args:
            matrix (List[List[int]]): m x n integer matrix
        Raises:
            TypeError: If input is not List[List[int]]
            ValueError: If matrix is empty or inconsistent row sizes
        Complexity:
            Time: O(m*n), Space: O(1)
        """

        # --- 入力検証 ---
        if not isinstance(matrix, list):
            raise TypeError("matrix must be a list of lists")
        if not matrix or not isinstance(matrix[0], list):
            raise ValueError("matrix must be a non-empty 2D list")
        m, n = len(matrix), len(matrix[0])
        for row in matrix:
            if not isinstance(row, list) or len(row) != n:
                raise ValueError("matrix rows must have equal length")

        # --- 1行目・1列目のフラグ判定 ---
        first_row_zero = any(matrix[0][j] == 0 for j in range(n))
        first_col_zero = any(matrix[i][0] == 0 for i in range(m))

        # --- マーキング ---
        for i in range(1, m):
            row = matrix[i]
            for j in range(1, n):
                if row[j] == 0:
                    matrix[i][0] = 0
                    matrix[0][j] = 0

        # --- 内部セルをゼロ化 ---
        for i in range(1, m):
            row = matrix[i]
            if matrix[i][0] == 0:
                for j in range(1, n):
                    row[j] = 0
            else:
                for j in range(1, n):
                    if matrix[0][j] == 0:
                        row[j] = 0

        # --- 1列目処理 ---
        if first_col_zero:
            for i in range(m):
                matrix[i][0] = 0

        # --- 1行目処理 ---
        if first_row_zero:
            for j in range(n):
                matrix[0][j] = 0

    def setZeroes_optimized(self, matrix: List[List[int]]) -> None:
        """
        Competitive programming version (省略版).
        - 入力検証を省略し、性能最優先
        """
        m, n = len(matrix), len(matrix[0])
        first_row_zero = any(matrix[0][j] == 0 for j in range(n))
        first_col_zero = any(matrix[i][0] == 0 for i in range(m))

        for i in range(1, m):
            for j in range(1, n):
                if matrix[i][j] == 0:
                    matrix[i][0] = matrix[0][j] = 0

        for i in range(1, m):
            for j in range(1, n):
                if matrix[i][0] == 0 or matrix[0][j] == 0:
                    matrix[i][j] = 0

        if first_col_zero:
            for i in range(m):
                matrix[i][0] = 0
        if first_row_zero:
            for j in range(n):
                matrix[0][j] = 0


# ```

# ---

# # 5. 計算量まとめ

# * **時間計算量**: O(m·n)（2回走査）
# * **空間計算量**: O(1)（フラグ2個のみ）
# * **Python固有オーバーヘッド**:

#   * GIL により並列化効果はない。
#   * for ループのインタープリタコストはあるが m,n ≤ 200 なら十分速い。
#   * any() の C 実装が高速。

# ---

# # 6. Python固有の最適化観点

# * **CPython最適化**

#   * `any()` によるゼロ存在チェック
#   * `row = matrix[i]` でループ内インデックス計算削減
# * **メモリ効率化**

#   * 追加配列を作らず in-place 更新
#   * 内部で一時的な set/dict を使わない
# * **型ヒント**

#   * `List[List[int]]` を使用、Pylance で補助
#   * 実行時オーバーヘッドはゼロ

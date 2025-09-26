# ### 1. 問題分析結果

# #### 競技プログラミング視点

# * **最速手法**: 各行を「高さ配列（連続1の本数）」に更新し、行ごとに **単調増加スタック**で「ヒストグラムの最大長方形」を計算。
#   計算量 **O(R·C)**、追加メモリ **O(C)**。200×200 の制約に十分高速。
# * **メモリ最小化**: `heights` と `stack` を固定長 1 本ずつ再利用。センチネルはループの境界で擬似化し、配列拡張を避ける。

# #### 業務開発視点

# * **可読性/保守性**: ヒストグラム計算をローカルメソッドに分離。変数名は意味ベースで統一。
# * **型安全性/エラーハンドリング**: 競プロ向け `maximalRectangle` は前提どおりの入力を想定（LeetCode仕様）。併せて堅牢版 `maximalRectangle_production` を用意し、行長不揃い・型不正時に例外を明示。

# #### Python特有分析

# * **CPython最適化**:

#   * ローカル変数バインドで属性参照を削減（`heights`, `stack`, `cols` をローカルに保持）。
#   * `list.append/pop` のみ使用、`deque`/`insert`/`pop(0)` は未使用。
#   * ループは `for` 直書き、内包表記は不要な中間生成を回避。
# * **GIL**: CPUバウンドの単一スレッド処理で問題なし。

# ---

# ### 2. アルゴリズム比較表

# | アプローチ                         | 時間計算量           | 空間計算量  | Python実装コスト | 可読性 | 標準ライブラリ活用   | CPython最適化 | 備考      |
# | ----------------------------- | --------------- | ------ | ----------- | --- | ----------- | ---------- | ------- |
# | 方法A: 行ごとヒストグラム + 単調増加スタック（採用） | O(R·C)          | O(C)   | 低           | 高   | list（固定再利用） | 適          | 最速・実装短  |
# | 方法B: DPで左右境界・高さを保持            | O(R·C)          | O(R·C) | 中           | 中   | なし          | 適          | メモリ重め   |
# | 方法C: 全探索（各セルを起点に拡張）           | O(R·C·min(R,C)) | O(1)   | 低           | 中   | なし          | 不適         | 小規模のみ妥当 |

# ---

# ### 3. Python最適化ポイント（抜粋）

# * **ローカル化**: `stack_top` を整数で手動管理し、`stack[-1]` 参照頻度を削減。
# * **センチネル**: 末尾 `j == cols` を高さ 0 として処理し、配列連結不要。
# * **再利用**: `heights` と `stack` は都度 `clear` せずインデックスで管理。

# ---

# ### 4. 実装（LeetCode形式 / Class / CPython 3.11+ / 型付き）

# ```python
from typing import List


class Solution:
    """
    LeetCode 85. Maximal Rectangle

    競技プログラミング最適化版: maximalRectangle
    - 前提: matrix は '0'/'1' の文字で構成された長方形2次元配列
    - 時間計算量: O(R*C)
    - 空間計算量: O(C)
    """

    def maximalRectangle(self, matrix: List[List[str]]) -> int:
        """
        与えられた '0'/'1' 行列で、1のみから成る最大長方形の面積を返す。

        Args:
            matrix: R x C の2次元配列（各要素は '0' または '1'）

        Returns:
            最大長方形の面積（int）

        Note:
            LeetCodeの想定に合わせ、入力検証は最小限（競技向け）。
        """
        if not matrix:
            return 0
        rows: int = len(matrix)
        cols: int = len(matrix[0])
        if cols == 0:
            return 0

        # heights[j]: 現在行を底とする列 j の連続 '1' の本数
        heights: List[int] = [0] * cols
        # 単調増加スタック（インデックスを格納）。top を手動管理。
        stack: List[int] = [0] * (cols + 1)  # 十分な容量を確保
        max_area: int = 0

        # 局所関数: ヒストグラムの最大長方形
        def largest_rectangle_in_histogram(h: List[int]) -> int:
            best: int = 0
            top: int = -1  # 空を -1 とする
            # j == cols のとき高さ0のセンチネルとして処理
            for j in range(cols + 1):
                cur: int = 0 if j == cols else h[j]
                # 単調性が崩れたら確定計算
                while top >= 0 and cur < h[stack[top]]:
                    height: int = h[stack[top]]
                    top -= 1
                    left_less_index: int = stack[top] if top >= 0 else -1
                    width: int = j - left_less_index - 1
                    area: int = height * width
                    if area > best:
                        best = area
                top += 1
                stack[top] = j
            return best

        for i in range(rows):
            row = matrix[i]
            # 高さ更新
            for j in range(cols):
                heights[j] = heights[j] + 1 if row[j] == "1" else 0
            # 行を底にした最大長方形
            area = largest_rectangle_in_histogram(heights)
            if area > max_area:
                max_area = area

        return max_area

    # 参考: 業務開発向けの堅牢版（LeetCodeでは呼ばれない）
    def maximalRectangle_production(self, matrix: List[List[str]]) -> int:
        """
        業務開発向け: 型/範囲検証を行い、仕様違反時は例外を送出。

        Raises:
            TypeError: 要素型が '0'/'1' 以外
            ValueError: 行長不揃い、サイズ範囲外など
        """
        if not isinstance(matrix, list):
            raise TypeError("matrix must be a list of lists")
        if not matrix:
            return 0
        cols: int = len(matrix[0])
        if cols == 0:
            return 0
        rows: int = len(matrix)
        if not (1 <= rows <= 200):
            raise ValueError("rows must be within [1, 200]")
        if not (1 <= cols <= 200):
            raise ValueError("cols must be within [1, 200]")
        for r, row in enumerate(matrix):
            if not isinstance(row, list) or len(row) != cols:
                raise ValueError("All rows must have identical length")
            for c, v in enumerate(row):
                if not isinstance(v, str) or (v != "0" and v != "1"):
                    raise TypeError("matrix[i][j] must be '0' or '1'")

        # 入力が妥当なら競技向け実装に委譲（コピーせず同じ参照を渡す）
        return self.maximalRectangle(matrix)


# ```

# ---

# ### 5. 検証（方針のみ）

# * **境界値**: `[]` → 0、`[["0"]]` → 0、`[["1"]]` → 1、全1の行列、全0の行列、縦長/横長ケース、ジグザグ。
# * **上限**: 200×200 で例外なく O(R·C) で処理可能。
# * **型チェック**: `maximalRectangle_production` による静的/動的検証で *pylance* も問題なし。

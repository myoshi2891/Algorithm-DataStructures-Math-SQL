# 以下は Python (CPython 3.11.4) での最適化実装です。
# 桁ごとの掛け算を配列に格納し、繰り上げを管理することで O(m×n) の計算量、O(m+n) のメモリで処理します。
# Pylance による型チェックにも対応して型ヒントを明示しています。

# ```python
from typing import List

class Solution:
    def multiply(self, num1: str, num2: str) -> str:
        """
        文字列で与えられた2つの非負整数の積を文字列として返す

        Parameters:
            num1 (str): 掛け算する1つ目の数（文字列）
            num2 (str): 掛け算する2つ目の数（文字列）

        Returns:
            str: 積を表す文字列
        """
        # 片方が "0" の場合は即座に返す（不要な計算を避ける）
        if num1 == "0" or num2 == "0":
            return "0"

        m: int = len(num1)
        n: int = len(num2)
        # 計算結果を格納する配列（初期値は0）
        result: List[int] = [0] * (m + n)

        # 下位桁から順に掛け算（筆算と同じ要領）
        for i in range(m - 1, -1, -1):
            digit1: int = ord(num1[i]) - 48  # '0' の ASCIIコードを引く
            for j in range(n - 1, -1, -1):
                digit2: int = ord(num2[j]) - 48
                mul: int = digit1 * digit2
                sum_: int = mul + result[i + j + 1]

                result[i + j + 1] = sum_ % 10
                result[i + j] += sum_ // 10

        # 先頭のゼロをスキップ
        start: int = 0
        while start < len(result) and result[start] == 0:
            start += 1

        return "".join(map(str, result[start:]))
# ```

# ---

# ### 実装のポイント

# 1. **整数変換禁止ルール遵守**
#    → `ord(char) - 48` で桁の数値を取得（`'0'` の ASCII コードは 48）。
# 2. **O(m×n) の計算量**

#    * 最大長 200 なら 40,000 回の掛け算で十分高速。
# 3. **O(m+n) のメモリ使用**

#    * 配列 `result` は最大 401 要素で固定。
# 4. **文字列連結の最適化**

#    * 最後に `join` で一括変換し、中間的な文字列生成を避ける。

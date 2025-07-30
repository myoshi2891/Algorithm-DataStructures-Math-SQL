# 以下に、**LeetCode仕様に対応したPython (CPython 3.11.4)** の解法を提示します。
# 除算（`/`）、乗算（`*`）、剰余演算子（`%`）を**使用せず**、ビット演算のみで実装しています。

# ---

# ## ✅ Python 解法（LeetCode形式、型アノテーション付き）

# ```python
from typing import Final

class Solution:
    def divide(self, dividend: int, divisor: int) -> int:
        """
        乗算・除算・剰余演算子を使用せずに整数の除算を行う
        :param dividend: 被除数（-2^31 以上 2^31-1 以下）
        :param divisor: 除数（0ではない）
        :return: 商（小数点以下切り捨て、32ビット符号付き整数範囲で制限）
        """

        INT_MAX: Final[int] = 2**31 - 1
        INT_MIN: Final[int] = -2**31

        # 特殊ケース：オーバーフロー
        if dividend == INT_MIN and divisor == -1:
            return INT_MAX

        # 絶対値で処理し、結果の符号は最後に調整
        a: int = abs(dividend)
        b: int = abs(divisor)
        result: int = 0

        # ビットシフトで商を求める（a から b << i を繰り返し引く）
        for i in range(31, -1, -1):
            if (a >> i) >= b:
                result += 1 << i
                a -= b << i

        # 符号調整（片方が負なら負の商）
        if (dividend > 0) != (divisor > 0):
            result = -result

        # 結果を 32-bit 符号付き整数に収める
        return max(min(result, INT_MAX), INT_MIN)
# ```

# ---

# ### ✅ 計算量・効率性

# | 特性    | 内容                             |
# | ----- | ------------------------------ |
# | 時間計算量 | `O(log N)`（最大31回のループ）          |
# | 空間計算量 | `O(1)`（追加の配列やデータ構造なし）          |
# | 使用禁止  | `/`, `*`, `%` は未使用（LeetCode制約） |
# | 精度    | `-2^31`〜`2^31 - 1` の範囲を正確に扱える  |

# ---

# ### ✅ テスト例

# ```python
# s = Solution()
# print(s.divide(10, 3))        # 出力: 3
# print(s.divide(7, -3))        # 出力: -2
# print(s.divide(1, 2))         # 出力: 0
# print(s.divide(-2147483648, 1))   # 出力: -2147483648
# print(s.divide(-2147483648, -1))  # 出力: 2147483647
# ```

# ---

# ### 🔍 補足：どうやって動いているのか（簡易解説）

# * `a >> i >= b` で「`b * 2^i <= a`か？」を高速にチェック
# * `a -= b << i` で対応分だけ引きながら、商に `2^i` を加算
# * `for i in 31 to 0` は上位ビットから試す（貪欲法的）
# * 最後に符号だけ調整

# ---

# ご希望あれば、**図解付きステップ解説**や **再帰版の実装**などもご用意可能です。

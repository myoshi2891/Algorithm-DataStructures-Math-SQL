# 問題の本質は「固定利益 `p` を求めること」です。
# 数式にすると次のようになります：

# * 単品バーガー: `burger_price = cost_burger + p`
# * 単品ソーダ: `soda_price = cost_soda + p`
# * セット: `combo_price = cost_burger + cost_soda + p`

# したがって、

# ```
# (burger_price + soda_price) - combo_price
# = (cost_burger + p + cost_soda + p) - (cost_burger + cost_soda + p)
# = p
# ```

# つまり **`p = (burger_price + soda_price - combo_price)`** で一発です。

# 以下に、LeetCode形式（クラス実装）と HackerRank風（関数スタンドアロン）の両方を提示します。

# ---

# ## ✅ LeetCode形式 (競技プログラミング版：高速・シンプル)

# ```python
from typing import List


class Solution:
    def profit(self, b: int, s: int, c: int) -> int:
        """
        Calculate fixed profit from burger, soda, and combo prices.

        Args:
            b (int): burger price
            s (int): soda price
            c (int): combo price

        Returns:
            int: fixed profit
        """
        return b + s - c


# ```

# ---

# ## ✅ 業務用堅牢バージョン (入力検証あり)

# ```python
from typing import Any


class SolutionRobust:
    def profit(self, b: Any, s: Any, c: Any) -> int:
        """
        Robust implementation with input validation.
        Args:
            b (Any): burger price
            s (Any): soda price
            c (Any): combo price
        Returns:
            int: fixed profit
        Raises:
            TypeError: if inputs are not integers
            ValueError: if inputs are not positive
        """
        # 型チェック
        if not all(isinstance(x, int) for x in (b, s, c)):
            raise TypeError("All inputs must be integers")

        # 値のチェック
        if not all(x > 0 for x in (b, s, c)):
            raise ValueError("All prices must be positive integers")

        # 利益計算
        profit = b + s - c
        if profit <= 0:
            raise ValueError("Computed profit must be positive")

        return profit


# ```

# ---

# ## ✅ HackerRank風スタンドアロン (指定フォーマット)

# ```python
#!/bin/python3

import os
import sys

#
# Complete the 'profit' function below.
#
# The function is expected to return an INTEGER.
# The function accepts following parameters:
#  1. INTEGER b
#  2. INTEGER s
#  3. INTEGER c
#


def profit(b: int, s: int, c: int) -> int:
    # Return the fixed profit.
    return b + s - c


if __name__ == "__main__":
    fptr = open(os.environ["OUTPUT_PATH"], "w")

    t = int(input().strip())

    for _ in range(t):
        b, s, c = map(int, input().rstrip().split())
        result = profit(b, s, c)
        fptr.write(str(result) + "\n")

    fptr.close()
# ```

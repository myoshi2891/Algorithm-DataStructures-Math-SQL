# 今度は **DP（動的計画法）** を用いた解法ですね。
# 線形走査でも解けますが、DP的に書くと「配列 `dp[i]` を、i 番目で終わる逆背の順の最長長さ」として求める形になります。

# ---

# ## アルゴリズム (DP 版)

# 1. `dp[i] = 1` を初期値とする。
#    （人 i 単独の区間は必ず長さ 1）
# 2. `a[i-1] >= a[i]` のとき
#    `dp[i] = dp[i-1] + 1`
#    そうでなければ `dp[i] = 1`
# 3. 最後に `max(dp)` を答えとする。

# ---

# ## 計算量

# * **時間計算量:** `O(n)`
# * **空間計算量:** `O(n)`（`dp` 配列を使用するため。線形走査版よりは大きい）

# ---

# ## 実装 (Python 3.8.10, 型付き)

# ```python
from typing import List

class Solution:
    def longest_non_increasing_segment(self, n: int, a: List[int]) -> int:
        """
        DP を用いて最長の「逆背の順」区間の長さを求める

        Parameters
        ----------
        n : int
            人数 (1 <= n <= 200,000)
        a : List[int]
            各人の身長リスト (100 <= a_i <= 200)

        Returns
        -------
        int
            最長の「逆背の順」区間の長さ
        """
        # dp[i]: i番目で終わる逆背の順の長さ
        dp: List[int] = [1] * n
        max_len: int = 1

        for i in range(1, n):
            if a[i-1] >= a[i]:
                dp[i] = dp[i-1] + 1
            else:
                dp[i] = 1
            if dp[i] > max_len:
                max_len = dp[i]

        return max_len


if __name__ == "__main__":
    import sys
    input_data = sys.stdin.read().strip().split()
    n: int = int(input_data[0])
    a: List[int] = list(map(int, input_data[1:]))
    
    solver = Solution()
    result: int = solver.longest_non_increasing_segment(n, a)
    print(result)
# ```

# ---

# ✅ この DP 解法は「`dp[i]` を使って漸化式で更新」するため、問題の「区間の長さ」を自然に表現できます。
# メモリは `n=200,000` なら `dp` 配列が **約200,000要素 ≒ 数MB** で十分収まります。

# ---

# ご希望があれば、
# 入力例をこの **DP 表** に展開して、どのように更新されていくか図解してみますか？

# 以下は、LeetCodeの「正規表現マッチング」問題に対する **Python（CPython 3.11.4対応）** の解答です。
# **型アノテーション付き**で記述し、**計算量**と**メモリ使用**にも配慮しています。

# ## ✅ 問題概要（再掲）

# * `.` は任意の1文字
# * `*` は直前の文字の 0 回以上の繰り返し
# * `s` 全体と `p` 全体がマッチするかを判定

# ---

# ## 🧠 解法方針：動的計画法（DP）

# * 状態：`dp[i][j]` ⇒ `s[:i]` と `p[:j]` がマッチするか
# * 遷移：

#   * `p[j - 1] == '*'`：

#     * `dp[i][j] = dp[i][j - 2] or (dp[i - 1][j] if p[j - 2] matches s[i - 1])`
#   * それ以外：

#     * `dp[i][j] = dp[i - 1][j - 1]` if `p[j - 1] == s[i - 1]` or `p[j - 1] == '.'`

# ## 🐍 Python実装（型付き）

from typing import List

class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        m: int = len(s)
        n: int = len(p)

        # dp[i][j] := s[:i] と p[:j] がマッチするか
        dp: List[List[bool]] = [[False] * (n + 1) for _ in range(m + 1)]
        dp[0][0] = True  # 空文字同士はマッチ

        # パターン初期化（空文字にマッチする * の処理）
        for j in range(2, n + 1):
            if p[j - 1] == '*':
                dp[0][j] = dp[0][j - 2]

        # DP更新
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if p[j - 1] == '.' or p[j - 1] == s[i - 1]:
                    dp[i][j] = dp[i - 1][j - 1]
                elif p[j - 1] == '*':
                    dp[i][j] = dp[i][j - 2]  # * を 0 回使う
                    if p[j - 2] == '.' or p[j - 2] == s[i - 1]:
                        dp[i][j] |= dp[i - 1][j]  # * を 1 回以上使う

        return dp[m][n]
    
# ## 🔎 使用例

# ```python
# if __name__ == "__main__":
#     sol = Solution()
#     print(sol.isMatch("aa", "a"))    # False
#     print(sol.isMatch("aa", "a*"))   # True
#     print(sol.isMatch("ab", ".*"))   # True
# ```

# ---

# ## ⏱ 計算量・メモリ消費

# | 項目        | 値                       |
# | --------- | ----------------------- |
# | 時間計算量     | O(m × n)                |
# | 空間計算量     | O(m × n)                |
# | 入力サイズ最大   | 20文字（s, p）              |
# | 最大DP表サイズ  | 21 × 21 = 441セル         |
# | メモリ消費（概算） | 約 441 × 1バイト ≈ **500B** |

# ## ✅ 補足：なぜDPか？

# * 再帰+メモ化でも解けるが、LeetCodeではTLEになりやすい。
# * 全探索で部分一致を記録できるDPが最も安定した手法。

# ご希望があれば、再帰＋メモ化（`lru_cache`）版や、図解を含めたステップバイステップ解析も可能です。

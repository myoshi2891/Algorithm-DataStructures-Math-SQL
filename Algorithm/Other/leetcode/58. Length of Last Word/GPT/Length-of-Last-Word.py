# ```python
# from typing import List

class Solution:
    def lengthOfLastWord(self, s: str) -> int:
        """
        Function: lengthOfLastWord
        --------------------------
        Given a string s consisting of words and spaces,
        return the length of the last word in the string.

        Parameters:
        s (str): Input string (1 <= len(s) <= 10^4), consists of letters and spaces.

        Returns:
        int: Length of the last word in the string.

        Time Complexity: O(n)   (n = length of string s, single backward scan)
        Memory Usage: O(1)     (only integer counters used, no extra structures)
        """
        i: int = len(s) - 1
        length: int = 0

        # Skip trailing spaces
        while i >= 0 and s[i] == " ":
            i -= 1

        # Count the characters of the last word
        while i >= 0 and s[i] != " ":
            length += 1
            i -= 1

        return length
# ```

# ---

# ### ✅ ポイント

# * **型ヒント**を明示 (`s: str -> int`)
# * **Pylance** でも型エラーが出ないよう、`List` 等は不要なため削除済み
# * **処理時間**: `O(n)` （末尾から逆走査、最悪1回全走査）
# * **メモリ消費量**: `O(1)` （整数カウンタのみ）

# このまま **LeetCode (Python 3, CPython 3.11.4)** に提出可能です。

# 👉 必要なら、次は **入力例ごとのトレース図（Python版）** を作成して説明しましょうか？

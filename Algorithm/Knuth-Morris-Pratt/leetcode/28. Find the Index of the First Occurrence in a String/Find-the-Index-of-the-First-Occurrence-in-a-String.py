# 以下に、`Python (CPython 3.11.4)` を使用し、LeetCode形式に準拠した `class Solution` を用いた解答を示します。

# 処理効率を重視し、**KMP（Knuth-Morris-Pratt）法**を用いて、`needle`の最初の出現インデックスを効率よく探索します。

# ---

# ### ✅ 実装コード（KMP法使用）

# ```python
from typing import List

class Solution:
    def strStr(self, haystack: str, needle: str) -> int:
        """
        haystack: str - 探索対象の文字列
        needle: str - 探索する部分文字列
        return: int - needleの最初の出現インデックス。見つからない場合は-1。
        時間計算量: O(n + m), 空間計算量: O(m)
        （n = haystackの長さ, m = needleの長さ）
        """

        def build_lps(pattern: str) -> List[int]:
            """部分一致テーブル（LPS配列）を構築する"""
            lps = [0] * len(pattern)
            length = 0  # 前のLPS長
            i = 1

            while i < len(pattern):
                if pattern[i] == pattern[length]:
                    length += 1
                    lps[i] = length
                    i += 1
                else:
                    if length != 0:
                        length = lps[length - 1]
                    else:
                        lps[i] = 0
                        i += 1
            return lps

        if not needle:
            return 0  # 空文字列は0番目に見つかったとみなす

        lps = build_lps(needle)
        i = j = 0  # iはhaystack用, jはneedle用

        while i < len(haystack):
            if haystack[i] == needle[j]:
                i += 1
                j += 1
                if j == len(needle):
                    return i - j
            else:
                if j != 0:
                    j = lps[j - 1]
                else:
                    i += 1

        return -1  # 見つからなかった場合
# ```

# ---

# ### 🔍 処理時間・メモリ計算量

# | 項目     | 計算量                            |
# | ------ | ------------------------------ |
# | 時間計算量  | `O(n + m)`                     |
# | 空間計算量  | `O(m)`（LPS配列の構築）               |
# | 最悪ケース例 | haystack: 10⁴文字, needle: 10⁴文字 |

# ---

# ### ✅ テストケース例

# ```python
# s = Solution()
# print(s.strStr("sadbutsad", "sad"))       # 出力: 0
# print(s.strStr("leetcode", "leeto"))      # 出力: -1
# print(s.strStr("aaaabaaabaaac", "abaaac"))# 出力: 7
# print(s.strStr("abc", ""))                # 出力: 0（空needle）
# ```

# ---

# ### ✅ 備考

# * Pythonの組み込み関数 `haystack.find(needle)` を使えばワンライナーでも同様の結果が得られますが、KMP法はアルゴリズム的理解と応用力の訓練に適しています。
# * LPS（Longest Prefix which is also Suffix）は、部分一致の再利用を可能にし、不要な比較を省きます。

# ---

# 必要があれば **図解付き**でLPS配列やKMPステップの説明も可能です。希望があればお知らせください。

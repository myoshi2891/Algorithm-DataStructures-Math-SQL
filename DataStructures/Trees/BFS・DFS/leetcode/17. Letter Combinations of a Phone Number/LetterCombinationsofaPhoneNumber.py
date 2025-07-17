# 以下は、**LeetCode用の Python (CPython 3.11.4)** に準拠した
# 「電話番号の文字列組み合わせ」問題の実装です。

# ---

# ## **実装内容**

# * **アルゴリズム**：バックトラッキング（DFS探索）
# * **時間計算量**：
#   O(3^N × 4^M)

#   * N：3文字キー（2,3,4,5,6,8）の個数
#   * M：4文字キー（7,9）の個数
# * **空間計算量**：
#   O(出力サイズ + 再帰スタック)

# ---

# ## **Pythonコード（LeetCode提出形式）**

# ```python
from typing import List

class Solution:
    def letterCombinations(self, digits: str) -> List[str]:
        """
        与えられた数字文字列から、考えられる全ての文字列の組み合わせを返す

        Parameters
        ----------
        digits : str
            電話番号を表す数字文字列 (0 <= len(digits) <= 4)

        Returns
        -------
        List[str]
            数字文字列から作成される全ての文字列の組み合わせ

        時間計算量: O(3^N × 4^M)
        空間計算量: O(組み合わせ数 + 再帰スタック)
        """
        if not digits:
            return []

        phone_map: dict[str, str] = {
            "2": "abc", "3": "def", "4": "ghi",
            "5": "jkl", "6": "mno", "7": "pqrs",
            "8": "tuv", "9": "wxyz"
        }

        res: List[str] = []

        def backtrack(index: int, path: str) -> None:
            """
            再帰的に文字列の組み合わせを構築する

            Parameters
            ----------
            index : int
                digits内の現在の桁位置
            path : str
                現在までの組み合わせ文字列
            """
            # 全桁処理完了時に結果保存
            if index == len(digits):
                res.append(path)
                return

            # 現在の数字に対応する文字で探索
            for letter in phone_map[digits[index]]:
                backtrack(index + 1, path + letter)

        backtrack(0, "")
        return res

# ## **動作例**

# ```python
# solution = Solution()
# print(solution.letterCombinations("23"))
# # 出力: ['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf']
# ```

# ---

# ## **解説図（探索木）**

# ```
# digits = "23"

#                    ""
#           /         |         \
#         "a"        "b"        "c"
#       /   \       /   \       /   \
#    "ad"  "ae"  "bd"  "be"  "cd"  "ce"
#       \    \     \    \     \     \
#      "af" "af"  "bf"  "bf"  "cf"  "cf"

# 出力: ["ad", "ae", "af", "bd", "be", "bf", "cd", "ce", "cf"]
# ```

# ---

# ## **時間計算量の詳細**

# | 項目       | 内容                      |
# | -------- | ----------------------- |
# | 1桁の組み合わせ | O(3) or O(4)            |
# | 2桁の組み合わせ | O(3×3) = 9 or O(4×3)=12 |
# | 最大4桁     | O(3^N × 4^M)            |

# ---

# ## **空間計算量**

# | 項目     | 内容                |
# | ------ | ----------------- |
# | 出力リスト  | O(組み合わせ数)         |
# | 再帰スタック | O(最大深さ＝digitsの長さ) |

# ---

# ## **まとめ**

# * LeetCode提出形式 ✅
# * 型ヒント ✅
# * 計算量解析 ✅
# * 図解による動作説明 ✅

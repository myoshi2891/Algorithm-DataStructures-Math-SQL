# 以下は、**LeetCode用のPython実装（CPython 3.11.4）**で、
# 指定の括弧の妥当性判定を**クラス `Solution` 内メソッドで実装**したものです。

# ## ✅ 実装コード（Python）

# ```python
from typing import List

class Solution:
    def isValid(self, s: str) -> bool:
        """
        与えられた文字列sが有効な括弧列か判定する関数

        パラメーター:
        s: str - 入力文字列（括弧のみ： '()[]{}'）

        返却値:
        bool - 有効な括弧列ならTrue、不正ならFalse

        制約:
        1 <= len(s) <= 10^4

        時間計算量: O(n) （nは文字列長）
        空間計算量: O(n) （スタック使用）
        """
        stack: List[str] = []
        
        bracket_map = {
            ')': '(',
            '}': '{',
            ']': '['
        }

        for char in s:
            if char in '({[':
                stack.append(char)
            else:
                if not stack:
                    return False
                top = stack.pop()
                if bracket_map[char] != top:
                    return False

        return not stack
# ```

# ---

# ## ✅ **使用例（テストコード）**

# ```python
# # テスト実行例
# solution = Solution()
# print(solution.isValid("()"))        # True
# print(solution.isValid("()[]{}"))    # True
# print(solution.isValid("(]"))        # False
# print(solution.isValid("([])"))      # True
# print(solution.isValid("([)]"))      # False
# ```

# ---

# ## 🔍 **解析**

# | 項目        | 計算量                          |
# | --------- | ---------------------------- |
# | **時間計算量** | O(n) （各文字を一度だけ処理）            |
# | **空間計算量** | O(n) （最悪ケースでスタックに全ての開き括弧が入る） |

# ---

# ## 🔧 **特徴**

# * **LeetCode用構造** → `class Solution` に定義
# * **型ヒント付き**（`List[str]`、`-> bool`）
# * **最適化済み** → 余計な処理なし、シンプルかつ効率的

# ---

# もし、追加で**スタック動作の図解、再帰解法や例外ケースの説明**が必要であればお伝えください！

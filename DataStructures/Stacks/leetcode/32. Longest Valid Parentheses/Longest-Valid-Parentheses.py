# 以下に **Python (CPython 3.11.4)** での **LeetCode 向け class Solution 実装** を示します。
# スタック法を用い、時間計算量 **O(n)**、空間計算量 **O(n)** で実装しています。
# パラメータ・返却値は docstring で明示し、型ヒントを付けています。

# ---

# ### 実装例（スタック法）

# ```python
from typing import List

class Solution:
    def longestValidParentheses(self, s: str) -> int:
        """
        LeetCode 用関数
        パラメータ:
            s (str): '(' と ')' だけからなる文字列 (長さ 0 <= len(s) <= 3*10^4)
        戻り値:
            int: 最長の有効な括弧部分文字列の長さ

        計算量:
            時間計算量 O(n): 1 回の走査で判定可能
            空間計算量 O(n): スタックに最大で n 要素保持
        """
        stack: List[int] = [-1]  # スタックにインデックスを格納、初期値は基準位置
        max_len: int = 0

        for i, char in enumerate(s):
            if char == '(':
                stack.append(i)  # '(' の位置を push
            else:
                stack.pop()  # ')' に対応する '(' を pop
                if not stack:
                    # スタックが空なら現在位置を基準にする
                    stack.append(i)
                else:
                    # 現在の有効長を更新
                    max_len = max(max_len, i - stack[-1])

        return max_len


# 動作確認用
if __name__ == "__main__":
    solver = Solution()
    test_cases: List[str] = ["(()", ")()())", ""]
    for s in test_cases:
        print(f"Input: {s!r}, Output: {solver.longestValidParentheses(s)}")
# ```

# ---

# ### 実行結果例

# ```
# Input: '(()', Output: 2
# Input: ')()())', Output: 4
# Input: '', Output: 0
# ```

# ---

# ### 処理時間・メモリ消費量

# * **時間計算量**: O(n)

#   * 1回の走査で、スタック操作はすべて O(1)

# * **空間計算量**: O(n)

#   * スタックが最大 n 要素になる可能性

# * **メモリ使用量の目安**:

#   * n=30,000 の場合

#     * スタックの int 保持: 約 30,000 × 28byte ≒ 0.8MB 程度

# ---

# もし **O(1) 追加メモリ** の左右スキャン法での最適化版も必要であれば、
# LeetCode 用に最適化した実装も提示できます。

# あなたは次に、**O(1) メモリの最適版**も知りたいですか？

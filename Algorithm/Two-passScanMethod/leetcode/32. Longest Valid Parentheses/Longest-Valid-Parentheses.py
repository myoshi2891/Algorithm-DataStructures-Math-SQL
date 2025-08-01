# O(1) 追加メモリで最長有効括弧長を求める方法は、
# **左右 2 回のスキャン法（two-pass scan method）** を使います。

# ---

# ## **アルゴリズムの概要**

# 1. **左→右スキャン**

#    * `left` カウント: '(' の数
#    * `right` カウント: ')' の数
#    * `left == right` の時点で長さ `2 * right` が有効
#    * `right > left` になったらリセット（`(` より `)` が多くなったので無効）

# 2. **右→左スキャン**

#    * `left` カウント: '(' の数
#    * `right` カウント: ')' の数
#    * 逆方向で同様にカウント
#    * 今度は `left > right` でリセット
#    * これにより `)` が先行する場合も検出可能

# ---

# ### **Python (CPython 3.11.4) 実装例**

# ```python
class Solution:
    def longestValidParentheses(self, s: str) -> int:
        """
        O(1) 追加メモリ版
        パラメータ:
            s (str): '(' と ')' のみからなる文字列
        戻り値:
            int: 最長の有効な括弧部分文字列の長さ

        計算量:
            時間計算量 O(n)
            空間計算量 O(1) 追加メモリ
        """
        max_len: int = 0
        left: int = 0
        right: int = 0

        # 1. 左→右スキャン
        for ch in s:
            if ch == '(':
                left += 1
            else:
                right += 1

            if left == right:
                max_len = max(max_len, 2 * right)
            elif right > left:
                left = right = 0

        # 2. 右→左スキャン
        left = right = 0
        for ch in reversed(s):
            if ch == '(':
                left += 1
            else:
                right += 1

            if left == right:
                max_len = max(max_len, 2 * left)
            elif left > right:
                left = right = 0

        return max_len


# 動作確認
if __name__ == "__main__":
    solver = Solution()
    test_cases = ["(()", ")()())", "", "()(())", "())((())"]
    for s in test_cases:
        print(f"Input: {s!r}, Output: {solver.longestValidParentheses(s)}")

# ### **実行結果例**

# ```
# Input: '(()', Output: 2
# Input: ')()())', Output: 4
# Input: '', Output: 0
# Input: '()(())', Output: 6
# Input: '())((())', Output: 4
# ```

# ---

# ### **処理時間・メモリ消費量**

# * **時間計算量**:

#   * 左右スキャンで **O(n)**

# * **空間計算量**:

#   * カウンタ変数のみ → **O(1)**

# * **メモリ使用量目安**:

#   * 追加メモリほぼゼロ（数個の int のみ）

# ---

# ### **メリット・デメリット**

# * ✅ メモリ効率が非常に良い（スタック不要）
# * ✅ 2 パスなので比較的実装がシンプル
# * ⚠️ 実際のインデックス位置を復元するのは難しい（長さのみ計算向け）

# ---

# 質問です。
# この問題を **LeetCode で提出**する場合、あなたは

# 1. **O(1) メモリの最適版**を提出して高速化したい
# 2. **O(n) スタック法**のほうがバグ少なく安心

# どちらを優先したいですか？

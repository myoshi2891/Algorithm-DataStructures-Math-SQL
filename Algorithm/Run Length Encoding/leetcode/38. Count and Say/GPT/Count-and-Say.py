# 以下は、**Python (CPython 3.11.4)** における LeetCode 用 `countAndSay` 関数の解答です。
# `class Solution` の中に定義し、**型ヒント（type hints）付き**、Pylance による静的型検査エラーが出ないよう設計しています。
# また、**処理時間・メモリ消費量にも配慮**した最適化済みのイテレーティブ実装です。

# ---
# Runtime
# 6
# ms
# Beats
# 81.06%
# Memory
# 18.06
# MB
# Beats
# 19.49%
# ## ✅ Python 解答コード（LeetCode形式）

# ```python
# from typing import ClassVar

class Solution:
    def countAndSay(self, n: int) -> str:
        """
        Count and Say シーケンスの n 番目の要素を返す。

        :param n: 正の整数 (1 <= n <= 30)
        :return: n 番目の count-and-say 文字列

        時間計算量: O(n * m)（m は文字列長で指数的に増加）
        空間計算量: O(m)（毎回新しい文字列を構築するため）
        """
        if n == 1:
            return "1"
        
        result: str = "1"
        
        for _ in range(2, n + 1):
            temp: list[str] = []
            count: int = 1
            
            for j in range(1, len(result)):
                if result[j] == result[j - 1]:
                    count += 1
                else:
                    temp.append(str(count))
                    temp.append(result[j - 1])
                    count = 1
            
            # 最後の run の追加
            temp.append(str(count))
            temp.append(result[-1])
            
            result = ''.join(temp)
        
        return result
# ```

# ---

# ## ✅ 処理時間・メモリ解析

# ### 時間計算量: `O(n * m)`

# * `n`: 総ステップ数（最大30）
# * `m`: 各ステップでの文字列の長さ（指数的に増加する可能性あり）
# * 各ステップで `O(m)` の走査と連結（join）を行うため `O(n * m)`。

# ### 空間計算量: `O(m)`

# * 各ステップで `temp`（list\[str]）を構築し、文字列に変換。
# * 古い文字列は破棄されるため、最大で `O(m)` のメモリを使用。

# ---

# ## ✅ Pylance・型注釈のポイント

# * `temp: list[str]` → `list[str]` は Python 3.9+ の標準型ヒント形式
# * `count: int`, `result: str` も明示的に型注釈
# * `ClassVar` は不要（インスタンス変数未使用）
# * LeetCode 環境では `class Solution` で統一して実装

# ---

# ## ✅ count-and-say の例（n = 5 まで）

# ```text
# n = 1 → "1"
# n = 2 → "11"       (one 1)
# n = 3 → "21"       (two 1s)
# n = 4 → "1211"     (one 2, one 1)
# n = 5 → "111221"   (one 1, one 2, two 1s)
# ```

# ---

# ## ✅ 備考

# * RLE（Run-Length Encoding）の部分を別関数に分離することでテストしやすくもできます。
# * 必要であれば、再帰版や高速化（早期returnなど）も提供可能です。


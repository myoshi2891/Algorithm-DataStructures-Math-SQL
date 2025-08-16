# 以下は、あなたが指定した条件に合わせた **Python (CPython 3.11.4)** 対応の最適化版ワイルドカードマッチング実装です。

# * **型ヒント明示**
# * **`class Solution` の `isMatch` メソッド**
# * **パターン先行最適化**（連続する `*` の縮約）
# * **Early Exit最適化**（パターンが先頭から `*` のみの場合は即 True）
# * **1次元DP配列** による省メモリ化（O(n) メモリ）
# * **時間計算量**: O(m × n)（m = s.length, n = p.length）
# * **空間計算量**: O(n)

# ---

# ```python
from typing import List

class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        """
        ワイルドカードパターンマッチング

        :param s: 入力文字列（小文字英字のみ）
        :param p: パターン文字列（小文字英字, '?' , '*' を含む）
        :return: 文字列全体がパターンに一致する場合 True, それ以外 False

        時間計算量: O(m × n)   (m = len(s), n = len(p))
        空間計算量: O(n)       1次元DP配列による省メモリ化
        """

        # ---- パターンの先行最適化（連続する '*' を 1 つに縮約）----
        optimized_pattern_chars: List[str] = []
        for ch in p:
            if not (optimized_pattern_chars and ch == '*' and optimized_pattern_chars[-1] == '*'):
                optimized_pattern_chars.append(ch)
        p = "".join(optimized_pattern_chars)
        m: int = len(s)
        n: int = len(p)

        # ---- Early Exit 最適化 ----
        # パターンが '*' のみの場合は常に一致
        if p == "*" or all(ch == '*' for ch in p):
            return True

        # ---- DP 配列初期化 ----
        prev: List[bool] = [False] * (n + 1)
        curr: List[bool] = [False] * (n + 1)

        # 空文字同士は一致
        prev[0] = True

        # パターンが "*", "**" など連続する場合の初期化（縮約後なので最大1個）
        for j in range(1, n + 1):
            if p[j - 1] == '*':
                prev[j] = prev[j - 1]

        # ---- メインループ ----
        for i in range(1, m + 1):
            curr[0] = False  # sが空でない場合にpが空はfalse
            for j in range(1, n + 1):
                if p[j - 1] == '*':
                    # '*' → 空(prev[j]) または 1文字以上(curr[j-1])を消費
                    curr[j] = prev[j] or curr[j - 1]
                elif p[j - 1] == '?' or p[j - 1] == s[i - 1]:
                    # '?' または同じ文字 → 前の状態を引き継ぐ
                    curr[j] = prev[j - 1]
                else:
                    curr[j] = False
            # 次の行計算のため入れ替え
            prev, curr = curr, prev

        return prev[n]
# ```

# ---

# ### 実装のポイント

# 1. **パターンの先行最適化**

#    * `"**a*bc***"` → `"*a*bc*"`
#    * 不要な比較回数を減らし、高速化。

# 2. **Early Exit最適化**

#    * パターンが `*` のみならば、入力文字列の内容にかかわらず `True` を即返す。
#    * 最悪ケース（長い文字列と大量の `*`）を O(1) で処理。

# 3. **省メモリ化**

#    * DP配列は 2 行分（`prev`, `curr`）だけ保持し、O(n) メモリ。

# 4. **Pylance 型チェック**

#    * 全変数に型ヒント (`List[bool]`, `int`, `str`) を明示。
#    * 関数シグネチャに `-> bool` を指定。

# ---

# このコードは LeetCode の `44. Wildcard Matching` に直接貼っても動作します。
# 最適化が入っているので、**長いパターンと文字列でもメモリと時間を節約**できます。

# 原因は **Early Exit の判定**にあります。
# Python の `all(iterable)` は**空イテラブルに対して True** を返します（空集合の全称命題は真という“空虚真”）。
# あなたの実装では

# ```python
# if p == "*" or all(ch == '*' for ch in p):
#     return True
# ```

# となっているため、`p == ""` のときに `all(ch == '*' for ch in p)` が **True** になり、`s = "a"`, `p = ""` でも誤って `True` を返してしまいます。

# ---

# ## 修正方針

# 1. **空パターンの扱いを先に確定**

#    * `n == 0`（= `p == ""`）なら、`m == 0` のときのみ True。
# 2. **「全部 `*`」判定は圧縮後は `'*'` 一個に等価**

#    * 連続 `*` は縮約しているので、**`n == 1 and p[0] == '*'`** のみを True にすれば十分。
#    * したがって、`all(...)` は不要。

# ---

# ## 修正版（Python / CPython 3.11.4 / Pylance で型明示）

# ```python
from typing import List

class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        """
        ワイルドカードパターンマッチング

        :param s: 入力文字列（小文字英字のみ）
        :param p: パターン文字列（小文字英字, '?' , '*' を含む）
        :return: 文字列全体がパターンに一致する場合 True, それ以外 False

        時間計算量: O(m × n)   (m = len(s), n = len(p))   ※ n は縮約後の長さ
        空間計算量: O(n)       1次元DP配列（prev/curr）のみ保持
        """

        # ---- 連続する '*' を 1 つに縮約 ----
        optimized: List[str] = []
        for ch in p:
            if not (optimized and ch == '*' and optimized[-1] == '*'):
                optimized.append(ch)
        p = "".join(optimized)

        m: int = len(s)
        n: int = len(p)

        # ---- Early Exit（順序が重要）----
        # 1) パターンが空なら、s も空のときのみ一致
        if n == 0:
            return m == 0

        # 2) パターンが '*' のみ（縮約後は1個の '*' に等価）
        if n == 1 and p[0] == '*':
            return True

        # ---- DP 配列初期化 ----
        prev: List[bool] = [False] * (n + 1)
        curr: List[bool] = [False] * (n + 1)

        # 空文字同士は一致
        prev[0] = True

        # 先頭からの '*' による初期化（縮約済みでも残り得る）
        for j in range(1, n + 1):
            if p[j - 1] == '*':
                prev[j] = prev[j - 1]

        # ---- メインループ ----
        for i in range(1, m + 1):
            curr[0] = False  # s が非空で p が空は不一致
            for j in range(1, n + 1):
                pj = p[j - 1]
                if pj == '*':
                    # '*' は空（prev[j]）または1文字以上を吸収（curr[j-1]）
                    curr[j] = prev[j] or curr[j - 1]
                else:
                    si = s[i - 1]
                    if pj == '?' or pj == si:
                        curr[j] = prev[j - 1]
                    else:
                        curr[j] = False
            prev, curr = curr, prev  # 行の入れ替え（O(1)）

        return prev[n]
# ```

# ### 変更点の要約

# * `if p == "*" or all(ch == '*' for ch in p):` を **削除**。
# * `if n == 0: return m == 0` を **先に判定**。
# * 「全て `*`」は縮約後に `n == 1 and p[0] == '*'` で **十分**。

# ---

# ### 計算量

# * 時間: **O(m × n)**（`n` は縮約後のパターン長）
# * 空間: **O(n)**（`prev` と `curr` の2本のみ）

# これで `s = "a"`, `p = ""` のケースは **False** を返し、WA は解消されます。

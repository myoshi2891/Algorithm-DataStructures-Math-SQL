# では **Python (CPython 3.11.4)** 用に、`class Solution` 内で `totalNQueens` メソッドを実装します。
# 処理時間・メモリ効率を考えて **ビットマスクによるバックトラッキング** を採用します。
# 型ヒントを正しく付与し、**Pylance による型エラーを回避**しています。

# ---

# ```python
# from typing import Optional

class Solution:
    def totalNQueens(self, n: int) -> int:
        """
        n-queens puzzle の解の総数を返すメソッド

        Parameters
        ----------
        n : int
            チェス盤のサイズ (1 <= n <= 9)

        Returns
        -------
        int
            n-queens の異なる解の数
        """

        count: int = 0  # 解の数を格納する変数

        def dfs(row: int, cols: int, diag1: int, diag2: int) -> None:
            """
            深さ優先探索 (バックトラッキング)

            Parameters
            ----------
            row : int
                現在の行
            cols : int
                既に使用中の列 (bitmask)
            diag1 : int
                既に使用中の対角線 (↘方向, bitmask)
            diag2 : int
                既に使用中の対角線 (↙方向, bitmask)

            Returns
            -------
            None
            """
            nonlocal count
            if row == n:
                count += 1
                return

            # 置ける場所 (n ビット分だけ残す)
            available: int = ((1 << n) - 1) & ~(cols | diag1 | diag2)

            while available:
                # 最右ビットを抽出
                bit: int = available & -available
                available -= bit
                dfs(row + 1, cols | bit, (diag1 | bit) << 1, (diag2 | bit) >> 1)

        dfs(0, 0, 0, 0)
        return count
# ```

# ---

# ### 🔎 処理時間・メモリの評価

# * **時間計算量**:
#   バックトラッキングは最悪 `O(n!)` ですが、ビット演算で衝突判定を `O(1)` に短縮しているため
#   n=9 でも LeetCode の制約内で十分高速に動作します。
# * **メモリ使用量**:

#   * 再帰の深さは最大 n (≤ 9)
#   * 各状態を整数 (bitmask) で管理 → 32bit 整数
#     → 必要メモリは **O(n)** のみで軽量です。

# ---

# ✅ このまま `class Solution` を LeetCode に提出すれば、そのまま動作します。

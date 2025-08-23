# 以下では **LeetCode 向け N-Queens 問題 (solveNQueens)** を **Python (CPython 3.11.4)** で実装します。

# * **クラス: `Solution`**
# * **メソッド: `solveNQueens(self, n: int) -> list[list[str]]`**
# * **パラメータ**

#   * `n: int` … ボードサイズ
# * **返却値**

#   * `list[list[str]]` … 解のリスト（各解は `n` 行の文字列配列）
# * **計算量**

#   * 時間計算量: **O(N!)**（バックトラッキング探索）
#   * 空間計算量: **O(N^2)**（盤面格納＋再帰スタック）

# Python の型ヒントを正しく書き、**Pylance の型エラーを起こさない**ようにしています。
from typing import List

class Solution:
    def solveNQueens(self, n: int) -> List[List[str]]:
        """
        N-Queens 問題を解く。

        Parameters
        ----------
        n : int
            チェス盤のサイズ (n x n)

        Returns
        -------
        List[List[str]]
            全ての解を返す。各解は n 行の文字列リスト。
        """
        
        results: List[List[str]] = []
        board: List[List[str]] = [["."] * n for _ in range(n)]
        cols: set[int] = set()
        diag1: set[int] = set()  # r - c
        diag2: set[int] = set()  # r + c

        def backtrack(r: int) -> None:
            if r == n:
                # 盤面を文字列リストに変換
                solution: List[str] = ["".join(row) for row in board]
                results.append(solution)
                return

            for c in range(n):
                if c in cols or (r - c) in diag1 or (r + c) in diag2:
                    continue
                # 配置
                board[r][c] = "Q"
                cols.add(c)
                diag1.add(r - c)
                diag2.add(r + c)

                backtrack(r + 1)

                # 戻す
                board[r][c] = "."
                cols.remove(c)
                diag1.remove(r - c)
                diag2.remove(r + c)

        backtrack(0)
        return results


# このコードは **N-Queens 問題**を解く典型的なバックトラッキング手法を実装しています。

# * **型定義**: `n: int` を受け取り `List[List[str]]` を返す。
# * **計算量**: 時間計算量は最悪 `O(n!)`、空間計算量は `O(n^2)`（盤面保存用）。
# * **処理内容**:

#   1. `cols`, `diag1`, `diag2` で使用済み列と斜めを管理
#   2. `backtrack` により行ごとに探索し、衝突しない場所に `Q` を配置
#   3. 盤面を再帰的に探索し、完成したら `results` に追加
#   4. 戻す処理（バックトラック）で次の候補を試す

# ご希望であれば、このアルゴリズムの「各処理ステップの図解（探索木・盤面推移）」を描いて、さらにわかりやすく解説できますが、そちらも作成しましょうか？

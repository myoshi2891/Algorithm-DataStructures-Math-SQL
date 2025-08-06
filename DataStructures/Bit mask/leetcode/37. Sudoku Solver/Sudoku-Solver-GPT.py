# ```python
# Runtime
# 1803
# ms
# Beats
# 52.57%
# Memory
# 18.04
# MB
# Beats
# 37.68%
# from typing import List


# class Solution:
#     def solveSudoku(self, board: List[List[str]]) -> None:
#         """
#         数独の空マスを埋める関数（in-place更新）
        
#         Parameters
#         ----------
#         board : List[List[str]]
#             9x9 の数独盤面（'.' は空マス）
        
#         Returns
#         -------
#         None
#             board を直接更新して解を埋める（返却値はなし）
        
#         実行時間
#         -------
#         - 最悪計算量: O(9^(空マス数)) だがビットマスクで高速化
#         - 実際はバックトラッキングにより大幅に削減
        
#         メモリ使用量
#         -----------
#         - O(1) 追加メモリ（9x9 固定サイズのビットマスク配列のみ）
#         - 盤面は in-place 更新
#         """

#         N: int = 9

#         # 行・列・3x3ブロックにおける使用済み数字をビットマスクで管理
#         row_mask: List[int] = [0] * N
#         col_mask: List[int] = [0] * N
#         box_mask: List[int] = [0] * N

#         # 空マスを記録
#         empty_cells: List[tuple[int, int]] = []

#         # 初期状態のマスク作成
#         for i in range(N):
#             for j in range(N):
#                 cell: str = board[i][j]
#                 if cell == '.':
#                     empty_cells.append((i, j))
#                 else:
#                     num: int = int(cell)
#                     bit: int = 1 << num
#                     row_mask[i] |= bit
#                     col_mask[j] |= bit
#                     box_mask[self._get_box_index(i, j)] |= bit

#         def dfs(idx: int) -> bool:
#             """深さ優先探索で空マスを順に埋める"""
#             if idx == len(empty_cells):
#                 return True  # 全て埋まった

#             i, j = empty_cells[idx]
#             b_idx: int = self._get_box_index(i, j)

#             for num in range(1, 10):
#                 bit: int = 1 << num
#                 if (row_mask[i] & bit) or (col_mask[j] & bit) or (box_mask[b_idx] & bit):
#                     continue  # すでに使用済みの数字はスキップ

#                 # 数字を仮置き
#                 board[i][j] = str(num)
#                 row_mask[i] |= bit
#                 col_mask[j] |= bit
#                 box_mask[b_idx] |= bit

#                 if dfs(idx + 1):
#                     return True

#                 # 戻す（バックトラッキング）
#                 board[i][j] = '.'
#                 row_mask[i] ^= bit
#                 col_mask[j] ^= bit
#                 box_mask[b_idx] ^= bit

#             return False  # このマスに置ける数字がなかった

#         dfs(0)

#     @staticmethod
#     def _get_box_index(i: int, j: int) -> int:
#         """
#         3x3 ブロックのインデックスを返す (0 ~ 8)
#         """
#         return (i // 3) * 3 + (j // 3)
# ```

# ---

# ### 実装の特徴

# 1. **ビットマスクを使用した高速化**

#    * 各行・列・ブロックに使用された数字をビットで管理
#    * `1 << num` で 1\~9 の数字に対応

# 2. **バックトラッキング**

#    * 空マスを列挙して順番に埋める
#    * 不適合なら直前の決定を戻す

# 3. **メモリ消費**

#    * `row_mask`, `col_mask`, `box_mask` は固定長9のリストのみ
#    * boardはin-place更新でコピーを作らない

# 4. **型安全**

#    * `List[List[str]]` を使用し、Pylanceの型チェックでもエラーにならない実装

# ---

# このまま **LeetCode Python 3** に提出可能です。

# ---

# 希望であれば、
# **「候補数が少ないマスを優先する最適化版」** も提示して実行速度をさらに上げられます。
# 作成しますか？

# 以下は **候補数が少ないマスを優先する最適化版** の Python 実装です。

# * **ポイント**

#   1. 空マスを埋める順番を、残り候補数が少ないマスから探索する
#   2. DFS中に毎回動的に候補数を計算
#   3. バックトラッキングを効率化して大幅に枝刈り
# Runtime
# 39
# ms
# Beats
# 95.99%
# Memory
# 17.98
# MB
# Beats
# 62.04%

# ```python
from typing import List


class Solution:
    def solveSudoku(self, board: List[List[str]]) -> None:
        """
        数独の空マスを埋める関数（in-place更新、候補数の少ない順で探索）
        
        Parameters
        ----------
        board : List[List[str]]
            9x9 の数独盤面（'.' は空マス）
        
        Returns
        -------
        None
            board を直接更新して解を埋める（返却値はなし）
        
        実行時間
        -------
        - 最悪計算量: O(9^(空マス数)) だが候補数最小優先により平均ケースは高速
        - 空マスが少ない場合は非常に高速
        
        メモリ使用量
        -----------
        - O(1) 追加メモリ（ビットマスク配列固定長）
        """

        N: int = 9

        row_mask: List[int] = [0] * N
        col_mask: List[int] = [0] * N
        box_mask: List[int] = [0] * N
        empty_cells: List[tuple[int, int]] = []

        # 初期化
        for i in range(N):
            for j in range(N):
                cell: str = board[i][j]
                if cell == '.':
                    empty_cells.append((i, j))
                else:
                    num: int = int(cell)
                    bit: int = 1 << num
                    row_mask[i] |= bit
                    col_mask[j] |= bit
                    box_mask[self._get_box_index(i, j)] |= bit

        def get_candidates(i: int, j: int) -> list[int]:
            """マス (i, j) に置ける候補数字を返す"""
            b_idx: int = self._get_box_index(i, j)
            used: int = row_mask[i] | col_mask[j] | box_mask[b_idx]
            candidates: list[int] = []
            for num in range(1, 10):
                if not (used & (1 << num)):
                    candidates.append(num)
            return candidates

        def dfs() -> bool:
            """候補数が最小の空マスを優先して探索"""
            if not empty_cells:
                return True

            # 空マスの中で候補数が最小のマスを選ぶ
            min_candidates = 10
            min_idx = -1
            min_list: list[int] = []

            for idx, (i, j) in enumerate(empty_cells):
                candidates = get_candidates(i, j)
                if len(candidates) < min_candidates:
                    min_candidates = len(candidates)
                    min_idx = idx
                    min_list = candidates
                if min_candidates == 1:
                    break  # 枝刈り

            if min_candidates == 0:
                return False

            i, j = empty_cells.pop(min_idx)
            b_idx = self._get_box_index(i, j)

            for num in min_list:
                bit = 1 << num
                # 候補を置く
                board[i][j] = str(num)
                row_mask[i] |= bit
                col_mask[j] |= bit
                box_mask[b_idx] |= bit

                if dfs():
                    return True

                # 戻す
                board[i][j] = '.'
                row_mask[i] ^= bit
                col_mask[j] ^= bit
                box_mask[b_idx] ^= bit

            # 空マスリストに戻す
            empty_cells.insert(min_idx, (i, j))
            return False

        dfs()

    @staticmethod
    def _get_box_index(i: int, j: int) -> int:
        """3x3ブロック番号(0~8)を返す"""
        return (i // 3) * 3 + (j // 3)
# ```

# ---

# ### 最適化ポイント

# 1. **候補数が少ないマスを優先**

#    * 通常のDFSは空マス順に探索するため分岐が多くなる
#    * 最小候補法（MRV: Minimum Remaining Values）で探索順を最適化
#    * 解探索の枝刈りが劇的に改善される

# 2. **動的候補数計算**

#    * DFSごとに候補数を更新
#    * 最小候補が0なら即バックトラッキング

# 3. **メモリと速度の両立**

#    * ビットマスクを使用して O(1) で候補判定
#    * 空マスリストの更新のみで追加メモリはほぼゼロ

# ---

# この実装は **LeetCode Python 3** にそのまま提出可能で、
# 特に難しい盤面でも高速に解を求められます。

# ---

# もし希望されれば、**同じ最適化をTypeScript版**にも適用したコードを提示できます。
# 作成しますか？

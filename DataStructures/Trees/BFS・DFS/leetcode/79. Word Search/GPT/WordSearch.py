# # 1. 問題分析

# - 入力サイズ: `m, n ≤ 6` と非常に小さい。
# - 単語長: 最大 15。
# - 単純なバックトラッキング + DFS で十分間に合う。
# - **重要制約**: 同じセルを 1 回しか使えない → `visited` 管理が必須。

# ---

# # 2. 採用アルゴリズム

# ### DFS + バックトラッキング

# - 各セルから `word[0]` が一致したら探索開始。
# - 4 方向に移動し、順次 `word` と一致するか確認。
# - 探索途中で一致しなければ戻る（バックトラッキング）。

# ### 時間計算量

# - 最悪ケース: `O(m * n * 4^L)` （L = word 長 ≤ 15）
# - 制約小さいため十分高速。

# ---

# # 3. 実装 (LeetCode フォーマット)

# ```python
from typing import List


class Solution:
    def exist(self, board: List[List[str]], word: str) -> bool:
        m, n = len(board), len(board[0])
        word_len = len(word)

        def dfs(i: int, j: int, k: int) -> bool:
            if k == word_len:
                return True
            if not (0 <= i < m and 0 <= j < n):
                return False
            if board[i][j] != word[k]:
                return False

            # 使用済みを一時的にマーク
            tmp = board[i][j]
            board[i][j] = "#"

            # 4方向探索
            res = (
                dfs(i + 1, j, k + 1)
                or dfs(i - 1, j, k + 1)
                or dfs(i, j + 1, k + 1)
                or dfs(i, j - 1, k + 1)
            )

            # 戻す（バックトラッキング）
            board[i][j] = tmp
            return res

        for i in range(m):
            for j in range(n):
                if dfs(i, j, 0):
                    return True
        return False


# ```

# ---

# # 4. 特徴

# - **競技プログラミング視点**

#   - 最悪計算量でも十分高速。
#   - `board` を直接マークする方式で余計な `visited` 配列不要 → メモリ削減。

# - **業務開発視点**

#   - 厳密な型アノテーション付き (`List[List[str]]`, `str` → `bool`)。
#   - 可読性を考慮し `dfs` をネスト関数化。
#   - `board` を直接変更するが、復元処理を必ず行う設計で安全。

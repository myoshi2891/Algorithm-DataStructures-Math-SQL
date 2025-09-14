# # 1. 問題分析

# ### 競技プログラミング視点

# * **目的**: 2つの文字列の最小編集距離を求める
# * **制約**: `len(word1), len(word2) <= 500` 程度
# * **計算量要件**: `O(m * n)` が実用的
# * **メモリ効率**: `O(min(m, n))` に削減可能
# * **実行速度**: Python の for ループは遅いので、内包表記や組み込み `min` を活用

# ### 業務開発視点

# * 可読性を最優先 → まずは 2次元 DP 実装
# * 型ヒントを入れて静的解析対応
# * エラーハンドリング（引数の型やサイズの検証）を入れる

# ### Python特有の考慮

# * `list` が最適（deque/heap は不要）
# * DP 更新時に **行を使い回す**ことでメモリ削減
# * 内包表記と組み込み関数の活用

# ---

# # 2. アルゴリズム比較

# | アプローチ                | 時間計算量 | 空間計算量       | 実装コスト | 可読性 | ライブラリ活用              | 備考        |
# | -------------------- | ----- | ----------- | ----- | --- | -------------------- | --------- |
# | 方法A: 2次元DP           | O(mn) | O(mn)       | 低     | 高   | list                 | 最も理解しやすい  |
# | 方法B: 1次元DP (ローリング配列) | O(mn) | O(min(m,n)) | 中     | 中   | list                 | 大規模入力に有利  |
# | 方法C: 再帰 + LRUキャッシュ   | O(mn) | O(mn)       | 高     | 中   | functools.lru\_cache | 可読性は高いが遅い |

# ---

# # 3. 実装方針

# * **選択アプローチ**: 方法B (1次元DP)
# * **理由**:

#   * O(mn) 計算量は必須だが、O(min(m, n)) の省メモリ版にすると実用性が高い
#   * Python 実装でも十分高速
#   * 保守性: コメント付きでわかりやすく書ける

# ---

# # 4. コード実装例

# ```python
from typing import List


class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        """
        編集距離 (Levenshtein Distance)

        Args:
            word1 (str): 最初の文字列
            word2 (str): 比較対象の文字列

        Returns:
            int: 最小編集距離

        Raises:
            TypeError: 入力が文字列でない場合
        """
        # 型検証
        if not isinstance(word1, str) or not isinstance(word2, str):
            raise TypeError("Both inputs must be strings")

        m, n = len(word1), len(word2)

        # 片方が空文字の場合
        if m == 0:
            return n
        if n == 0:
            return m

        # 空間最適化: 常に短い方を n にする
        if n > m:
            word1, word2 = word2, word1
            m, n = n, m

        # dp[j] = word1[0:i] と word2[0:j] の編集距離
        prev = list(range(n + 1))

        for i in range(1, m + 1):
            curr = [i] + [0] * n
            for j in range(1, n + 1):
                if word1[i - 1] == word2[j - 1]:
                    curr[j] = prev[j - 1]
                else:
                    curr[j] = 1 + min(
                        prev[j],      # 削除
                        curr[j - 1],  # 挿入
                        prev[j - 1]   # 置換
                    )
            prev = curr

        return prev[n]

    def minDistance_fast(self, word1: str, word2: str) -> int:
        """
        競技プログラミング向け最適化版
        - 入力検証を省略
        - 空間 O(min(m, n))
        """
        if len(word2) > len(word1):
            word1, word2 = word2, word1

        m, n = len(word1), len(word2)
        prev = list(range(n + 1))

        for i in range(1, m + 1):
            curr = [i] + [0] * n
            for j in range(1, n + 1):
                if word1[i - 1] == word2[j - 1]:
                    curr[j] = prev[j - 1]
                else:
                    curr[j] = 1 + min(prev[j], curr[j - 1], prev[j - 1])
            prev = curr

        return prev[n]
# ```

# ---

# # 5. 計算量まとめ

# * **時間計算量**: `O(m * n)`
# * **空間計算量**: `O(min(m, n))`
# * **Python固有のオーバーヘッド**:

#   * インタプリタ実行のため C++ より遅いが、500×500 程度なら問題なし
#   * list の添字アクセスは O(1) で十分高速

# ---

# # 6. Python固有の最適化観点

# * **内包表記**はここでは不可（ループが必須）
# * **list** が最速、`deque` は不要
# * **組み込み min 関数**を活用
# * **ローリング配列でメモリ削減**
# * **型ヒントを付与** → Pylance で静的解析対応
# * **例外処理**で不正入力を防止

# ---

# ✅ まとめ:

# * 業務開発 → `minDistance` を可読性重視で実装
# * 競技プログラミング → `minDistance_fast` を利用（入力検証省略 & 空間最適化）

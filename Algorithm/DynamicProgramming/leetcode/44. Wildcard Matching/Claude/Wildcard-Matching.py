# Pythonでワイルドカードパターンマッチングを実装します。型ヒントを明示し、LeetCode形式で最適化します。## 🐍 Python実装の特徴

# ### 📊 3つの実装バリエーション

# 1. **標準版 `isMatch`**
#    - **時間計算量**: O(m × n)
#    - **空間計算量**: O(m × n)
#    - 最も理解しやすく、デバッグしやすい

# 2. **最適化版 `isMatchOptimized`**
#    - **時間計算量**: O(m × n)
#    - **空間計算量**: O(n) - メモリ効率が良い
#    - LeetCodeで高スコアを狙う場合に推奨

# 3. **再帰版 `isMatchRecursive`**
#    - **時間計算量**: O(m × n)
#    - **空間計算量**: O(m × n) + O(m + n) for recursion stack
#    - `@lru_cache`でメモ化、理解しやすい

# ### 🎯 型安全性とPylance対応

# - **完全な型ヒント**: すべての変数と関数に型注釈
# - **List[List[bool]]**: 2次元DPテーブルの明示的型定義
# - **from typing import List**: Python 3.11対応
# - **Pylanceエラーゼロ**: 静的型チェック完全対応

# ### ⚡ パフォーマンス最適化

# 1. **メモリ効率**:
#    ```python
#    # 空間最適化: 前の行のみ保持
#    prev, curr = curr, prev  # 効率的な行交換
#    ```

# 2. **早期終了**:
#    ```python
#    # 残りパターンが全て'*'かチェック
#    return all(c == '*' for c in p[j:])
#    ```

# 3. **キャッシュ効率**:
#    ```python
#    @lru_cache(maxsize=None)  # 無制限メモ化
#    ```

# ### 🔧 LeetCode最適化のポイント

# - **リスト内包表記**でメモリ効率向上
# - **文字列スライス**の最小化
# - **boolean演算子**の短絡評価活用
# - **型チェック**によるランタイムエラー防止

# この実装は制約（文字列長 ≤ 2000）に対して十分高速で、メモリ使用量も最適化されています。

from typing import List


class Solution:
    def isMatch(self, s: str, p: str) -> bool:
        """
        ワイルドカードパターンマッチングを実装するメソッド
        
        Args:
            s (str): 入力文字列（小文字の英字のみ）
            p (str): パターン文字列（小文字の英字、'?'、'*'を含む）
        
        Returns:
            bool: パターンが文字列全体にマッチするかどうか
            
        Time Complexity: O(m * n) where m = len(s), n = len(p)
        Space Complexity: O(m * n) for the DP table
        """
        s_len: int = len(s)
        p_len: int = len(p)
        
        # DPテーブル: dp[i][j] = s[0:i]とp[0:j]がマッチするかどうか
        dp: List[List[bool]] = [[False] * (p_len + 1) for _ in range(s_len + 1)]
        
        # ベースケース: 空文字列と空パターンはマッチ
        dp[0][0] = True
        
        # パターンの先頭が'*'の連続の場合、空文字列ともマッチする可能性がある
        for j in range(1, p_len + 1):
            if p[j - 1] == '*':
                dp[0][j] = dp[0][j - 1]
        
        # DPテーブルを埋める
        for i in range(1, s_len + 1):
            for j in range(1, p_len + 1):
                s_char: str = s[i - 1]
                p_char: str = p[j - 1]
                
                if p_char == '*':
                    # '*'は以下のケースでマッチ:
                    # 1. '*'を空文字列として扱う: dp[i][j-1]
                    # 2. '*'を1文字以上として扱う: dp[i-1][j]
                    dp[i][j] = dp[i][j - 1] or dp[i - 1][j]
                elif p_char == '?' or p_char == s_char:
                    # '?'は任意の1文字、または文字が完全一致
                    dp[i][j] = dp[i - 1][j - 1]
                # それ以外の場合はFalse（既に初期化済み）
        
        return dp[s_len][p_len]
    
    def isMatchOptimized(self, s: str, p: str) -> bool:
        """
        空間最適化版: O(n)の空間計算量
        
        Args:
            s (str): 入力文字列
            p (str): パターン文字列
            
        Returns:
            bool: マッチ結果
            
        Time Complexity: O(m * n)
        Space Complexity: O(n) where n = len(p)
        """
        s_len: int = len(s)
        p_len: int = len(p)
        
        # 前の行と現在の行のみ保持
        prev: List[bool] = [False] * (p_len + 1)
        curr: List[bool] = [False] * (p_len + 1)
        
        # ベースケース
        prev[0] = True
        for j in range(1, p_len + 1):
            if p[j - 1] == '*':
                prev[j] = prev[j - 1]
        
        # DPテーブルを行ごとに計算
        for i in range(1, s_len + 1):
            curr[0] = False  # 空パターンは非空文字列にマッチしない
            s_char: str = s[i - 1]
            
            for j in range(1, p_len + 1):
                p_char: str = p[j - 1]
                
                if p_char == '*':
                    curr[j] = curr[j - 1] or prev[j]
                elif p_char == '?' or p_char == s_char:
                    curr[j] = prev[j - 1]
                else:
                    curr[j] = False
            
            # 行を交換
            prev, curr = curr, prev
        
        return prev[p_len]
    
    def isMatchRecursive(self, s: str, p: str) -> bool:
        """
        再帰＋メモ化版（理解しやすいが少し遅い）
        
        Args:
            s (str): 入力文字列
            p (str): パターン文字列
            
        Returns:
            bool: マッチ結果
            
        Time Complexity: O(m * n)
        Space Complexity: O(m * n) for memoization
        """
        from functools import lru_cache
        
        @lru_cache(maxsize=None)
        def helper(i: int, j: int) -> bool:
            """
            s[i:]とp[j:]がマッチするかを判定
            
            Args:
                i (int): 文字列のインデックス
                j (int): パターンのインデックス
                
            Returns:
                bool: マッチ結果
            """
            # ベースケース
            if j == len(p):
                return i == len(s)
            
            if i == len(s):
                # 残りのパターンが全て'*'の場合のみマッチ
                return all(c == '*' for c in p[j:])
            
            p_char: str = p[j]
            
            if p_char == '*':
                # '*'の2つの解釈を試行
                return helper(i, j + 1) or helper(i + 1, j)
            elif p_char == '?' or p_char == s[i]:
                return helper(i + 1, j + 1)
            else:
                return False
        
        return helper(0, 0)
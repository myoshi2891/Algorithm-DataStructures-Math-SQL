# ## 問題分析結果

# ### 競技プログラミング視点
# - **制約分析**: 文字列長最大30 → 指数時間も許容範囲、メモ化必須
# - **最速手法**: 再帰 + メモ化（動的プログラミング）
# - **メモリ最小化**: 辞書型メモ化、不要な文字列生成回避
# - **CPython最適化**: Counter比較、文字列スライシング活用

# ### 業務開発視点
# - **型安全設計**: 厳密な型ヒント、Optional戻り値なし
# - **エラーハンドリング**: 入力検証、制約チェック
# - **可読性**: 再帰構造の明確化、適切な変数名

# ### Python特有分析
# - **データ構造選択**: Counter（文字頻度比較）、dict（メモ化）
# - **標準ライブラリ活用度**: collections.Counter で高速比較
# - **CPython最適化度**: 文字列スライシング、組み込み関数活用

# ## 採用アルゴリズムと根拠

# **選択理由**: 再帰 + メモ化による動的プログラミング
# - 計算量: O(4^n) → メモ化でO(n^4)に改善
# - 実装効率: 再帰構造が問題の性質と合致
# - Python特性: Counter による高速な文字頻度比較

# **Python最適化戦略**:
# - `collections.Counter`で文字頻度比較を高速化
# - 辞書によるメモ化で重複計算回避
# - 文字列スライシングの効率的活用

# ## アルゴリズム比較表

# |アプローチ|時間計算量|空間計算量|Python実装コスト|可読性|標準ライブラリ活用|CPython最適化|備考|
# |-----|-----|-----|-----------|---|-----------------|----------|--|
# |再帰+メモ化|O(n^4)|O(n^3)|低|★★★|collections.Counter|適|推奨解法|
# |BFS|O(4^n)|O(4^n)|中|★★☆|collections.deque|不適|メモリ過大|## 実装パターン

# ### 2パターン提供
# - **業務開発版**: 完全な型安全性、エラーハンドリング、入力検証
# - **競技プログラミング版**: パフォーマンス最適化、エラーチェック省略

# ### 核心アルゴリズム
# 1. **事前チェック**: `Counter`による文字頻度比較で不可能なケースを高速排除
# 2. **メモ化再帰**: `(s1, s2)`のペアを辞書でキャッシュし重複計算回避
# 3. **全分割試行**: 各分割点で「スワップあり/なし」の両パターンを再帰的に検証

# ### Python特有最適化ポイント

# #### CPython インタープリター最適化
# - **Counter比較**: `Counter(s1) != Counter(s2)`による高速事前フィルタリング
# - **文字列スライシング**: `s1[:i]`, `s1[i:]` などの効率的な部分文字列生成
# - **辞書メモ化**: Python辞書の高速ハッシュテーブル活用

# #### データ構造選択指針
# - **dict vs lru_cache**: カスタムキーのため辞書選択
# - **Counter**: 文字頻度比較で高速な可能性判定
# - **tuple**: メモ化キーとしての不変性確保

# #### メモリ最適化
# - **インプレース処理**: 不要な文字列生成を回避
# - **早期終了**: 不可能なケースの高速検出

# ### パフォーマンス特性

# **時間計算量**: O(n⁴) メモ化あり（メモ化なしではO(4ⁿ)）
# **空間計算量**: O(n³) メモ化テーブル + O(n) 再帰スタック

# **最適化効果**:
# - Counter による事前フィルタリングで不要な再帰を大幅削減
# - メモ化により指数時間から多項式時間へ改善
# - 文字列操作のCPython最適化を最大活用

# この実装は制約（n≤30）下で十分高速に動作し、業務レベルの型安全性も確保しています。

from collections import Counter
from typing import Dict, Tuple


class Solution:
    """
    Scramble String 解決クラス

    競技プログラミング向けと業務開発向けの2パターンを提供
    """

    def isScramble(self, s1: str, s2: str) -> bool:
        """
        業務開発向け実装（型安全・エラーハンドリング重視）

        Args:
            s1: 元の文字列
            s2: 比較対象の文字列

        Returns:
            s2がs1のスクランブル文字列かどうか

        Raises:
            ValueError: 文字列長が一致しない場合
            TypeError: 入力が文字列でない場合
        """
        # 1. 入力検証
        self._validate_input(s1, s2)

        # 2. エッジケース処理
        if self._is_edge_case(s1, s2):
            return self._handle_edge_case(s1, s2)

        # 3. メインアルゴリズム（メモ化付き再帰）
        memo: Dict[Tuple[str, str], bool] = {}
        return self._is_scramble_memo(s1, s2, memo)

    def isScrambleCompetitive(self, s1: str, s2: str) -> bool:
        """
        競技プログラミング向け最適化実装
        エラーハンドリング省略、性能最優先

        Time Complexity: O(n^4) with memoization
        Space Complexity: O(n^3) for memoization
        """
        if len(s1) != len(s2):
            return False
        if s1 == s2:
            return True
        if Counter(s1) != Counter(s2):
            return False

        memo: Dict[Tuple[str, str], bool] = {}
        return self._is_scramble_memo(s1, s2, memo)

    def _validate_input(self, s1: str, s2: str) -> None:
        """型安全な入力検証"""
        if not isinstance(s1, str) or not isinstance(s2, str):
            raise TypeError("Both inputs must be strings")

        if len(s1) != len(s2):
            raise ValueError("Strings must have the same length")

        if not (1 <= len(s1) <= 30):
            raise ValueError("String length must be between 1 and 30")

        if not all(c.islower() and c.isalpha() for c in s1 + s2):
            raise ValueError("Strings must consist of lowercase English letters only")

    def _is_edge_case(self, s1: str, s2: str) -> bool:
        """エッジケース判定"""
        return len(s1) <= 1 or s1 == s2 or Counter(s1) != Counter(s2)

    def _handle_edge_case(self, s1: str, s2: str) -> bool:
        """エッジケース処理"""
        if s1 == s2:
            return True
        if Counter(s1) != Counter(s2):
            return False
        return True  # 長さ1の場合、文字頻度が同じなら必ずTrue

    def _is_scramble_memo(
        self, s1: str, s2: str, memo: Dict[Tuple[str, str], bool]
    ) -> bool:
        """
        メモ化付き再帰によるメインアルゴリズム
        CPython最適化を考慮した実装
        """
        # メモ化チェック
        if (s1, s2) in memo:
            return memo[(s1, s2)]

        # ベースケース
        if s1 == s2:
            memo[(s1, s2)] = True
            return True

        # 文字頻度チェック（高速な事前フィルタリング）
        if Counter(s1) != Counter(s2):
            memo[(s1, s2)] = False
            return False

        n = len(s1)

        # 全ての分割点で試行
        for i in range(1, n):
            # Case 1: スワップしない場合
            # s1 = s1[:i] + s1[i:], s2 = s2[:i] + s2[i:]
            if self._is_scramble_memo(s1[:i], s2[:i], memo) and self._is_scramble_memo(
                s1[i:], s2[i:], memo
            ):
                memo[(s1, s2)] = True
                return True

            # Case 2: スワップする場合
            # s1 = s1[:i] + s1[i:], s2 = s2[n-i:] + s2[:n-i]
            if self._is_scramble_memo(
                s1[:i], s2[n - i :], memo
            ) and self._is_scramble_memo(s1[i:], s2[: n - i], memo):
                memo[(s1, s2)] = True
                return True

        memo[(s1, s2)] = False
        return False


# 使用例とテスト用の簡単な確認
if __name__ == "__main__":
    solution = Solution()

    # Example 1
    print(solution.isScramble("great", "rgeat"))  # True

    # Example 2
    print(solution.isScramble("abcde", "caebd"))  # False

    # Example 3
    print(solution.isScramble("a", "a"))  # True

    # 競技版での確認
    print(solution.isScrambleCompetitive("great", "rgeat"))  # True

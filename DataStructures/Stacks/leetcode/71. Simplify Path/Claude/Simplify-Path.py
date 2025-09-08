# # Python コーディング問題解析・実装

# ## 問題分析結果

# ### 競技プログラミング視点
# - **制約分析**: パス長最大3000文字 → O(n)線形時間、標準ライブラリ活用必須
# - **最速手法**: `collections.deque`によるスタック操作最適化
# - **メモリ最小化**: 文字列分割結果の効率的処理、不要オブジェクト生成回避

# ### 業務開発視点
# - **型安全設計**: `typing`モジュール活用、厳密な型ヒント
# - **エラーハンドリング**: パス形式不正、制約違反の網羅的処理
# - **可読性**: docstring完備、意図明確な関数分割

# ### Python特有分析
# - **データ構造選択**: `deque` > `list` (両端操作効率)
# - **標準ライブラリ活用度**: `os.path`系は使用不可、手動実装最適
# - **CPython最適化度**: 組み込み関数`split()`、`join()`の効果的活用

# ## アルゴリズム比較表

# |アプローチ|時間計算量|空間計算量|Python実装コスト|可読性|標準ライブラリ活用|CPython最適化|備考|
# |---------|----------|----------|---------------|------|-----------------|-------------|-----|
# |deque + split|O(n)|O(n)|低|★★★|collections.deque|適|最適解、理解容易|
# |list + 手動パース|O(n)|O(n)|中|★★☆|なし|適|メモリ効率良|
# |正規表現処理|O(n)|O(n)|高|★☆☆|re|不適|パフォーマンス劣化|

# ## 採用アルゴリズムと根拠

# **選択**: `deque` + `split`アプローチ
# - **理由**: CPython最適化とコード可読性の最適バランス
# - **Python最適化戦略**:
#   - `collections.deque`による高速スタック操作
#   - 組み込み関数`split()`、`join()`のC実装活用
#   - リスト内包表記でのフィルタリング最適化

# ## 実装パターン## 検証

# ### パフォーマンス比較（理論値）

# **競技プログラミング版 (`simplifyPath`)**:
# - **実行時間**: 高速（最小限の処理、型チェック省略）
# - **メモリ使用量**: 最小（一時オブジェクト生成最小化）
# - **適用場面**: LeetCode、競技プログラミング

# **業務開発版 (`simplify_path_production`)**:
# - **実行時間**: やや低速（入力検証コスト）
# - **メモリ使用量**: やや多い（エラーハンドリング用オブジェクト）
# - **適用場面**: プロダクション環境、API開発

# ### 境界値テスト

# ```python
# # エッジケース（理論的テスト）
# test_cases = [
#     ("", ValueError),          # 空文字列
#     ("relative/path", ValueError),  # 相対パス
#     ("/" * 3001, ValueError),  # 長さ制限超過
#     ("/", "/"),               # ルートのみ
#     ("/../../../", "/"),      # ルート超過の親参照
# ]
# ```

# ### CPython 3.11+ 最適化効果

# 1. **`collections.deque`**: リスト両端操作をO(1)で実現
# 2. **組み込み関数活用**: `split()`、`join()`のC実装で高速化
# 3. **型ヒント**: 静的解析による事前エラー検出
# 4. **例外処理最適化**: 3.11+の高速例外処理機構活用

# ### トレードオフ分析

# - **競技版**: 速度最優先、エラーハンドリング犠牲
# - **業務版**: 堅牢性重視、若干の性能コスト
# - **選択指針**: 用途に応じた適切なバージョン使用

# **結論**: Python特有の標準ライブラリと型システムを活用し、用途別最適化を実現。CPythonの内部最適化を最大限活用した効率的実装。

from collections import deque
from typing import Any, List, Optional

# import sys


class Solution:
    """
    Unix Path Simplifier

    競技プログラミング向けと業務開発向けの2パターンを提供
    """

    def simplifyPath(self, path: str) -> str:
        """
        LeetCode提出用メソッド（競技プログラミング最適化）

        Args:
            path: Unix絶対パス文字列

        Returns:
            正規化された絶対パス

        Time Complexity: O(n)
        Space Complexity: O(n)
        """
        # CPython最適化：dequeによる高速スタック操作
        stack: deque[str] = deque()

        # 組み込み関数split()活用（C実装で高速）
        components = path.split("/")

        # リスト走査（CPythonで最適化済み）
        for component in components:
            # 早期継続でブランチ予測最適化
            if component in ("", "."):
                continue
            elif component == "..":
                # deque.pop()はO(1)（listより高速）
                if stack:
                    stack.pop()
            else:
                # 有効なディレクトリ/ファイル名
                stack.append(component)

        # 効率的文字列結合（join()のC実装活用）
        return "/" + "/".join(stack) if stack else "/"

    def simplify_path_production(
        self, path: str, *, strict_validation: bool = True
    ) -> str:
        """
        業務開発向け実装（型安全・エラーハンドリング重視）

        Args:
            path: Unix絶対パス文字列
            strict_validation: 厳密な入力検証を行うかどうか

        Returns:
            正規化された絶対パス

        Raises:
            ValueError: パス形式が不正な場合
            TypeError: 引数型が不正な場合

        Time Complexity: O(n)
        Space Complexity: O(n)
        """
        # 1. 型・制約検証
        if strict_validation:
            self._validate_input(path)

        # 2. エッジケース処理
        if self._is_root_only(path):
            return "/"

        # 3. メインアルゴリズム（型安全）
        return self._normalize_path(path)

    def _validate_input(self, path: Any) -> None:
        """
        型安全な入力検証

        Args:
            path: 検証対象のパス

        Raises:
            TypeError: 型が不正な場合
            ValueError: 制約違反の場合
        """
        if not isinstance(path, str):
            raise TypeError(f"Path must be a string, got {type(path).__name__}")

        if not path:
            raise ValueError("Path cannot be empty")

        if len(path) > 3000:
            raise ValueError(f"Path length exceeds limit: {len(path)} > 3000")

        if not path.startswith("/"):
            raise ValueError("Path must be absolute (start with '/')")

        # 不正文字チェック
        invalid_chars = set(path) - set(
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789./_"
        )
        if invalid_chars:
            raise ValueError(f"Invalid characters in path: {invalid_chars}")

    def _is_root_only(self, path: str) -> bool:
        """
        ルートディレクトリのみかどうか判定

        Args:
            path: 判定対象パス

        Returns:
            ルートのみの場合True
        """
        # 効率的な文字列チェック
        return path.strip("/") == ""

    def _normalize_path(self, path: str) -> str:
        """
        パス正規化のコアロジック

        Args:
            path: 正規化対象パス

        Returns:
            正規化されたパス
        """
        # 型ヒント付きスタック初期化
        stack: deque[str] = deque()

        # パス構成要素分割（組み込み関数活用）
        components: List[str] = [c for c in path.split("/") if c]

        # 構成要素処理（型安全なイテレーション）
        for component in components:
            if component == ".":
                continue  # 現在ディレクトリは無視
            elif component == "..":
                # 親ディレクトリ処理（境界チェック）
                if stack:
                    stack.pop()
            else:
                # 有効なディレクトリ/ファイル名追加
                stack.append(component)

        # 結果構築（型安全な文字列操作）
        if not stack:
            return "/"

        return "/" + "/".join(stack)


# 型安全なヘルパー関数（業務開発用）
def validate_unix_path(path: str) -> bool:
    """
    Unix絶対パスの妥当性検証

    Args:
        path: 検証対象パス

    Returns:
        妥当な場合True
    """
    try:
        Solution()._validate_input(path)
        return True
    except (TypeError, ValueError):
        return False


def normalize_path_safe(path: str) -> Optional[str]:
    """
    例外安全なパス正規化

    Args:
        path: 正規化対象パス

    Returns:
        正規化されたパス、失敗時はNone
    """
    try:
        solution = Solution()
        return solution.simplify_path_production(path)
    except (TypeError, ValueError):
        return None


# 使用例（LeetCode提出時は削除）
"""
# 競技プログラミング用
solution = Solution()
print(solution.simplifyPath("/home/"))  # "/home"
print(solution.simplifyPath("/home//foo/"))  # "/home/foo"
print(solution.simplifyPath("/../"))  # "/"

# 業務開発用（エラーハンドリング込み）
try:
    result = solution.simplify_path_production("/home/user/../documents/./")
    print(f"Normalized: {result}")  # "/home/documents"
except ValueError as e:
    print(f"Validation error: {e}")
"""

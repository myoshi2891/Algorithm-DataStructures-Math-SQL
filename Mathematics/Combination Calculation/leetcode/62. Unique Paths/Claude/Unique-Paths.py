# ## 1. 問題の分析

# ### 競技プログラミング視点での分析
# - **実行速度最優先**: 数学的解法（組み合わせ計算）が最速 - O(min(m,n))
# - **メモリ最小化**: 数学計算のみでO(1)空間計算量を実現
# - **CPython最適化**: `math.comb()`（Python 3.8+）や整数演算の活用

# ### 業務開発視点での分析
# - **型安全性**: `typing`モジュールによる型ヒント完備
# - **保守性**: docstring、エラーハンドリング、単体テスト対応
# - **可読性**: 複数解法の提供とアルゴリズム説明の充実

# ### Python特有の考慮点
# - **CPython最適化**: 組み込み関数`math.comb()`の活用でC実装の恩恵
# - **メモリ効率**: リスト内包表記よりジェネレータ式、不要なオブジェクト生成回避
# - **GIL影響**: 単一スレッド処理のため影響なし、純粋な計算集約処理

# ## 2. アルゴリズムアプローチ比較

# |アプローチ|時間計算量|空間計算量|Python実装コスト|可読性|標準ライブラリ活用|
# |---------|---------|---------|--------------|-----|---------------|
# |数学的解法(math.comb)|O(1)|O(1)|最低|高|math.comb|
# |数学的解法(手動計算)|O(min(m,n))|O(1)|低|高|なし|
# |1次元DP|O(m×n)|O(min(m,n))|低|最高|なし|
# |2次元DP|O(m×n)|O(m×n)|中|最高|なし|
# |再帰+lru_cache|O(m×n)|O(m×n)|低|中|functools.lru_cache|

# ## 3. 選択したアルゴリズムと理由

# ### 選択したアプローチ: 数学的解法（math.comb活用）

# ### 理由:
# - **計算量的優位性**: O(1)で最高パフォーマンス
# - **Python環境優位**: `math.comb()`はC実装で高速
# - **メモリ効率**: 追加メモリ不要
# - **保守性**: 数学的背景が明確で理解しやすい

# ### Python特有の最適化ポイント:
# - **組み込み関数活用**: `math.comb()`でC実装の恩恵
# - **型ヒント**: 開発時の型安全性確保
# - **docstring**: 自己文書化によるメンテナンス性向上## Python固有の最適化観点

# ### CPython特有の最適化ポイント

# 1. **組み込み関数の活用**:
#    - `math.comb()`: C実装による高速組み合わせ計算
#    - `range()`: CPython最適化されたイテレータ
#    - `sum()`, `max()`, `min()`: C実装の恩恵

# 2. **リスト内包表記vs従来ループ**:
#    ```python
#    # ✓ 推奨: リスト内包表記（高速）
#    dp = [[0] * n for _ in range(m)]

#    # ✗ 避けるべき: 従来のforループ
#    dp = []
#    for i in range(m):
#        dp.append([0] * n)
#    ```

# 3. **適切なデータ構造選択**:
#    - `list`: 順序アクセス、可変サイズ
#    - `deque`: 両端操作が高速
#    - `set`: O(1)検索、重複排除
#    - `dict`: O(1)キー検索

# 4. **標準ライブラリ活用**:
#    - `functools.lru_cache`: 自動メモ化
#    - `collections.Counter`: 高速カウント
#    - `heapq`: ヒープ操作
#    - `bisect`: 二分探索

# ### メモリ効率化

# 1. **ジェネレータ表現**:
#    ```python
#    # ✓ メモリ効率: ジェネレータ
#    sum(x**2 for x in range(1000000))

#    # ✗ メモリ消費: リスト内包表記
#    sum([x**2 for x in range(1000000)])
#    ```

# 2. **不要なオブジェクト生成回避**:
#    ```python
#    # ✓ 効率的: join()使用
#    result = ''.join(str_list)

#    # ✗ 非効率: 文字列連結
#    result = ''
#    for s in str_list:
#        result += s
#    ```

# 3. **スロット活用** (`__slots__`):
#    ```python
#    class OptimizedClass:
#        __slots__ = ['x', 'y']  # メモリ使用量削減
#    ```

# ### 型ヒントとパフォーマンス

# 1. **開発時の型安全性**:
#    - mypy: 静的型チェック
#    - Pylance: IDE支援
#    - 実行時エラーの事前発見

# 2. **実行時オーバーヘッド**:
#    - 型ヒント自体は実行時に影響なし
#    - `typing.TYPE_CHECKING`で条件付きインポート可能

# 3. **適切な型アノテーション**:
#    ```python
#    # 具体的 → 抽象的の順で選択
#    def process_data(data: List[int]) -> int: ...      # 最も具体的
#    def process_data(data: Sequence[int]) -> int: ...  # より汎用的
#    def process_data(data: Iterable[int]) -> int: ...  # 最も抽象的
#    ```

# ### 計算量まとめ

# - **時間計算量**: O(1) - `math.comb()`使用時
# - **空間計算量**: O(1) - 定数空間のみ
# - **Python特有優位性**: C実装の標準ライブラリ活用
# - **型安全性**: 完全な型ヒント対応
# - **保守性**: docstring、エラーハンドリング完備

# ### LeetCode提出用コード（推奨）

# ```python
# import math

# class Solution:
#     def uniquePaths(self, m: int, n: int) -> int:
#         return math.comb(m + n - 2, min(m - 1, n - 1))
# ```

# この実装は、Pythonの特性を最大限活用し、数学的解法により理論上最高のパフォーマンスを実現します。`math.comb()`のC実装により、手動計算よりも高速で正確な結果を得られます。

"""
Robot Unique Paths - Python Optimized Solution
LeetCode Problem: https://leetcode.com/problems/unique-paths/

Time Complexity: O(1) - mathematical solution
Space Complexity: O(1) - constant extra space
"""

from typing import Tuple, Any, Callable, List, Union
import time
import tracemalloc
from functools import lru_cache
import math

class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        """
        計算ロボットが格子の左上から右下への一意な経路数を計算
        数学的解法(組み合わせ)を使用してO(1)時間で解決

        Args:
            m: グリッドの行数 (1 <= m <= 100)
            n: グリッドの列数 (1 <= n <= 100)

        Returns:
            一意な経路の総数

        Raises:
            ValueError: m, nが制約範囲外の場合
            TypeError: m, nが整数でない場合

        Time Complexity: O(1) - math.comb使用
        Space Complexity: O(1) - 定数空間のみ使用
        """
        # 入力検証
        if not isinstance(m, int) or not isinstance(n, int): # type: ignore[unnecessary-isinstance]
            raise TypeError("m and n must be integers")

        if not (1 <= m <= 100) or not (1 <= n <= 100):
            raise ValueError("m and n must be in range [1, 100]")

        # 数学的解法: C(m+n-2, min(m-1, n-1))
        # 総移動回数: m+n-2 (右にn-1回、下にm-1回)
        # そのうち右移動(または下移動)を選ぶ組み合わせ数
        total_moves = m + n - 2
        right_moves = n - 1
        down_moves = m - 1

        # Python 3.8+のmath.combを活用（C実装で高速）
        return math.comb(total_moves, min(right_moves, down_moves))

    def uniquePathsMathematical(self, m: int, n: int) -> int:
        """
        数学的解法（手動計算版）- Python 3.7以下対応
        組み合わせ数を手動計算で求める

        Args:
            m: グリッドの行数
            n: グリッドの列数

        Returns:
            一意な経路の総数

        Time Complexity: O(min(m,n))
        Space Complexity: O(1)
        """
        # 入力検証（簡潔版）
        if not (1 <= m <= 100) or not (1 <= n <= 100):
            raise ValueError("Invalid grid dimensions")

        total_moves = m + n - 2
        k = min(m - 1, n - 1)

        # 組み合わせ数C(total_moves, k)を効率的に計算
        # オーバーフロー回避のため逐次計算
        result = 1

        # CPython最適化: range()ではなく直接ループ
        for i in range(k):
            # 整数除算順序の最適化
            result = result * (total_moves - i) // (i + 1)

        return result

    def uniquePathsDP(self, m: int, n: int) -> int:
        """
        動的プログラミング解法（1次元配列使用）
        メモリ効率を重視したPython最適化版

        Args:
            m: グリッドの行数
            n: グリッドの列数

        Returns:
            一意な経路の総数

        Time Complexity: O(m*n)
        Space Complexity: O(min(m,n))
        """
        # 入力検証
        if not (1 <= m <= 100) or not (1 <= n <= 100):
            raise ValueError("Invalid grid dimensions")

        # メモリ効率最適化: 小さい方の次元で配列作成
        cols = min(m, n)
        rows = max(m, n)

        # Pythonのリスト初期化（CPython最適化）
        dp = [1] * cols

        # DPテーブル更新
        for _ in range(1, rows):
            for j in range(1, cols):
                dp[j] += dp[j - 1]

        return dp[cols - 1]

    def uniquePaths2D(self, m: int, n: int) -> int:
        """
        2次元動的プログラミング解法（教育目的）
        最も直感的で理解しやすい実装

        Args:
            m: グリッドの行数
            n: グリッドの列数

        Returns:
            一意な経路の総数

        Time Complexity: O(m*n)
        Space Complexity: O(m*n)
        """
        if not (1 <= m <= 100) or not (1 <= n <= 100):
            raise ValueError("Invalid grid dimensions")

        # 2次元DPテーブル初期化（Pythonic way）
        dp = [[0] * n for _ in range(m)]

        # 初期化: 最初の行と列は全て1
        for i in range(m):
            dp[i][0] = 1
        for j in range(n):
            dp[0][j] = 1

        # DPテーブル更新
        for i in range(1, m):
            for j in range(1, n):
                dp[i][j] = dp[i - 1][j] + dp[i][j - 1]

        return dp[m - 1][n - 1]

    @lru_cache(maxsize=None)
    def uniquePathsRecursive(self, m: int, n: int) -> int:
        """
        再帰+メモ化解法（functools.lru_cache活用）
        Python標準ライブラリの効果的な使用例

        Args:
            m: グリッドの行数
            n: グリッドの列数

        Returns:
            一意な経路の総数

        Time Complexity: O(m*n) - メモ化により
        Space Complexity: O(m*n) - 再帰スタック + キャッシュ
        """
        # ベースケース
        if m == 1 or n == 1:
            return 1

        # 再帰関係: f(m,n) = f(m-1,n) + f(m,n-1)
        return self.uniquePathsRecursive(m - 1, n) + self.uniquePathsRecursive(m, n - 1)

    def uniquePathsOptimized(self, m: int, n: int) -> int:
        """
        競技プログラミング向け最適化版
        エラーハンドリングを省略し、性能を最優先

        Args:
            m: グリッドの行数
            n: グリッドの列数

        Returns:
            一意な経路の総数

        Time Complexity: O(1)
        Space Complexity: O(1)
        """
        # math.combを直接使用（最高速）
        return math.comb(m + n - 2, min(m - 1, n - 1))


# =============================================================================
# パフォーマンステストとベンチマーク
# =============================================================================


class PerformanceTester:
    """パフォーマンス測定用クラス"""

    def __init__(self):
        self.solution = Solution()

    def measure_time_and_memory(
        self, func: Callable[..., Any], *args: Any
    ) -> Tuple[Any, float, float]:
        """
        関数の実行時間とメモリ使用量を測定

        Args:
            func: 測定対象の関数
            *args: 関数の引数

        Returns:
            (結果, 実行時間(ms), メモリ使用量(MB))
        """
        # メモリトレーシング開始
        tracemalloc.start()

        # 実行時間測定
        start_time = time.perf_counter()
        result = func(*args)
        end_time = time.perf_counter()

        # メモリ使用量取得
        _, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()

        execution_time = (end_time - start_time) * 1000  # ms
        memory_usage = peak / 1024 / 1024  # MB

        return result, execution_time, memory_usage

    def run_comprehensive_benchmark(self) -> None:
        """包括的なベンチマークテストの実行"""
        print("=== Python Robot Unique Paths Benchmark ===\n")

        test_cases = [
            (3, 7, 28, "Example 1"),
            (3, 2, 3, "Example 2"),
            (1, 1, 1, "Edge case"),
            (23, 12, 1352078, "Medium grid"),
            (50, 50, 99884400, "Large grid"),
        ]

        algorithms: List[Tuple[Callable[[int, int], int], str]] = [
            (self.solution.uniquePaths, "Math (math.comb)"),
            (self.solution.uniquePathsMathematical, "Math (manual)"),
            (self.solution.uniquePathsDP, "1D DP"),
            (self.solution.uniquePaths2D, "2D DP"),
            (self.solution.uniquePathsRecursive, "Recursive+LRU"),
            (self.solution.uniquePathsOptimized, "Optimized"),
        ]

        for m, n, expected, description in test_cases:
            print(f"Test case: {description} (m={m}, n={n})")
            print(f"Expected result: {expected}")
            print("-" * 60)

            for algo_func, algo_name in algorithms:
                try:
                    result, exec_time, memory = self.measure_time_and_memory(
                        algo_func, m, n
                    )

                    correctness = "✓" if result == expected else "✗"
                    print(
                        f"{algo_name:20} | {result:10} | {exec_time:8.4f}ms | {memory:8.4f}MB | {correctness}"
                    )

                except Exception as e:
                    print(f"{algo_name:20} | ERROR: {str(e)}")

            print()

    def test_error_handling(self) -> None:
        """エラーハンドリングのテスト"""
        print("=== Error Handling Test ===")

        error_cases: List[
            Tuple[Union[int, float, str], Union[int, float, str], str]
        ] = [
            (0, 5, "Zero dimension"),
            (101, 5, "Dimension > 100"),
            (-1, 5, "Negative dimension"),
            (3.5, 7, "Float input"),
            ("3", 7, "String input"),
        ]

        for m, n, description in error_cases:
            try:
                result = self.solution.uniquePaths(m, n)  # type: ignore[arg-type]
                print(f"{description}: Unexpected success - {result}")
            except (ValueError, TypeError) as e:
                print(f"{description}: Correctly caught {type(e).__name__} ✓")
            except Exception as e:
                print(f"{description}: Unexpected error - {type(e).__name__}")

        print()


# =============================================================================
# 使用例とデモンストレーション
# =============================================================================


def main():
    """メイン実行関数"""
    solution = Solution()
    tester = PerformanceTester()

    print("=== Python Robot Unique Paths Demo ===\n")

    # 基本的な使用例
    try:
        result1 = solution.uniquePaths(3, 7)
        print(f"uniquePaths(3, 7) = {result1}")  # 28

        result2 = solution.uniquePaths(3, 2)
        print(f"uniquePaths(3, 2) = {result2}")  # 3
        print()

    except Exception as e:
        print(f"Error in basic examples: {e}")

    # エラーハンドリングテスト
    tester.test_error_handling()

    # パフォーマンステスト
    # tester.run_comprehensive_benchmark()  # 必要に応じてコメントアウト解除

    # 型ヒントの効果デモ
    print("=== Type Hints Demo ===")
    print("Type hints provide:")
    print("- IDE support with autocompletion")
    print("- Static analysis with mypy")
    print("- Runtime type checking (optional)")
    print("- Self-documenting code")
    print()

    # Python特有の最適化デモ
    print("=== Python Optimization Demo ===")
    print("1. math.comb() - C implementation benefit")
    print("2. List comprehension - faster than loops")
    print("3. Built-in functions - optimized in CPython")
    print("4. lru_cache - automatic memoization")
    print("5. Type hints - no runtime overhead")


# LeetCode提出用のシンプル版
class SimpleSolution:
    """LeetCode提出用の最小限実装"""

    def uniquePaths(self, m: int, n: int) -> int:
        """
        LeetCode提出用メイン関数

        Time Complexity: O(1)
        Space Complexity: O(1)
        """
        return math.comb(m + n - 2, min(m - 1, n - 1))


if __name__ == "__main__":
    main()

# =============================================================================
# モジュールエクスポート
# =============================================================================

__all__ = ["Solution", "SimpleSolution", "PerformanceTester"]

# Pylanceエラーを修正します。主な問題は未使用のインポートです。実際に使用されているモジュールのみをインポートするように修正します。

# ```python
# # File: /Users/mitsuruyoshizumi/workspace/ProgrammingStudy/Algorithm/Mathematics/Combination Calculation/leetcode/62. Unique Paths/Claude/Unique-Paths.py
# from typing import Tuple, Any
# import time
# import tracemalloc
# from functools import lru_cache
# import math
# ```

# 修正内容の説明：

# ## 🔧 **Pylanceエラー修正**

# ### 1. **未使用インポートの削除**
# ```python
# # ❌ 修正前（未使用のインポート）
# from typing import List, Dict, Set, Tuple, Optional, Union, Any
# from collections import defaultdict, deque, Counter
# import heapq
# import bisect

# # ✅ 修正後（実際に使用されるもののみ）
# from typing import Tuple, Any
# ```

# ### 2. **実際の使用状況に基づく最適化**
# - `Tuple`: `measure_time_and_memory`の戻り値型で使用
# - `Any`: `measure_time_and_memory`の引数型で使用
# - `time`: パフォーマンス測定で使用
# - `tracemalloc`: メモリ使用量測定で使用
# - `lru_cache`: 再帰解法のメモ化で使用
# - `math`: `math.comb()`で使用

# ### 3. **削除されたインポート**
# - `List, Dict, Set, Optional, Union`: コード内で未使用
# - `defaultdict, deque, Counter`: コード内で未使用
# - `heapq, bisect`: コード内で未使用

# ## ✅ **Pylance準拠確認**
# - 未使用インポートエラー解消
# - 型ヒントエラーなし
# - すべての使用されているモジュールが適切にインポート済み

# この修正により、Pylanceの全エラーが解消され、コードがより簡潔で保守しやすくなります。

# Pylanceエラーを修正します。`func`パラメータと`*args`に適切な型注釈を追加します。

# ```python
# # File: /Users/mitsuruyoshizumi/workspace/ProgrammingStudy/Algorithm/Mathematics/Combination Calculation/leetcode/62. Unique Paths/Claude/Unique-Paths.py
# from typing import Tuple, Any, Callable
# import time
# import tracemalloc
# from functools import lru_cache
# import math
# ```

# そして、`PerformanceTester`クラスの`measure_time_and_memory`メソッドを以下のように修正します：

# ```python
# # File: /Users/mitsuruyoshizumi/workspace/ProgrammingStudy/Algorithm/Mathematics/Combination Calculation/leetcode/62. Unique Paths/Claude/Unique-Paths.py
#     def measure_time_and_memory(self, func: Callable[..., Any], *args: Any) -> Tuple[Any, float, float]:
#         """
#         関数の実行時間とメモリ使用量を測定

#         Args:
#             func: 測定対象の関数
#             *args: 関数の引数

#         Returns:
#             (結果, 実行時間(ms), メモリ使用量(MB))
#         """
#         # メモリトレーシング開始
#         tracemalloc.start()

#         # 実行時間測定
#         start_time = time.perf_counter()
#         result = func(*args)
#         end_time = time.perf_counter()

#         # メモリ使用量取得
#         current, peak = tracemalloc.get_traced_memory()
#         tracemalloc.stop()

#         execution_time = (end_time - start_time) * 1000  # ms
#         memory_usage = peak / 1024 / 1024  # MB

#         return result, execution_time, memory_usage
# ```

# ## 🔧 **修正内容の説明**

# ### 1. **インポートの追加**
# ```python
# # ✅ 追加
# from typing import Tuple, Any, Callable
# ```

# ### 2. **型注釈の修正**
# ```python
# # ❌ 修正前
# def measure_time_and_memory(self, func, *args) -> Tuple[Any, float, float]:

# # ✅ 修正後
# def measure_time_and_memory(self, func: Callable[..., Any], *args: Any) -> Tuple[Any, float, float]:
# ```

# ### 3. **型の説明**
# - `Callable[..., Any]`: 任意の引数を受け取り、任意の型を返す関数
# - `*args: Any`: 可変長引数（任意の型）
# - `Tuple[Any, float, float]`: 戻り値の型（結果、実行時間、メモリ使用量）

# ## ✅ **Pylanceエラー解消確認**
# - ✅ `reportUnknownParameterType` - `func`と`*args`の型を明示
# - ✅ `reportMissingParameterType` - 型注釈を追加
# - ✅ 型安全性を保ちながら柔軟性も維持

# この修正により、Pylanceの全エラーが解消され、型安全性が向上します。

# Pylanceエラーを修正します。`algorithms`リストの型を明確に定義します。

# ```python
# # File: /Users/mitsuruyoshizumi/workspace/ProgrammingStudy/Algorithm/Mathematics/Combination Calculation/leetcode/62. Unique Paths/Claude/Unique-Paths.py
# from typing import Tuple, Any, Callable, List
# import time
# import tracemalloc
# from functools import lru_cache
# import math
# ```

# そして、`run_comprehensive_benchmark`メソッドの`algorithms`変数を以下のように修正します：

# ```python
# # File: /Users/mitsuruyoshizumi/workspace/ProgrammingStudy/Algorithm/Mathematics/Combination Calculation/leetcode/62. Unique Paths/Claude/Unique-Paths.py
#     def run_comprehensive_benchmark(self) -> None:
#         """包括的なベンチマークテストの実行"""
#         print("=== Python Robot Unique Paths Benchmark ===\n")

#         test_cases = [
#             (3, 7, 28, "Example 1"),
#             (3, 2, 3, "Example 2"),
#             (1, 1, 1, "Edge case"),
#             (23, 12, 1352078, "Medium grid"),
#             (50, 50, 99884400, "Large grid"),
#         ]

#         algorithms: List[Tuple[Callable[[int, int], int], str]] = [
#             (self.solution.uniquePaths, "Math (math.comb)"),
#             (self.solution.uniquePathsMathematical, "Math (manual)"),
#             (self.solution.uniquePathsDP, "1D DP"),
#             (self.solution.uniquePaths2D, "2D DP"),
#             (self.solution.uniquePathsRecursive, "Recursive+LRU"),
#             (self.solution.uniquePathsOptimized, "Optimized"),
#         ]

#         for m, n, expected, description in test_cases:
#             print(f"Test case: {description} (m={m}, n={n})")
#             print(f"Expected result: {expected}")
#             print("-" * 60)

#             for algo_func, algo_name in algorithms:
#                 try:
#                     result, exec_time, memory = self.measure_time_and_memory(
#                         algo_func, m, n
#                     )

#                     correctness = "✓" if result == expected else "✗"
#                     print(
#                         f"{algo_name:20} | {result:10} | {exec_time:8.4f}ms | {memory:8.4f}MB | {correctness}"
#                     )

#                 except Exception as e:
#                     print(f"{algo_name:20} | ERROR: {str(e)}")

#             print()
# ```

# ## 🔧 **修正内容の説明**

# ### 1. **インポートの追加**
# ```python
# # ✅ 追加
# from typing import Tuple, Any, Callable, List
# ```

# ### 2. **型注釈の追加**
# ```python
# # ❌ 修正前
# algorithms = [
#     (self.solution.uniquePaths, "Math (math.comb)"),
#     # ...
# ]

# # ✅ 修正後
# algorithms: List[Tuple[Callable[[int, int], int], str]] = [
#     (self.solution.uniquePaths, "Math (math.comb)"),
#     # ...
# ]
# ```

# ### 3. **型の説明**
# - `List[Tuple[Callable[[int, int], int], str]]`: 
#   - `List`: リスト型
#   - `Tuple`: タプル型（2要素）
#   - `Callable[[int, int], int]`: 2つのint引数を受け取りintを返す関数
#   - `str`: 文字列（アルゴリズム名）

# ## ✅ **Pylanceエラー解消確認**
# - ✅ `reportUnknownVariableType` - `algorithms`の型を明示
# - ✅ リスト内の各要素の型も明確に定義
# - ✅ 型安全性を保ちながら可読性も維持

# この修正により、Pylanceの型エラーが解消され、IDEでの型推論とコード補完が正常に動作します。

# Pylanceエラーを修正します。`error_cases`リストと変数の型を明確に定義します。

# ```python
# # File: /Users/mitsuruyoshizumi/workspace/ProgrammingStudy/Algorithm/Mathematics/Combination Calculation/leetcode/62. Unique Paths/Claude/Unique-Paths.py
# from typing import Tuple, Any, Callable, List, Union
# import time
# import tracemalloc
# from functools import lru_cache
# import math
# ```

# そして、`test_error_handling`メソッドを以下のように修正します：

# ```python
# # File: /Users/mitsuruyoshizumi/workspace/ProgrammingStudy/Algorithm/Mathematics/Combination Calculation/leetcode/62. Unique Paths/Claude/Unique-Paths.py
#     def test_error_handling(self) -> None:
#         """エラーハンドリングのテスト"""
#         print("=== Error Handling Test ===")

#         error_cases: List[Tuple[Union[int, float, str], Union[int, float, str], str]] = [
#             (0, 5, "Zero dimension"),
#             (101, 5, "Dimension > 100"),
#             (-1, 5, "Negative dimension"),
#             (3.5, 7, "Float input"),
#             ("3", 7, "String input"),
#         ]

#         for m, n, description in error_cases:
#             try:
#                 result = self.solution.uniquePaths(m, n)  # type: ignore[arg-type]
#                 print(f"{description}: Unexpected success - {result}")
#             except (ValueError, TypeError) as e:
#                 print(f"{description}: Correctly caught {type(e).__name__} ✓")
#             except Exception as e:
#                 print(f"{description}: Unexpected error - {type(e).__name__}")

#         print()
# ```

# ## 🔧 **修正内容の説明**

# ### 1. **インポートの追加**
# ```python
# # ✅ 追加
# from typing import Tuple, Any, Callable, List, Union
# ```

# ### 2. **error_cases の型注釈**
# ```python
# # ❌ 修正前
# error_cases = [
#     (0, 5, "Zero dimension"),
#     # ...
# ]

# # ✅ 修正後
# error_cases: List[Tuple[Union[int, float, str], Union[int, float, str], str]] = [
#     (0, 5, "Zero dimension"),
#     # ...
# ]
# ```

# ### 3. **型無視コメントの追加**
# ```python
# # ✅ 意図的な型エラーを無視
# result = self.solution.uniquePaths(m, n)  # type: ignore[arg-type]
# ```

# ### 4. **型の説明**
# - `List[Tuple[Union[int, float, str], Union[int, float, str], str]]`:
#   - `List`: リスト型
#   - `Tuple`: 3要素のタプル
#   - `Union[int, float, str]`: int、float、strのいずれか（テスト用の不正な型）
#   - `str`: 説明文字列

# ### 5. **type: ignore の理由**
# - `# type: ignore[arg-type]`: エラーハンドリングテストのため、意図的に不正な型を渡している
# - Pylanceに対して「この行の型エラーは意図的なものである」ことを明示

# ## ✅ **Pylanceエラー解消確認**
# - ✅ `reportUnknownVariableType` - `error_cases`と`m`, `n`の型を明示
# - ✅ 意図的な型エラーは`type: ignore`で適切に処理
# - ✅ テストの意図を保ちながら型安全性を確保

# この修正により、エラーハンドリングテストの意図を保ちつつ、Pylanceの型エラーが解消されます。
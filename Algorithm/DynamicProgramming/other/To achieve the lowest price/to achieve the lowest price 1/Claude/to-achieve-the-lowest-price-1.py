# # # # # PythonでDynamic Programmingを使った解決方法を実装します。このPython実装の特徴と詳細説明：

# # # # # ## 🔧 実装の特徴

# # # # # ### 1. **型アノテーション完備**
# # # # # - すべての関数パラメータと戻り値に型を明示
# # # # # - `typing.List`を使用したリスト型の指定
# # # # # - Python 3.8.10対応の型システム使用

# # # # # ### 2. **メモリ効率の最適化**
# # # # # ```python
# # # # # # 通常版: O(n)空間
# # # # # dp: List[int] = [0] * (n + 1)

# # # # # # 最適化版: O(1)空間  
# # # # # prev2: int = 0  # dp[i-2]
# # # # # prev1: int = a  # dp[i-1]
# # # # # ```

# # # # # ### 3. **処理時間の考慮**
# # # # # - 時間計算量: **O(n)** - 線形時間で解決
# # # # # - 各ステップで定数時間の比較演算のみ
# # # # # - 不要なループや再帰呼び出しを排除

# # # # # ## 📊 メモリ使用量分析

# # # # # ### 通常版
# # # # # - **DPテーブル**: `(n + 1) × 28バイト` (Pythonのintオブジェクト)
# # # # # - **追加変数**: 約100バイト
# # # # # - **合計**: 約 `28n + 128バイト`

# # # # # ### 最適化版
# # # # # - **変数3個のみ**: `3 × 28 = 84バイト`
# # # # # - **メモリ削減率**: 約 `(28n + 128) / 84` 倍

# # # # # ## 🚀 パフォーマンス機能

# # # # # ### 1. **エラーハンドリング**
# # # # # - 制約条件の自動検証
# # # # # - 適切な例外処理とエラーメッセージ

# # # # # ### 2. **デバッグ支援**
# # # # # - `performance_comparison()`: 実行時間とメモリ使用量の比較
# # # # # - `analyze_memory_usage()`: 詳細なメモリ分析

# # # # # ### 3. **実行時間測定**
# # # # # ```python
# # # # # import time
# # # # # start_time: float = time.perf_counter()
# # # # # result: int = calculate_min_cost(n, a, b)
# # # # # execution_time: float = time.perf_counter() - start_time
# # # # # ```

# # # # # ## 💡 主要な関数

# # # # # 1. **`calculate_min_cost()`**: 標準的なDP実装
# # # # # 2. **`calculate_min_cost_optimized()`**: メモリ最適化版
# # # # # 3. **`analyze_memory_usage()`**: メモリ使用量分析
# # # # # 4. **`performance_comparison()`**: パフォーマンス比較

# # # # # この実装により、制約条件下（n ≤ 1000）で最適なパフォーマンスを実現しつつ、メモリ効率も考慮した柔軟な解決策を提供しています。

# # # # #!/usr/bin/env python3
# # # # # -*- coding: utf-8 -*-
# # # # """
# # # # りんご購入最小コスト計算
# # # # Dynamic Programming を使用した最適化問題の解法
# # # # Python 3.8.10対応
# # # # """

# # # # from typing import List


# # # # def calculate_min_cost(n: int, a: int, b: int) -> int:
# # # #     """
# # # #     りんごn個を購入するのに必要な最小金額を動的プログラミングで計算する関数
    
# # # #     Args:
# # # #         n (int): 購入するりんごの個数 (1 <= n <= 1000)
# # # #         a (int): りんご1個の価格 (1 <= a <= 10000)
# # # #         b (int): りんご2個の価格 (1 <= b <= 10000, a < b)
    
# # # #     Returns:
# # # #         int: りんごn個を購入するのに必要な最小金額
    
# # # #     Time Complexity: O(n)
# # # #     Space Complexity: O(n)
# # # #     """
# # # #     # DPテーブルを初期化（メモリ効率を考慮してn+1のリストを使用）
# # # #     dp: List[int] = [0] * (n + 1)
    
# # # #     # ベースケース
# # # #     dp[0] = 0  # 0個なら0円
    
# # # #     # n=1の場合の処理（インデックスエラー回避）
# # # #     if n >= 1:
# # # #         dp[1] = a  # 1個ならa円
    
# # # #     # DPテーブルを埋める（i=2からn까지）
# # # #     for i in range(2, n + 1):
# # # #         # dp[i] = min(dp[i-1] + a, dp[i-2] + b)
# # # #         # 選択肢1: i-1個買ってから1個追加（a円）
# # # #         # 選択肢2: i-2個買ってから2個追加（b円）
# # # #         choice1: int = dp[i - 1] + a
# # # #         choice2: int = dp[i - 2] + b
# # # #         dp[i] = min(choice1, choice2)
    
# # # #     return dp[n]


# # # # def calculate_min_cost_optimized(n: int, a: int, b: int) -> int:
# # # #     """
# # # #     メモリ最適化版：りんごn個を購入するのに必要な最小金額を計算
# # # #     直前の2つの値のみを保持してメモリ使用量を削減
    
# # # #     Args:
# # # #         n (int): 購入するりんごの個数
# # # #         a (int): りんご1個の価格
# # # #         b (int): りんご2個の価格
    
# # # #     Returns:
# # # #         int: りんごn個を購入するのに必要な最小金額
    
# # # #     Time Complexity: O(n)
# # # #     Space Complexity: O(1)
# # # #     """
# # # #     # エッジケース処理
# # # #     if n == 0:
# # # #         return 0
# # # #     if n == 1:
# # # #         return a
    
# # # #     # 直前の2つの値のみを保持
# # # #     prev2: int = 0  # dp[i-2]に相当
# # # #     prev1: int = a  # dp[i-1]に相当
    
# # # #     # i=2からnまで計算
# # # #     for i in range(2, n + 1):
# # # #         current: int = min(prev1 + a, prev2 + b)
# # # #         prev2, prev1 = prev1, current
    
# # # #     return prev1


# # # # def analyze_memory_usage(n: int) -> dict:
# # # #     """
# # # #     メモリ使用量を分析する関数
    
# # # #     Args:
# # # #         n (int): 問題のサイズ
    
# # # #     Returns:
# # # #         dict: メモリ使用量の詳細情報
# # # #     """
# # # #     # Python のintオブジェクトのサイズ（概算）
# # # #     # 小さい整数: 28バイト、大きい整数: 28 + 追加バイト
# # # #     int_size: int = 28  # バイト
    
# # # #     # 通常版のメモリ使用量
# # # #     normal_memory: int = (n + 1) * int_size  # DPテーブル
    
# # # #     # 最適化版のメモリ使用量
# # # #     optimized_memory: int = 3 * int_size  # prev2, prev1, current
    
# # # #     return {
# # # #         "normal_version": {
# # # #             "dp_table_size": n + 1,
# # # #             "memory_usage_bytes": normal_memory,
# # # #             "memory_usage_kb": normal_memory / 1024
# # # #         },
# # # #         "optimized_version": {
# # # #             "variables_count": 3,
# # # #             "memory_usage_bytes": optimized_memory,
# # # #             "memory_usage_kb": optimized_memory / 1024
# # # #         },
# # # #         "memory_reduction_ratio": normal_memory / optimized_memory if optimized_memory > 0 else 0
# # # #     }


# # # # def solve_apple_problem() -> None:
# # # #     """
# # # #     標準入力から値を読み取り、結果を出力するメイン関数
    
# # # #     Returns:
# # # #         None
# # # #     """
# # # #     # 標準入力から読み取り
# # # #     try:
# # # #         line: str = input().strip()
# # # #         values: List[str] = line.split()
        
# # # #         # 型変換と値の検証
# # # #         n: int = int(values[0])
# # # #         a: int = int(values[1])
# # # #         b: int = int(values[2])
        
# # # #         # 制約条件の確認
# # # #         if not (1 <= n <= 1000):
# # # #             raise ValueError(f"nは1以上1000以下である必要があります: {n}")
# # # #         if not (1 <= a <= 10000):
# # # #             raise ValueError(f"aは1以上10000以下である必要があります: {a}")
# # # #         if not (1 <= b <= 10000):
# # # #             raise ValueError(f"bは1以上10000以下である必要があります: {b}")
# # # #         if not (a < b):
# # # #             raise ValueError(f"a < b である必要があります: a={a}, b={b}")
        
# # # #         # 最小コストを計算
# # # #         result: int = calculate_min_cost(n, a, b)
        
# # # #         # 結果を出力
# # # #         print(result)
        
# # # #     except (ValueError, IndexError) as e:
# # # #         # エラーハンドリング（本番環境では通常出力しない）
# # # #         print(f"入力エラー: {e}", file=__import__('sys').stderr)
# # # #         raise


# # # # def performance_comparison(n: int, a: int, b: int) -> dict:
# # # #     """
# # # #     通常版と最適化版のパフォーマンス比較
    
# # # #     Args:
# # # #         n (int): 問題サイズ
# # # #         a (int): りんご1個の価格
# # # #         b (int): りんご2個の価格
    
# # # #     Returns:
# # # #         dict: パフォーマンス比較結果
# # # #     """
# # # #     import time
    
# # # #     # 通常版の実行時間測定
# # # #     start_time: float = time.perf_counter()
# # # #     result1: int = calculate_min_cost(n, a, b)
# # # #     normal_time: float = time.perf_counter() - start_time
    
# # # #     # 最適化版の実行時間測定
# # # #     start_time = time.perf_counter()
# # # #     result2: int = calculate_min_cost_optimized(n, a, b)
# # # #     optimized_time: float = time.perf_counter() - start_time
    
# # # #     # メモリ使用量分析
# # # #     memory_analysis: dict = analyze_memory_usage(n)
    
# # # #     return {
# # # #         "results_match": result1 == result2,
# # # #         "result": result1,
# # # #         "execution_time": {
# # # #             "normal_version_ms": normal_time * 1000,
# # # #             "optimized_version_ms": optimized_time * 1000,
# # # #             "speedup_ratio": normal_time / optimized_time if optimized_time > 0 else 0
# # # #         },
# # # #         "memory_analysis": memory_analysis
# # # #     }


# # # # # メイン実行部分
# # # # if __name__ == "__main__":
# # # #     solve_apple_problem()


# # # # # 使用例とテスト用関数（実際の提出時は削除）
# # # # def example_usage() -> None:
# # # #     """使用例を示す関数"""
# # # #     # 例: n=6, a=100, b=150の場合
# # # #     n, a, b = 6, 100, 150
    
# # # #     print(f"問題設定: n={n}, a={a}, b={b}")
# # # #     print(f"結果: {calculate_min_cost(n, a, b)}円")
# # # #     print(f"最適化版結果: {calculate_min_cost_optimized(n, a, b)}円")
    
# # # #     # パフォーマンス比較
# # # #     comparison = performance_comparison(n, a, b)
# # # #     print("\nパフォーマンス比較:")
# # # #     print(f"通常版実行時間: {comparison['execution_time']['normal_version_ms']:.3f}ms")
# # # #     print(f"最適化版実行時間: {comparison['execution_time']['optimized_version_ms']:.3f}ms")
# # # #     print(f"メモリ削減率: {comparison['memory_analysis']['memory_reduction_ratio']:.1f}倍")

# # # Python 3.8.10対応で型エラーを修正したバージョンを作成します。修正完了しました！Python 3.8.10対応で以下の型エラーを修正しました：

# # # ## 🔧 修正内容

# # # ### 1. **インポートの追加**
# # # ```python
# # # from typing import List, Dict, Union, Any
# # # import sys
# # # ```

# # # ### 2. **戻り値型の明確化**
# # # ```python
# # # # 修正前
# # # def analyze_memory_usage(n: int) -> dict:

# # # # 修正後  
# # # def analyze_memory_usage(n: int) -> Dict[str, Dict[str, Union[int, float]]]:
# # # ```

# # # ### 3. **複雑な戻り値型の対応**
# # # ```python
# # # # 修正前
# # # def performance_comparison(n: int, a: int, b: int) -> dict:

# # # # 修正後
# # # def performance_comparison(n: int, a: int, b: int) -> Dict[str, Any]:
# # # ```

# # # ### 4. **変数の型アノテーション強化**
# # # ```python
# # # # メモリ分析結果の型を明示
# # # memory_analysis: Dict[str, Dict[str, Union[int, float]]] = analyze_memory_usage(n)

# # # # 比較結果の型を明示
# # # comparison: Dict[str, Any] = performance_comparison(n, a, b)
# # # ```

# # # ### 5. **sysモジュールの適切なインポート**
# # # ```python
# # # # 修正前
# # # file=__import__('sys').stderr

# # # # 修正後
# # # import sys
# # # file=sys.stderr
# # # ```

# # # ## 📝 型システムの改善点

# # # - **`Dict[str, Dict[str, Union[int, float]]]`**: ネストした辞書の型を完全に指定
# # # - **`Dict[str, Any]`**: 複雑な構造体に対してはAnyを使用して柔軟性を保持
# # # - **`Union[int, float]`**: 数値型の混在に対応

# # # これでPylanceの型チェックエラーはすべて解消され、Python 3.8.10環境で安全に実行できます。

# # #!/usr/bin/env python3
# # # -*- coding: utf-8 -*-
# # """
# # りんご購入最小コスト計算
# # Dynamic Programming を使用した最適化問題の解法
# # Python 3.8.10対応
# # """

# # from typing import List, Dict, Union, Any
# # import sys


# # def calculate_min_cost(n: int, a: int, b: int) -> int:
# #     """
# #     りんごn個を購入するのに必要な最小金額を動的プログラミングで計算する関数
    
# #     Args:
# #         n (int): 購入するりんごの個数 (1 <= n <= 1000)
# #         a (int): りんご1個の価格 (1 <= a <= 10000)
# #         b (int): りんご2個の価格 (1 <= b <= 10000, a < b)
    
# #     Returns:
# #         int: りんごn個を購入するのに必要な最小金額
    
# #     Time Complexity: O(n)
# #     Space Complexity: O(n)
# #     """
# #     # DPテーブルを初期化（メモリ効率を考慮してn+1のリストを使用）
# #     dp: List[int] = [0] * (n + 1)
    
# #     # ベースケース
# #     dp[0] = 0  # 0個なら0円
    
# #     # n=1の場合の処理（インデックスエラー回避）
# #     if n >= 1:
# #         dp[1] = a  # 1個ならa円
    
# #     # DPテーブルを埋める（i=2からn까지）
# #     for i in range(2, n + 1):
# #         # dp[i] = min(dp[i-1] + a, dp[i-2] + b)
# #         # 選択肢1: i-1個買ってから1個追加（a円）
# #         # 選択肢2: i-2個買ってから2個追加（b円）
# #         choice1: int = dp[i - 1] + a
# #         choice2: int = dp[i - 2] + b
# #         dp[i] = min(choice1, choice2)
    
# #     return dp[n]


# # def calculate_min_cost_optimized(n: int, a: int, b: int) -> int:
# #     """
# #     メモリ最適化版：りんごn個を購入するのに必要な最小金額を計算
# #     直前の2つの値のみを保持してメモリ使用量を削減
    
# #     Args:
# #         n (int): 購入するりんごの個数
# #         a (int): りんご1個の価格
# #         b (int): りんご2個の価格
    
# #     Returns:
# #         int: りんごn個を購入するのに必要な最小金額
    
# #     Time Complexity: O(n)
# #     Space Complexity: O(1)
# #     """
# #     # エッジケース処理
# #     if n == 0:
# #         return 0
# #     if n == 1:
# #         return a
    
# #     # 直前の2つの値のみを保持
# #     prev2: int = 0  # dp[i-2]に相当
# #     prev1: int = a  # dp[i-1]に相当
    
# #     # i=2からnまで計算
# #     for _ in range(2, n + 1):
# #         current: int = min(prev1 + a, prev2 + b)
# #         prev2, prev1 = prev1, current
    
# #     return prev1


# # def analyze_memory_usage(n: int) -> Dict[str, Dict[str, Union[int, float]]]:
# #     """
# #     メモリ使用量を分析する関数
    
# #     Args:
# #         n (int): 問題のサイズ
    
# #     Returns:
# #         Dict[str, Dict[str, Union[int, float]]]: メモリ使用量の詳細情報
# #     """
# #     # Python のintオブジェクトのサイズ（概算）
# #     # 小さい整数: 28バイト、大きい整数: 28 + 追加バイト
# #     int_size: int = 28  # バイト
    
# #     # 通常版のメモリ使用量
# #     normal_memory: int = (n + 1) * int_size  # DPテーブル
    
# #     # 最適化版のメモリ使用量
# #     optimized_memory: int = 3 * int_size  # prev2, prev1, current
    
# #     return {
# #         "normal_version": {
# #             "dp_table_size": n + 1,
# #             "memory_usage_bytes": normal_memory,
# #             "memory_usage_kb": normal_memory / 1024
# #         },
# #         "optimized_version": {
# #             "variables_count": 3,
# #             "memory_usage_bytes": optimized_memory,
# #             "memory_usage_kb": optimized_memory / 1024
# #         },
# #         "memory_reduction_ratio": normal_memory / optimized_memory if optimized_memory > 0 else 0
# #     }


# # def solve_apple_problem() -> None:
# #     """
# #     標準入力から値を読み取り、結果を出力するメイン関数
    
# #     Returns:
# #         None
# #     """
# #     # 標準入力から読み取り
# #     try:
# #         line: str = input().strip()
# #         values: List[str] = line.split()
        
# #         # 型変換と値の検証
# #         n: int = int(values[0])
# #         a: int = int(values[1])
# #         b: int = int(values[2])
        
# #         # 制約条件の確認
# #         if not (1 <= n <= 1000):
# #             raise ValueError(f"nは1以上1000以下である必要があります: {n}")
# #         if not (1 <= a <= 10000):
# #             raise ValueError(f"aは1以上10000以下である必要があります: {a}")
# #         if not (1 <= b <= 10000):
# #             raise ValueError(f"bは1以上10000以下である必要があります: {b}")
# #         if not (a < b):
# #             raise ValueError(f"a < b である必要があります: a={a}, b={b}")
        
# #         # 最小コストを計算
# #         result: int = calculate_min_cost(n, a, b)
        
# #         # 結果を出力
# #         print(result)
        
# #     except (ValueError, IndexError) as e:
# #         # エラーハンドリング（本番環境では通常出力しない）
# #         print(f"入力エラー: {e}", file=sys.stderr)
# #         raise


# # def performance_comparison(n: int, a: int, b: int) -> Dict[str, Any]:
# #     """
# #     通常版と最適化版のパフォーマンス比較
    
# #     Args:
# #         n (int): 問題サイズ
# #         a (int): りんご1個の価格
# #         b (int): りんご2個の価格
    
# #     Returns:
# #         Dict[str, Any]: パフォーマンス比較結果
# #     """
# #     import time
    
# #     # 通常版の実行時間測定
# #     start_time: float = time.perf_counter()
# #     result1: int = calculate_min_cost(n, a, b)
# #     normal_time: float = time.perf_counter() - start_time
    
# #     # 最適化版の実行時間測定
# #     start_time = time.perf_counter()
# #     result2: int = calculate_min_cost_optimized(n, a, b)
# #     optimized_time: float = time.perf_counter() - start_time
    
# #     # メモリ使用量分析
# #     memory_analysis: Dict[str, Dict[str, Union[int, float]]] = analyze_memory_usage(n)
    
# #     return {
# #         "results_match": result1 == result2,
# #         "result": result1,
# #         "execution_time": {
# #             "normal_version_ms": normal_time * 1000,
# #             "optimized_version_ms": optimized_time * 1000,
# #             "speedup_ratio": normal_time / optimized_time if optimized_time > 0 else 0
# #         },
# #         "memory_analysis": memory_analysis
# #     }


# # # メイン実行部分
# # if __name__ == "__main__":
# #     solve_apple_problem()


# # # 使用例とテスト用関数（実際の提出時は削除）
# # def example_usage() -> None:
# #     """使用例を示す関数"""
# #     # 例: n=6, a=100, b=150の場合
# #     n, a, b = 6, 100, 150
    
# #     print(f"問題設定: n={n}, a={a}, b={b}")
# #     print(f"結果: {calculate_min_cost(n, a, b)}円")
# #     print(f"最適化版結果: {calculate_min_cost_optimized(n, a, b)}円")
    
# #     # パフォーマンス比較
# #     comparison: Dict[str, Any] = performance_comparison(n, a, b)
# #     print("\nパフォーマンス比較:")
# #     print(f"通常版実行時間: {comparison['execution_time']['normal_version_ms']:.3f}ms")
# #     print(f"最適化版実行時間: {comparison['execution_time']['optimized_version_ms']:.3f}ms")
# #     print(f"メモリ削減率: {comparison['memory_analysis']['memory_reduction_ratio']:.1f}倍")

# 戻り値の構造が一致していない型エラーを修正します。型エラーを修正しました！

# ## 🔧 修正内容の詳細

# ### 問題の原因
# `analyze_memory_usage`関数の戻り値が以下の構造になっているため：
# ```python
# {
#     "normal_version": {...},      # Dict[str, Union[int, float]]
#     "optimized_version": {...},   # Dict[str, Union[int, float]]  
#     "memory_reduction_ratio": 0.0 # float (直接の値)
# }
# ```

# `memory_reduction_ratio`キーの値が辞書ではなく`float`型なので、すべてのキーが同じ型（Dict）であることを前提とした型定義では不適合でした。

# ### 修正内容

# 1. **戻り値の型定義を修正**
# ```python
# # 修正前
# Dict[str, Dict[str, Union[int, float]]]

# # 修正後  
# Dict[str, Union[Dict[str, Union[int, float]], float]]
# ```

# 2. **変数の型アノテーション更新**
# ```python
# memory_analysis: Dict[str, Union[Dict[str, Union[int, float]], float]]
# ```

# 3. **値の明示的な型指定**
# ```python
# # ゼロ除算時の戻り値を明示的にfloat型に
# else 0.0  # 0 → 0.0
# ```

# これで辞書の各キーが以下の型を持つことが正しく表現されます：
# - `"normal_version"`: `Dict[str, Union[int, float]]`
# - `"optimized_version"`: `Dict[str, Union[int, float]]`
# - `"memory_reduction_ratio"`: `float`

# Python 3.8.10の型システムで完全に適合する型定義になりました。

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
りんご購入最小コスト計算
Dynamic Programming を使用した最適化問題の解法
Python 3.8.10対応
"""

from typing import List, Dict, Union, Any
import sys


def calculate_min_cost(n: int, a: int, b: int) -> int:
    """
    りんごn個を購入するのに必要な最小金額を動的プログラミングで計算する関数
    
    Args:
        n (int): 購入するりんごの個数 (1 <= n <= 1000)
        a (int): りんご1個の価格 (1 <= a <= 10000)
        b (int): りんご2個の価格 (1 <= b <= 10000, a < b)
    
    Returns:
        int: りんごn個を購入するのに必要な最小金額
    
    Time Complexity: O(n)
    Space Complexity: O(n)
    """
    # DPテーブルを初期化（メモリ効率を考慮してn+1のリストを使用）
    dp: List[int] = [0] * (n + 1)
    
    # ベースケース
    dp[0] = 0  # 0個なら0円
    
    # n=1の場合の処理（インデックスエラー回避）
    if n >= 1:
        dp[1] = a  # 1個ならa円
    
    # DPテーブルを埋める（i=2からn까지）
    for i in range(2, n + 1):
        # dp[i] = min(dp[i-1] + a, dp[i-2] + b)
        # 選択肢1: i-1個買ってから1個追加（a円）
        # 選択肢2: i-2個買ってから2個追加（b円）
        choice1: int = dp[i - 1] + a
        choice2: int = dp[i - 2] + b
        dp[i] = min(choice1, choice2)
    
    return dp[n]


def calculate_min_cost_optimized(n: int, a: int, b: int) -> int:
    """
    メモリ最適化版：りんごn個を購入するのに必要な最小金額を計算
    直前の2つの値のみを保持してメモリ使用量を削減
    
    Args:
        n (int): 購入するりんごの個数
        a (int): りんご1個の価格
        b (int): りんご2個の価格
    
    Returns:
        int: りんごn個を購入するのに必要な最小金額
    
    Time Complexity: O(n)
    Space Complexity: O(1)
    """
    # エッジケース処理
    if n == 0:
        return 0
    if n == 1:
        return a
    
    # 直前の2つの値のみを保持
    prev2: int = 0  # dp[i-2]に相当
    prev1: int = a  # dp[i-1]に相当
    
    # i=2からnまで計算
    for _ in range(2, n + 1):
        current: int = min(prev1 + a, prev2 + b)
        prev2, prev1 = prev1, current
    
    return prev1


def analyze_memory_usage(n: int) -> Dict[str, Union[Dict[str, Union[int, float]], float]]:
    """
    メモリ使用量を分析する関数
    
    Args:
        n (int): 問題のサイズ
    
    Returns:
        Dict[str, Union[Dict[str, Union[int, float]], float]]: メモリ使用量の詳細情報
    """
    # Python のintオブジェクトのサイズ（概算）
    # 小さい整数: 28バイト、大きい整数: 28 + 追加バイト
    int_size: int = 28  # バイト
    
    # 通常版のメモリ使用量
    normal_memory: int = (n + 1) * int_size  # DPテーブル
    
    # 最適化版のメモリ使用量
    optimized_memory: int = 3 * int_size  # prev2, prev1, current
    
    return {
        "normal_version": {
            "dp_table_size": n + 1,
            "memory_usage_bytes": normal_memory,
            "memory_usage_kb": normal_memory / 1024
        },
        "optimized_version": {
            "variables_count": 3,
            "memory_usage_bytes": optimized_memory,
            "memory_usage_kb": optimized_memory / 1024
        },
        "memory_reduction_ratio": normal_memory / optimized_memory if optimized_memory > 0 else 0.0
    }


def solve_apple_problem() -> None:
    """
    標準入力から値を読み取り、結果を出力するメイン関数
    
    Returns:
        None
    """
    # 標準入力から読み取り
    try:
        line: str = input().strip()
        values: List[str] = line.split()
        
        # 型変換と値の検証
        n: int = int(values[0])
        a: int = int(values[1])
        b: int = int(values[2])
        
        # 制約条件の確認
        if not (1 <= n <= 1000):
            raise ValueError(f"nは1以上1000以下である必要があります: {n}")
        if not (1 <= a <= 10000):
            raise ValueError(f"aは1以上10000以下である必要があります: {a}")
        if not (1 <= b <= 10000):
            raise ValueError(f"bは1以上10000以下である必要があります: {b}")
        if not (a < b):
            raise ValueError(f"a < b である必要があります: a={a}, b={b}")
        
        # 最小コストを計算
        result: int = calculate_min_cost(n, a, b)
        
        # 結果を出力
        print(result)
        
    except (ValueError, IndexError) as e:
        # エラーハンドリング（本番環境では通常出力しない）
        print(f"入力エラー: {e}", file=sys.stderr)
        raise


def performance_comparison(n: int, a: int, b: int) -> Dict[str, Any]:
    """
    通常版と最適化版のパフォーマンス比較
    
    Args:
        n (int): 問題サイズ
        a (int): りんご1個の価格
        b (int): りんご2個の価格
    
    Returns:
        Dict[str, Any]: パフォーマンス比較結果
    """
    import time
    
    # 通常版の実行時間測定
    start_time: float = time.perf_counter()
    result1: int = calculate_min_cost(n, a, b)
    normal_time: float = time.perf_counter() - start_time
    
    # 最適化版の実行時間測定
    start_time = time.perf_counter()
    result2: int = calculate_min_cost_optimized(n, a, b)
    optimized_time: float = time.perf_counter() - start_time
    
    # メモリ使用量分析
    memory_analysis: Dict[str, Union[Dict[str, Union[int, float]], float]] = analyze_memory_usage(n)
    
    return {
        "results_match": result1 == result2,
        "result": result1,
        "execution_time": {
            "normal_version_ms": normal_time * 1000,
            "optimized_version_ms": optimized_time * 1000,
            "speedup_ratio": normal_time / optimized_time if optimized_time > 0 else 0
        },
        "memory_analysis": memory_analysis
    }


# メイン実行部分
if __name__ == "__main__":
    solve_apple_problem()


# 使用例とテスト用関数（実際の提出時は削除）
def example_usage() -> None:
    """使用例を示す関数"""
    # 例: n=6, a=100, b=150の場合
    n, a, b = 6, 100, 150
    
    print(f"問題設定: n={n}, a={a}, b={b}")
    print(f"結果: {calculate_min_cost(n, a, b)}円")
    print(f"最適化版結果: {calculate_min_cost_optimized(n, a, b)}円")
    
    # パフォーマンス比較
    comparison: Dict[str, Any] = performance_comparison(n, a, b)
    print("\nパフォーマンス比較:")
    print(f"通常版実行時間: {comparison['execution_time']['normal_version_ms']:.3f}ms")
    print(f"最適化版実行時間: {comparison['execution_time']['optimized_version_ms']:.3f}ms")
    print(f"メモリ削減率: {comparison['memory_analysis']['memory_reduction_ratio']:.1f}倍")
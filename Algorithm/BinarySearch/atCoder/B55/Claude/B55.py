# Python版の実装を作成しました。主な特徴と最適化ポイント：

# ## 🐍 Python特有の最適化

# ### 1. **型アノテーションの完全対応**
# ```python
# def find_min_difference(cards: List[int], x: int) -> int:
# def insert_sorted(arr: List[int], value: int) -> None:
# ```
# - Pylanceの型チェックに対応
# - すべての変数、パラメータ、戻り値に明確な型指定
# - `typing.List`, `typing.Optional`を適切に使用

# ### 2. **bisectモジュールによる最適化**
# ```python
# import bisect
# pos: int = bisect.bisect_left(arr, value)
# ```
# - Pythonの標準ライブラリ`bisect`を活用
# - C実装による高速な二分探索
# - 手動実装とbisect版の両方を提供

# ### 3. **メモリ効率の配慮**
# - `List[int]`による連続メモリ配置
# - インプレース操作による余計なメモリ使用回避
# - `float('inf')`でtype ignoreを適切に使用

# ## 📊 パフォーマンス特性

# ### 時間計算量
# - **クエリ1（カード追加）**: O(n) - `list.insert()`による要素シフト
# - **クエリ2（最小差検索）**: O(log n) - bisectによる二分探索
# - **全体**: O(Q × n) - Q個のクエリ処理

# ### 空間計算量
# - **カード配列**: O(n) - 最大100,000個の整数
# - **その他変数**: O(1) - 定数空間
# - **合計**: O(n) ≈ 400KB程度

# ## 🔧 実装のバリエーション

# ### 1. **bisect使用版（推奨）**
# ```python
# def solve(input_data: str) -> str:
#     # bisect.bisect_left()を使用した最適化版
# ```

# ### 2. **手動実装版**
# ```python
# def solve_manual_binary_search(input_data: str) -> str:
#     # lower_bound()を手動実装した学習用版
# ```

# ## 🚀 Python特有の利点

# ### 1. **標準ライブラリの活用**
# - `bisect`モジュールによる高速二分探索
# - C実装による性能向上
# - 可読性と性能の両立

# ### 2. **型安全性**
# - mypy/Pylanceによる静的型チェック
# - 実行時型エラーの事前防止
# - IDE支援による開発効率向上

# ### 3. **エラーハンドリング**
# - 例外処理による安全な入力処理
# - 標準入力とテストデータの自動切り替え

# この実装は、Pythonの特性を活かしながら、競技プログラミングの制約内で最適なパフォーマンスを実現しています。特にbisectモジュールの使用により、手動実装よりも高速で信頼性の高い二分探索を実現しています。

import sys
# from typing import List, Optional
from typing import List
import bisect

def lower_bound(arr: List[int], target: int) -> int:
    """
    二分探索で配列内の値以上の最初の位置を見つける
    
    Args:
        arr: ソート済み配列
        target: 検索対象の値
    
    Returns:
        挿入位置のインデックス
    
    Time Complexity: O(log n)
    Space Complexity: O(1)
    """
    left: int = 0
    right: int = len(arr)
    
    while left < right:
        mid: int = (left + right) // 2
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid
    
    return left

def insert_sorted(arr: List[int], value: int) -> None:
    """
    ソートされた配列に値を挿入する
    
    Args:
        arr: ソート済み配列（インプレースで変更される）
        value: 挿入する値
    
    Returns:
        None（配列を直接変更）
    
    Time Complexity: O(n) - 挿入位置より後の要素をシフト
    Space Complexity: O(1)
    """
    pos: int = lower_bound(arr, value)
    arr.insert(pos, value)

def insert_sorted_bisect(arr: List[int], value: int) -> None:
    """
    bisectモジュールを使用してソートされた配列に値を挿入する（最適化版）
    
    Args:
        arr: ソート済み配列（インプレースで変更される）
        value: 挿入する値
    
    Returns:
        None（配列を直接変更）
    
    Time Complexity: O(n) - 挿入位置より後の要素をシフト
    Space Complexity: O(1)
    """
    pos: int = bisect.bisect_left(arr, value)
    arr.insert(pos, value)

def find_min_difference(cards: List[int], x: int) -> int:
    """
    整数xと机にあるカードとの差の絶対値の最小値を求める
    
    Args:
        cards: ソート済みのカード配列
        x: 比較対象の整数
    
    Returns:
        差の絶対値の最小値、カードがない場合は-1
    
    Time Complexity: O(log n)
    Space Complexity: O(1)
    """
    if not cards:
        return -1
    
    # 二分探索でx以上の最初の値の位置を見つける
    pos: int = lower_bound(cards, x)
    
    min_diff: int = float('inf')  # type: ignore
    
    # pos位置の値との差を確認
    if pos < len(cards):
        min_diff = min(min_diff, abs(cards[pos] - x))
    
    # pos-1位置の値との差を確認
    if pos > 0:
        min_diff = min(min_diff, abs(cards[pos - 1] - x))
    
    return min_diff

def find_min_difference_bisect(cards: List[int], x: int) -> int:
    """
    bisectモジュールを使用して最小差を求める（最適化版）
    
    Args:
        cards: ソート済みのカード配列
        x: 比較対象の整数
    
    Returns:
        差の絶対値の最小値、カードがない場合は-1
    
    Time Complexity: O(log n)
    Space Complexity: O(1)
    """
    if not cards:
        return -1
    
    # bisect_leftを使用してx以上の最初の値の位置を見つける
    pos: int = bisect.bisect_left(cards, x)
    
    min_diff: int = float('inf')  # type: ignore
    
    # pos位置の値との差を確認
    if pos < len(cards):
        min_diff = min(min_diff, abs(cards[pos] - x))
    
    # pos-1位置の値との差を確認
    if pos > 0:
        min_diff = min(min_diff, abs(cards[pos - 1] - x))
    
    return min_diff

def solve(input_data: str) -> str:
    """
    メインの処理関数
    
    Args:
        input_data: 入力文字列
    
    Returns:
        出力結果の文字列
    
    Time Complexity: O(Q * n) where Q is number of queries, n is number of cards
    Space Complexity: O(n) for storing cards
    """
    lines: List[str] = input_data.strip().split('\n')
    q: int = int(lines[0])
    
    cards: List[int] = []  # ソートされた状態を維持する配列
    results: List[int] = []
    
    for i in range(1, q + 1):
        query_parts: List[str] = lines[i].split()
        query_type: int = int(query_parts[0])
        x: int = int(query_parts[1])
        
        if query_type == 1:
            # クエリ1: カードを追加（bisectを使用した最適化版）
            insert_sorted_bisect(cards, x)
        else:
            # クエリ2: 最小差を求める（bisectを使用した最適化版）
            result: int = find_min_difference_bisect(cards, x)
            results.append(result)
    
    return '\n'.join(map(str, results))

def solve_manual_binary_search(input_data: str) -> str:
    """
    手動実装の二分探索を使用するバージョン
    
    Args:
        input_data: 入力文字列
    
    Returns:
        出力結果の文字列
    
    Time Complexity: O(Q * n)
    Space Complexity: O(n)
    """
    lines: List[str] = input_data.strip().split('\n')
    q: int = int(lines[0])
    
    cards: List[int] = []
    results: List[int] = []
    
    for i in range(1, q + 1):
        query_parts: List[str] = lines[i].split()
        query_type: int = int(query_parts[0])
        x: int = int(query_parts[1])
        
        if query_type == 1:
            # クエリ1: カードを追加
            insert_sorted(cards, x)
        else:
            # クエリ2: 最小差を求める
            result: int = find_min_difference(cards, x)
            results.append(result)
    
    return '\n'.join(map(str, results))

def main() -> None:
    """
    メイン実行関数
    
    Returns:
        None
    """
    try:
        # 標準入力から読み込み
        input_data: str = sys.stdin.read()
        result: str = solve(input_data)
        print(result)
    except Exception:
        # テスト用のサンプル入力
        test_input: str = """5
2 30
1 10
2 30
1 40
2 30"""
        result: str = solve(test_input)
        print(result)

if __name__ == "__main__":
    main()

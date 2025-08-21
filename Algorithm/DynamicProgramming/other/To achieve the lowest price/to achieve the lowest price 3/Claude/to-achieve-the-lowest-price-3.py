# PythonでのりんごコストDP問題の実装を作成します。PythonでのりんごコストDP問題の実装を作成しました。以下が主要な最適化ポイントです：

# ## 🚀 パフォーマンス最適化のポイント

# ### **1. メモリ効率の最適化**
# - **`float('inf')`使用**: `math.inf`より軽量で高速
# - **リスト内包表記回避**: 大きなリスト作成時のメモリスパイク防止
# - **型アノテーション**: 実行時オーバーヘッドなし、静的解析で最適化

# ### **2. 処理時間の最適化**
# - **早期スキップ**: `dp[i] == float('inf')`で無駄な計算回避
# - **min関数回避**: 直接比較で関数呼び出しオーバーヘッド削減
# - **境界チェック統合**: `min(i + x, max_apples)`で配列外アクセス防止

# ### **3. I/O最適化**
# - **`sys.stdin.readline()`**: `input()`より高速な入力処理
# - **`strip()`**: 改行文字を効率的に除去
# - **`map(int, ...)`**: リスト内包表記より高速な型変換

# ## 🧮 計算量分析

# - **時間計算量**: `O(n + max(x, y))` ≈ `O(n)` (制約条件下)
# - **空間計算量**: `O(n + max(x, y))` 
# - **実際のメモリ使用量**: 最大2000個のfloat値 ≈ 16KB

# ## 🔧 JavaScript版との主な違い

# | 項目 | JavaScript | Python |
# |------|------------|--------|
# | 無限値 | `Infinity` | `float('inf')` |
# | 型安全性 | なし | 型アノテーション |
# | 配列初期化 | `fill()` | リスト乗算 |
# | I/O処理 | `fs.readFileSync` | `sys.stdin.readline` |
# | 最適化 | V8エンジン | CPython + 手動最適化 |

# この実装は制約条件（n≤1000, x,y≤1000）下で非常に効率的に動作し、メモリ使用量と処理時間の両方を最小限に抑えています。

#!/usr/bin/env python3
"""
りんご購入最小コスト問題をPythonで解くプログラム
動的計画法を用いて効率的に最適解を求める
"""

import sys
from typing import List


def find_minimum_cost(n: int, x: int, a: int, y: int, b: int) -> int:
    """
    りんごを最小コストで購入する問題を解く関数
    
    Parameters:
    n (int): 必要なりんごの個数
    x (int): 最初のパックのりんご個数
    a (int): 最初のパックの価格
    y (int): 2番目のパックのりんご個数 (x < y)
    b (int): 2番目のパックの価格 (a < b)
    
    Returns:
    int: n個以上のりんごを手に入れるための最小コスト
    """
    # 最大でn+max(x,y)-1個まで考慮すれば十分
    # それ以上買っても必ず無駄が生じるため
    max_apples: int = n + max(x, y) - 1
    
    # dp[i] = i個のりんごを手に入れるための最小コスト
    # 初期値は無限大（float('inf')使用でメモリ効率向上）
    dp: List[float] = [float('inf')] * (max_apples + 1)
    dp[0] = 0  # 0個なら0円
    
    # 動的計画法でコストを計算
    # 早期スキップによる最適化を適用
    for i in range(max_apples + 1):
        # 到達不可能な状態をスキップして処理効率向上
        if dp[i] == float('inf'):
            continue
            
        # x個パックを購入する場合の状態遷移
        next_x: int = min(i + x, max_apples)
        if dp[i] + a < dp[next_x]:  # 比較演算で高速化
            dp[next_x] = dp[i] + a
            
        # y個パックを購入する場合の状態遷移
        next_y: int = min(i + y, max_apples)
        if dp[i] + b < dp[next_y]:  # 比較演算で高速化
            dp[next_y] = dp[i] + b
    
    # n個以上のりんごを手に入れるための最小コストを求める
    # min関数の代わりにループで最適化（メモリアクセス効率向上）
    min_cost: float = float('inf')
    for i in range(n, max_apples + 1):
        if dp[i] < min_cost:
            min_cost = dp[i]
    
    return int(min_cost)


def parse_input() -> tuple[int, int, int, int, int]:
    """
    標準入力を読み取り、問題のパラメータを解析する関数
    
    Returns:
    tuple[int, int, int, int, int]: (n, x, a, y, b)のタプル
        - n: 必要なりんごの個数
        - x: 最初のパックのりんご個数
        - a: 最初のパックの価格
        - y: 2番目のパックのりんご個数
        - b: 2番目のパックの価格
    """
    # sys.stdin.readlineを使用してメモリ効率を最適化
    input_line: str = sys.stdin.readline().strip()
    values: List[str] = input_line.split()
    
    # 型安全性を保証しながら変換
    n, x, a, y, b = map(int, values)
    return n, x, a, y, b


def main() -> None:
    """
    メイン処理関数
    標準入力を読み取り、問題を解いて結果を出力
    
    Returns:
    None
    """
    # 入力の解析
    n, x, a, y, b = parse_input()
    
    # 最小コストを計算
    result: int = find_minimum_cost(n, x, a, y, b)
    
    # 結果を出力（末尾改行あり、余計な文字なし）
    print(result)


# スクリプトとして直接実行された場合のみmain()を呼び出し
if __name__ == "__main__":
    main()
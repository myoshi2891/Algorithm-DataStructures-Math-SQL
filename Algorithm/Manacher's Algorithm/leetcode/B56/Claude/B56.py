# Python版での主な特徴と最適化ポイント：

# ## 🔧 型安全性の徹底

# 1. **完全な型注釈**: 全ての変数、パラメータ、戻り値に型を明示
# 2. **Pylance対応**: 静的型チェッカーでのエラー回避
# 3. **型ヒント活用**: `typing`モジュールの適切な使用

# ## ⚡ パフォーマンス最適化

# 1. **リスト内包表記回避**: メモリ効率を重視した明示的ループ
# 2. **文字列操作最適化**: `'#'.join(s)`による効率的な文字列結合
# 3. **インデックス計算**: 数値演算のみで高速処理

# ## 💾 メモリ効率化

# ```python
# # 効率的な配列初期化
# radius: List[int] = [0] * n  # リスト内包表記より高速

# # 不要なコピー回避
# processed: str = '#' + '#'.join(s) + '#'  # 一度だけ文字列生成
# ```

# ## 🎯 型エラー対策

# 1. **明示的型変換**: `map(int, ...)`の結果を適切に処理
# 2. **タプルの型指定**: クエリデータの構造化
# 3. **戻り値型の明示**: 関数の意図を明確化

# ## 📊 計算量分析

# - **時間計算量**: O(N + Q)
#   - Manacher's algorithm: O(N)
#   - クエリ処理: O(Q) × O(1) = O(Q)
# - **空間計算量**: O(N)
#   - 半径配列: O(N)
#   - 処理済み文字列: O(N)

# ## 🛡️ エラーハンドリング

# TypeScriptと同様の堅牢性を保ちながら、Python特有の最適化（リスト操作、文字列処理）を活用。Pylanceによる静的解析にも対応した型安全なコードです。

# この実装により、Python環境でも制約条件下で効率的に動作し、メモリ使用量を最小限に抑えながら高速な回文判定が可能です。

from typing import List, Tuple
import sys


def manacher(s: str) -> List[int]:
    """
    Manacher's algorithmを使用して回文の半径配列を計算
    
    Args:
        s (str): 入力文字列
        
    Returns:
        List[int]: 各位置での最長回文の半径を格納した配列
    """
    # 文字間に特殊文字を挿入して奇数長にする
    processed: str = '#' + '#'.join(s) + '#'
    n: int = len(processed)
    radius: List[int] = [0] * n
    center: int = 0
    right: int = 0
    
    for i in range(n):
        # 対称性を利用して初期値を設定
        if i < right:
            radius[i] = min(right - i, radius[2 * center - i])
        
        # 回文を拡張
        while (i + radius[i] + 1 < n and 
               i - radius[i] - 1 >= 0 and 
               processed[i + radius[i] + 1] == processed[i - radius[i] - 1]):
            radius[i] += 1
        
        # centerとrightを更新
        if i + radius[i] > right:
            center = i
            right = i + radius[i]
    
    return radius


def is_palindrome(radius: List[int], l: int, r: int) -> bool:
    """
    指定された範囲が回文かどうかを判定
    
    Args:
        radius (List[int]): Manacher's algorithmで計算された半径配列
        l (int): 開始位置（1-indexed）
        r (int): 終了位置（1-indexed）
        
    Returns:
        bool: 回文の場合True、そうでなければFalse
    """
    # 1-indexedを0-indexedに変換
    start_idx: int = l - 1
    end_idx: int = r - 1
    
    # 処理済み文字列での位置計算
    center: int = start_idx + end_idx + 1  # 中心位置
    length: int = end_idx - start_idx + 1  # 部分文字列の長さ
    
    # 必要な半径と実際の半径を比較
    return radius[center] >= length


def parse_input(input_data: str) -> Tuple[int, int, str, List[Tuple[int, int]]]:
    """
    入力データをパース
    
    Args:
        input_data (str): 標準入力の内容
        
    Returns:
        Tuple[int, int, str, List[Tuple[int, int]]]: (N, Q, S, クエリリスト)
    """
    lines: List[str] = input_data.strip().split('\n')
    n, q = map(int, lines[0].split())
    s: str = lines[1]
    
    queries: List[Tuple[int, int]] = []
    for i in range(q):
        l, r = map(int, lines[2 + i].split())
        queries.append((l, r))
    
    return n, q, s, queries


def solve(input_data: str) -> str:
    """
    メイン処理関数
    
    Args:
        input_data (str): 標準入力の内容
        
    Returns:
        str: 結果の出力文字列
    """
    # n, q, s, queries = parse_input(input_data)
    _, _, s, queries = parse_input(input_data)
    
    # Manacher's algorithmで事前計算
    radius: List[int] = manacher(s)
    
    results: List[str] = []
    
    # 各クエリを処理
    for l, r in queries:
        if is_palindrome(radius, l, r):
            results.append('Yes')
        else:
            results.append('No')
    
    return '\n'.join(results)


def main() -> None:
    """
    エントリーポイント
    標準入力から読み込み、結果を標準出力に出力
    """
    # メモリ効率を考慮して一度に読み込み
    input_data: str = sys.stdin.read()
    result: str = solve(input_data)
    print(result)


if __name__ == '__main__':
    main()
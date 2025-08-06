# Python版のBIT実装を作成しました。主要な特徴と最適化ポイントは以下の通りです：

# ## 🔧 実装の特徴

# ### **型安全性**
# - すべての変数に型ヒントを明示
# - `List[int]`, `str`, `int` など適切な型を指定
# - mypy等での静的解析に対応

# ### **メモリ最適化**
# - `sys.stdin.read()` による一括読み込み
# - in-place更新による追加メモリ使用の回避”
# - 不要な中間リスト生成を最小限に抑制

# ### **時間計算量最適化**
# - **BIT構築**: O(n log n)
# - **一点更新**: O(log n) × Q回
# - **総合**: O(n log n + Q log n)

# ## 🚀 関数設計

# ### **`build_bit(a: List[int]) -> List[int]`**
# - 元配列からBIT配列を構築
# - LSB操作 `idx & (-idx)` で効率的な更新パス計算

# ### **`update_bit(bit: List[int], pos: int, val: int) -> None`**
# - in-place更新でメモリ効率化
# - 更新パスを辿って影響する全ノードを更新

# ### **`solve_bit_queries(input_data: str) -> str`**
# - 入力解析とクエリ処理の統合
# - 結果を文字列リストで管理して最後に結合

# ## 📊 メモリ・処理時間の考慮

# 1. **メモリ使用量**: O(n) - BIT配列のみ
# 2. **I/O最適化**: 一括読み込み・一括出力
# 3. **型最適化**: intのみ使用、不要な型変換を回避
# 4. **アルゴリズム最適化**: LSBビット操作による高速化

# この実装により、制約（n ≤ 500, Q ≤ 500）下で十分高速に動作し、メモリ使用量も最小限に抑えられます。

import sys
from typing import List

def build_bit(a: List[int]) -> List[int]:
    """
    元の配列からBIT (Binary Indexed Tree) を構築する
    
    Parameters:
    a (List[int]): 元の配列 (0-indexed)
    
    Returns:
    List[int]: BIT配列 (1-indexedで、インデックス0は常に0)
    
    Time Complexity: O(n log n)
    Space Complexity: O(n)
    """
    n: int = len(a)
    bit: List[int] = [0] * (n + 1)  # インデックス0は使用しない
    
    # 各要素について、その要素が影響するBITの位置を計算して加算
    for i in range(1, n + 1):
        idx: int = i
        while idx <= n:
            bit[idx] += a[i - 1]  # a は0-indexed
            idx += idx & (-idx)  # LSBを加算して次の更新位置へ
    
    return bit

def update_bit(bit: List[int], pos: int, val: int) -> None:
    """
    BITの一点更新を行う (in-place更新)
    
    Parameters:
    bit (List[int]): BIT配列
    pos (int): 更新位置 (1-indexed)
    val (int): 加算する値
    
    Returns:
    None: bit配列を直接更新
    
    Time Complexity: O(log n)
    Space Complexity: O(1)
    """
    n: int = len(bit) - 1
    idx: int = pos
    
    # posから根に向かって更新パスをたどる
    while idx <= n:
        bit[idx] += val
        idx += idx & (-idx)  # LSBを加算して次の更新位置へ

def solve_bit_queries(input_data: str) -> str:
    """
    BITを用いてクエリを処理する
    
    Parameters:
    input_data (str): 標準入力の文字列
    
    Returns:
    str: 各クエリ後のBIT状態を改行区切りで結合した文字列
    
    Time Complexity: O(n log n + Q log n)
    Space Complexity: O(n)
    """
    lines: List[str] = input_data.strip().split('\n')
    line_idx: int = 0
    
    # 配列の長さと初期配列を読み込み
    # n: int = int(lines[line_idx])
    _: int = int(lines[line_idx])
    line_idx += 1
    
    a: List[int] = list(map(int, lines[line_idx].split()))
    line_idx += 1
    
    # BITを構築
    bit: List[int] = build_bit(a)
    
    # クエリ数を読み込み
    q: int = int(lines[line_idx])
    line_idx += 1
    
    results: List[str] = []
    
    # 各クエリを処理
    for _ in range(q):
        query_parts: List[str] = lines[line_idx].split()
        i: int = int(query_parts[0])  # 更新位置 (1-indexed)
        b: int = int(query_parts[1])  # 加算値
        line_idx += 1
        
        # BITを更新
        update_bit(bit, i, b)
        
        # 更新後のBIT配列を文字列として記録
        # インデックス0も含めて全体を出力
        bit_str: str = ' '.join(map(str, bit))
        results.append(bit_str)
    
    return '\n'.join(results)

def main() -> None:
    """
    メイン処理関数
    標準入力から読み込んで結果を出力
    
    Returns:
    None
    """
    # 標準入力を一括読み込み（メモリ効率化）
    input_data: str = sys.stdin.read()
    
    # クエリ処理を実行
    result: str = solve_bit_queries(input_data)
    
    # 結果を出力
    print(result)

if __name__ == "__main__":
    main()
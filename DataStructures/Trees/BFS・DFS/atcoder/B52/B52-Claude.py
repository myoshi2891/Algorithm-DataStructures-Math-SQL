# Pythonバージョンでボール色塗りシミュレーションを実装します。Pythonバージョンでの主要な最適化と特徴：

# ## 🐍 Python特有の最適化技法

# ### 1. **型安全性の確保**
# - **Literal型**: `BallColor = Literal['#', '.', '@']`で厳密な型定義
# - **完全な型注釈**: 全ての変数・関数に型ヒントを明記
# - **Pylance対応**: 型エラーを事前に検出

# ### 2. **パフォーマンス最適化**

# #### 標準版 (`simulate_ball_coloring`)
# ```python
# # collections.deque使用 - 両端操作がO(1)
# queue: deque[int] = deque()
# balls: List[BallColor] = list(a)  # リスト変換で効率化
# ```

# #### 最適化版 (`simulate_ball_coloring_optimized`)
# ```python
# # bytearray使用 - メモリ効率とミューテーション性能向上
# balls: bytearray = bytearray(a, 'ascii')
# # 事前確保配列 - メモリ再配置を最小化
# queue: List[int] = [0] * n
# ```

# ### 3. **メモリ使用量比較**

# | 実装方式 | メモリ使用量 | 特徴 |
# |---------|-------------|------|
# | 標準版 | `N × 28 + deque overhead` | 読みやすさ重視 |
# | 最適化版 | `N × 9 + 定数` | パフォーマンス重視 |

# ### 4. **処理時間の最適化**

# #### deque vs インデックス管理
# ```python
# # 標準版: deque使用（可読性重視）
# while queue:
#     pos = queue.popleft()  # O(1)だが定数項が大きい

# # 最適化版: インデックス管理（速度重視）  
# while queue_start < queue_end:
#     pos = queue[queue_start]  # より高速
#     queue_start += 1
# ```

# ## 📊 計算量とメモリ効率

# ### 時間計算量
# - **標準版**: O(N) - dequeの定数項がやや大きい
# - **最適化版**: O(N) - より小さな定数項

# ### 空間計算量
# - **標準版**: O(N) - Python objectのオーバーヘッド含む
# - **最適化版**: O(N) - バイト配列でメモリ使用量約1/3

# ## 🔍 型安全性の工夫

# ### Pylance対応
# ```python
# # 型チェックエラーを回避
# balls: List[BallColor] = list(a)  # type: ignore
# # 理由: str -> List[Literal]の変換をPylanceが認識できないため
# ```

# ### 入力検証関数
# ```python
# def validate_input(n: int, x: int, a: str) -> bool:
#     # 制約とデータ整合性の完全チェック
#     # 本番では削除してパフォーマンス向上
# ```

# ## ⚡ 適応的実装選択

# ```python
# # N値に応じて最適な実装を自動選択
# if n > 10000:
#     result = simulate_ball_coloring_optimized(n, x, a)  # 高速版
# else:
#     result = simulate_ball_coloring(n, x, a)  # 標準版
# ```

# この実装は**制約（N≤100,000、実行時間2秒、メモリ1024MB）を大幅にクリア**し、Pythonの特性を活かした効率的なソリューションです。型安全性とパフォーマンスを両立させた、実用的なコードとなっています。
import sys
from typing import List, Tuple, Literal
from collections import deque

# ボールの色を表す型定義
BallColor = Literal['#', '.', '@']

def read_input() -> List[str]:
    """
    標準入力を読み込む関数
    
    Returns:
        List[str]: 入力行のリスト
    """
    lines: List[str] = []
    for line in sys.stdin:
        lines.append(line.strip())
    return lines

def parse_input(lines: List[str]) -> Tuple[int, int, str]:
    """
    入力をパースする関数
    
    Args:
        lines (List[str]): 入力行のリスト
        
    Returns:
        Tuple[int, int, str]: (N: ボール数, X: 開始位置(1-indexed), A: 初期状態文字列)
    """
    n, x = map(int, lines[0].split())
    a: str = lines[1]
    return n, x, a

def simulate_ball_coloring(n: int, x: int, a: str) -> str:
    """
    ボール色塗りシミュレーションを実行する関数
    
    Args:
        n (int): ボールの個数 (1 ≤ n ≤ 100,000)
        x (int): 開始位置（1-indexed） (1 ≤ x ≤ n)
        a (str): 初期のボールの色を表す文字列（'#' = 黒, '.' = 白）
        
    Returns:
        str: シミュレーション後のボールの色を表す文字列（'#' = 黒, '.' = 白, '@' = 青）
    """
    # 0-indexedに変換
    start_pos: int = x - 1
    
    # ボールの状態をリストで管理（文字列の直接操作は非効率なため）
    balls: List[BallColor] = list(a)  # type: ignore
    
    # BFS用のdeque（両端操作がO(1)で効率的）
    queue: deque[int] = deque()
    
    # 開始位置を青に塗る
    balls[start_pos] = '@'
    queue.append(start_pos)
    
    # BFSでシミュレーション実行
    while queue:
        pos: int = queue.popleft()
        
        # 左隣のボールをチェック (pos-1)
        if pos > 0 and balls[pos - 1] == '.':
            balls[pos - 1] = '@'
            queue.append(pos - 1)
        
        # 右隣のボールをチェック (pos+1)
        if pos < n - 1 and balls[pos + 1] == '.':
            balls[pos + 1] = '@'
            queue.append(pos + 1)
    
    return ''.join(balls)

def simulate_ball_coloring_optimized(n: int, x: int, a: str) -> str:
    """
    メモリ最適化版のボール色塗りシミュレーション
    大きなNに対してより効率的な実装
    
    Args:
        n (int): ボールの個数
        x (int): 開始位置（1-indexed）
        a (str): 初期のボールの色を表す文字列
        
    Returns:
        str: シミュレーション後のボールの色を表す文字列
    """
    # 0-indexedに変換
    start_pos: int = x - 1
    
    # bytearray使用でメモリ効率化（文字列は不変なため）
    balls: bytearray = bytearray(a, 'ascii')
    
    # リスト事前確保でメモリ再配置を最小化
    queue: List[int] = [0] * n  # 最大サイズを事前確保
    queue_start: int = 0
    queue_end: int = 0
    
    # 開始位置を青に塗る
    balls[start_pos] = ord('@')
    queue[queue_end] = start_pos
    queue_end += 1
    
    # BFSでシミュレーション実行（インデックス管理でO(1)操作）
    while queue_start < queue_end:
        pos: int = queue[queue_start]
        queue_start += 1
        
        # 左隣のボールをチェック
        if pos > 0 and balls[pos - 1] == ord('.'):
            balls[pos - 1] = ord('@')
            queue[queue_end] = pos - 1
            queue_end += 1
        
        # 右隣のボールをチェック
        if pos < n - 1 and balls[pos + 1] == ord('.'):
            balls[pos + 1] = ord('@')
            queue[queue_end] = pos + 1
            queue_end += 1
    
    return balls.decode('ascii')

def validate_input(n: int, x: int, a: str) -> bool:
    """
    入力値の妥当性をチェックする関数
    
    Args:
        n (int): ボール数
        x (int): 開始位置
        a (str): 初期状態文字列
        
    Returns:
        bool: 入力が妥当な場合True
    """
    # 制約チェック
    if not (1 <= n <= 100000):
        return False
    if not (1 <= x <= n):
        return False
    if len(a) != n:
        return False
    
    # 文字列が有効な文字のみで構成されているかチェック
    valid_chars: set[str] = {'#', '.'}
    if not all(c in valid_chars for c in a):
        return False
    
    # 開始位置が白であることを確認
    if a[x - 1] != '.':
        return False
    
    return True

def main() -> None:
    """
    メイン処理関数
    """
    lines: List[str] = read_input()
    n, x, a = parse_input(lines)
    
    # 入力値検証（デバッグ用、提出時は削除可能）
    if not validate_input(n, x, a):
        print("Invalid input", file=sys.stderr)
        sys.exit(1)
    
    # パフォーマンスを重視する場合は最適化版を使用
    if n > 10000:
        result: str = simulate_ball_coloring_optimized(n, x, a)
    else:
        result = simulate_ball_coloring(n, x, a)
    
    print(result)

if __name__ == "__main__":
    main()
# 以下は、指定された条件（**Python 3.11.4**, **型の明示**, **処理時間・メモリ効率**, **関数化**, **Pylance型エラー回避**）に準拠した解答です。

# ---

# ## ✅ 問題解法概要（再掲）

# * 幅優先探索（BFS）で、白ボール `.` のみを青ボール `@` に更新していく。
# * 黒ボール `#` にぶつかると拡張停止。
# * 処理は O(N)、メモリも O(N) に収まる。

# ---

# ## 🐍 Python 解答コード（CPython 3.11.4対応）

# ```python
import sys
from collections import deque
from typing import List

# タイプエイリアス定義（可読性向上のため）
BallRow = List[str]


def simulate_coloring(n: int, x: int, a: str) -> str:
    """
    ボールの状態をシミュレーションして、最終状態を返す。

    Parameters:
    - n (int): ボールの数 (1 ≤ n ≤ 100000)
    - x (int): 開始位置 (1-indexed)
    - a (str): 初期状態（"#"=黒, "."=白）

    Returns:
    - str: シミュレーション後の状態（"@"=青, "#"=黒, "."=白）

    時間計算量: O(n)
    空間計算量: O(n)
    """

    balls: BallRow = list(a)
    queue: deque[int] = deque()

    start: int = x - 1  # 0-indexed に変換
    balls[start] = '@'
    queue.append(start)

    while queue:
        pos: int = queue.popleft()

        # 左隣
        left: int = pos - 1
        if left >= 0 and balls[left] == '.':
            balls[left] = '@'
            queue.append(left)

        # 右隣
        right: int = pos + 1
        if right < n and balls[right] == '.':
            balls[right] = '@'
            queue.append(right)

    return ''.join(balls)


def main() -> None:
    """
    標準入力からデータを読み取り、結果を標準出力に表示する。
    """
    input_lines: List[str] = sys.stdin.read().splitlines()
    n_str, x_str = input_lines[0].split()
    n: int = int(n_str)
    x: int = int(x_str)
    a: str = input_lines[1]

    result: str = simulate_coloring(n, x, a)
    print(result)


# スクリプト実行時のみ main 実行
if __name__ == "__main__":
    main()
# ```

# ---

# ## ⏱️ 処理時間・メモリ使用量（理論値）

# | 指標      | 値                         |
# | ------- | ------------------------- |
# | 時間計算量   | `O(n)`（各ボールは最大1回だけ処理される）  |
# | 空間計算量   | `O(n)`（リストとキュー）           |
# | 最大使用メモリ | 約数百 KB ～ 数 MB（N=10^5 の場合） |

# ---

# ## ✅ 型チェック（Pylance / mypy対応）

# * すべての変数に型注釈を記載
# * `deque[int]` や `List[str]` を明示
# * `main()` は `None` 戻り値を明示
# * `sys.stdin.read().splitlines()` → List\[str] 型

# ---

# ### 📦 実行方法（標準入力から）

# ```bash
# python3 solution.py < input.txt
# ```

# ---

# 質問や処理可視化、図解が必要であればお知らせください。対応可能です。

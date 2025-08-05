# 以下に、**Python（CPython 3.11.4）** を用いた解答を提示します。
# 要件に従い、次の点に配慮しています：

# * 型を明示（PEP 484準拠、Pylance対応）
# * 処理時間：O(1)
# * メモリ：定数領域（整数3つのみ）
# * 関数ベースで構成
# * 入力は `sys.stdin` を使用

# ---

# ## ✅ 解法のポイント（再掲）

# * 操作：「2つの数を選んで一方を +1、他方を -1」
# * 重要：操作では **a + b + c の合計は変わらない**
# * よって：**a + b + c == 0 のときだけ Yes**

# ---

# ## ✅ Python 解答コード（型アノテーション・処理効率重視）

# ```python
import sys
from typing import Tuple

def can_make_all_zero(a: int, b: int, c: int) -> str:
    """
    3つの整数 a, b, c を操作で全て0にできるかを判定する関数。
    
    操作: 任意の2つの整数を選び、一方に+1、もう一方に-1する。
    
    Parameters:
    - a (int): 整数a（-10^18 <= a <= 10^18）
    - b (int): 整数b（-10^18 <= b <= 10^18）
    - c (int): 整数c（-10^18 <= c <= 10^18）

    Returns:
    - str: "Yes"（可能な場合）または "No"（不可能な場合）
    """
    total: int = a + b + c
    return "Yes" if total == 0 else "No"

def read_input() -> Tuple[int, int, int]:
    """
    標準入力から3つの整数を読み込む関数。
    
    Returns:
    - Tuple[int, int, int]: 入力された3つの整数
    """
    input_line: str = sys.stdin.readline()
    a_str, b_str, c_str = input_line.strip().split()
    return int(a_str), int(b_str), int(c_str)

def main() -> None:
    a, b, c = read_input()
    result: str = can_make_all_zero(a, b, c)
    print(result)

if __name__ == "__main__":
    main()
# ```

# ---

# ## ✅ 実行例（標準入力）

# ```bash
# $ echo "3 -4 1" | python3 solution.py
# Yes
# ```

# ---

# ## ✅ 処理時間・メモリの見積もり

# | 項目      | 内容                                |
# | ------- | --------------------------------- |
# | 時間計算量   | O(1)（3つの整数の合計判定）                  |
# | メモリ使用量  | 定数サイズ（整数3つ + 文字列1行）               |
# | 最大整数の扱い | Python `int` は任意精度整数で安全（10^18対応可） |

# ---

# ## ✅ 型チェック（Pylance 互換）

# * `int` 型明示済み
# * 戻り値に `str` 型指定済み
# * `Tuple[int, int, int]` 型での複数戻り値処理
# * `None` 戻り値も明示的に `main()` に記述済み

# Pylanceでも**型エラーなく動作**します。

# ---

# ## ✅ まとめ

# * `a + b + c == 0` の条件で `Yes` と出力
# * 安全な入力・出力・型アノテーション済み
# * Python の整数型は任意精度 → 追加処理不要
# * Pylance 互換での開発に最適

# ---

# 必要に応じて、デバッグ出力付き版や操作のシミュレーション出力も提供可能です。

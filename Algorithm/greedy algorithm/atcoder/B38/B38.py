# 以下は、先ほどの問題に対して **Python (CPython 3.11.4)** を用いて、**処理時間（1秒以内）とメモリ（1024MiB）制限に配慮**した実装です。

# ---

# ## ✅ 実装方針（Python版）

# * 入力サイズ `N <= 3000` に対して **O(N)** 時間・空間で処理します。
# * 高さ配列を `1` で初期化し、

#   * 左から `'A'` に従って昇順補正
#   * 右から `'B'` に従って降順補正
# * 合計値を返します。

# ---

# ## ✅ Pythonコード（型注釈・コメント付き）

# ```python
import sys
from typing import List

def compute_minimum_total_height(N: int, S: str) -> int:
    """
    各草の高さを条件に従って割り当て、合計の最小値を返す。

    Parameters:
    - N (int): 草の本数（1 ≤ N ≤ 3000）
    - S (str): 長さ N-1 の文字列。'A' または 'B' のみで構成される。

    Returns:
    - int: 最小の草の高さの合計値
    """
    height: List[int] = [1] * N  # 各草の初期高さを1とする

    # 前から順に 'A' 条件を満たすように高さを補正
    for i in range(N - 1):
        if S[i] == 'A' and height[i] >= height[i + 1]:
            height[i + 1] = height[i] + 1

    # 後ろから順に 'B' 条件を満たすように高さを補正
    for i in range(N - 2, -1, -1):
        if S[i] == 'B' and height[i] <= height[i + 1]:
            height[i] = height[i + 1] + 1

    return sum(height)

def main() -> None:
    """
    標準入力を読み取り、問題の解を出力する。
    """
    input_lines = sys.stdin.read().strip().split()
    N: int = int(input_lines[0])
    S: str = input_lines[1]

    result: int = compute_minimum_total_height(N, S)
    print(result)

if __name__ == "__main__":
    main()
# ```

# ---

# ## ✅ 実行方法（例）

# ターミナルなどで以下のように動作します：

# ```bash
# echo -e "7\nAABBBA" | python3 solve.py
# # 出力: 15
# ```

# ---

# ## ✅ 処理性能

# * **時間計算量:** `O(N)`（A処理1回、B処理1回）
# * **空間計算量:** `O(N)`（height配列のみ）

# 入力最大サイズ `N = 3000` でも余裕で 1 秒以内に実行完了します。

# ---

# ## ✅ 補足

# * `sys.stdin.read()` を使うことで、複数行入力を一括読み取り → **高速処理**。
# * 関数化により、他の環境（テストコードなど）からも再利用可能です。

# ---

# 必要であれば、`unittest` によるテストや、例外処理付き強化版なども提供可能です。お気軽にどうぞ。

# では、先ほどの JavaScript 実装を **Python 3.8.10** 用に変換し、
# 型ヒント付き・処理時間計測・メモリ計測を含めた形で提示します。

# ---

# ```python
# Python 3.8.10
import sys
import time
import tracemalloc
from typing import List

def count_ways(n: int, a: int, b: int, c: int) -> int:
    """
    n段の階段を、1回で a 段 or b 段 or c 段 上ることができる場合の方法数を計算する関数。
    
    Parameters
    ----------
    n : int
        階段の段数 (1 <= n <= 30)
    a : int
        1回で上がれる段数その1
    b : int
        1回で上がれる段数その2
    c : int
        1回で上がれる段数その3
    
    Returns
    -------
    int
        n段まで上る方法の総数
    """
    dp: List[int] = [0] * (n + 1)
    dp[0] = 1  # 基底条件: 0段は何もしない1通り

    for i in range(1, n + 1):
        if i - a >= 0:
            dp[i] += dp[i - a]
        if i - b >= 0:
            dp[i] += dp[i - b]
        if i - c >= 0:
            dp[i] += dp[i - c]
    return dp[n]

def main() -> None:
    # 標準入力から値を取得
    data = sys.stdin.read().strip().split()
    n, a, b, c = map(int, data)

    # メモリ計測開始
    tracemalloc.start()
    start_mem_before = tracemalloc.get_traced_memory()[0]
    # 時間計測開始
    start_time = time.perf_counter()

    # 計算
    result: int = count_ways(n, a, b, c)

    # 時間計測終了
    end_time = time.perf_counter()
    # メモリ計測終了
    current_mem, peak_mem = tracemalloc.get_traced_memory()
    tracemalloc.stop()

    # 結果出力（stdout）
    print(result)

    # 計測情報は stderr へ（採点影響なし）
    print(f"処理時間: {(end_time - start_time) * 1000:.3f} ms", file=sys.stderr)
    print(f"使用メモリ: {current_mem - start_mem_before} bytes", file=sys.stderr)
    print(f"ピークメモリ: {peak_mem} bytes", file=sys.stderr)

if __name__ == "__main__":
    main()

# ## 実装の特徴

# 1. **型ヒント** (`n: int, a: int, b: int, c: int -> int`) を明示
# 2. **`tracemalloc`** を利用してメモリ使用量とピークメモリを計測
# 3. **`time.perf_counter()`** で高精度時間計測（ミリ秒表示）
# 4. **DP（動的計画法）** により `O(n)` 時間・`O(n)` メモリ
# 5. **結果は標準出力**、計測情報は **標準エラー出力** で採点に影響を与えない

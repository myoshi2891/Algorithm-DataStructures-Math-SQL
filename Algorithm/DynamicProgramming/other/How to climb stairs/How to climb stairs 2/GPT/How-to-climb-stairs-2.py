# では、先ほどの JavaScript の DP ロジックを **Python 3.8.10** 用に書き直し、
# 型アノテーションを付けて処理時間・メモリ計測も行うバージョンを提示します。

# ---

# ```python
import sys
import time
import tracemalloc
from typing import List

def count_ways(n: int, a: int, b: int) -> int:
    """
    指定された段数の階段を a 段または b 段ずつ上る方法の数を求める。
    
    Parameters
    ----------
    n : int
        階段の段数
    a : int
        1歩で上る段数の選択肢1
    b : int
        1歩で上る段数の選択肢2
    
    Returns
    -------
    int
        n 段に到達する方法の総数
    """
    # dp[i] = i 段目に到達する方法の数
    dp: List[int] = [0] * (n + 1)
    dp[0] = 1  # 0段目は1通り（何もしない）

    for i in range(1, n + 1):
        if i - a >= 0:
            dp[i] += dp[i - a]
        if i - b >= 0:
            dp[i] += dp[i - b]

    return dp[n]


if __name__ == "__main__":
    # 入力取得
    n_str = sys.stdin.read().strip()
    n, a, b = map(int, n_str.split())

    # 計測開始
    start_time = time.perf_counter()
    tracemalloc.start()

    result: int = count_ways(n, a, b)

    # 計測終了
    current, peak = tracemalloc.get_traced_memory()
    end_time = time.perf_counter()

    # 出力（問題の要求通り、答えだけ出力）
    print(result)

    # 計測結果（stderr に出力）
    print(f"処理時間: {(end_time - start_time)*1000:.3f} ms", file=sys.stderr)
    print(f"メモリ使用量: {current / 1024:.3f} KB", file=sys.stderr)
    print(f"ピークメモリ使用量: {peak / 1024:.3f} KB", file=sys.stderr)

    tracemalloc.stop()
# ```

# ---

# ## 実装のポイント

# 1. **型アノテーション**

#    * 関数引数 `n, a, b` は `int`
#    * DP 配列 `dp` は `List[int]`
#    * 戻り値も `int`

# 2. **DPの遷移**

#    ```python
#    dp[i] = dp[i - a] + dp[i - b] （ただし i-a >= 0, i-b >= 0）
#    ```

# 3. **計測**

#    * 時間: `time.perf_counter()` でミリ秒単位
#    * メモリ: `tracemalloc` を使って現在値とピーク値を取得
#      （競技環境でも利用可能な計測方法）

# 4. **出力仕様**

#    * 標準出力: 結果のみ（余計な空白や改行を追加しない）
#    * 計測結果: `stderr` に出力（問題の採点には影響しない）

# ---

# この Python 版にすると、JavaScript 版と同様に **O(n) 時間・O(n) メモリ** で動きますし、
# `n ≤ 40` の制約内なら余裕で高速に計算可能です。

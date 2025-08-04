# 以下は、指定の条件に従った **Python 3.8.10** 用の実装例です。

# * **処理時間**: 各クエリ O(log n)
# * **メモリ使用量**: クエリごとに O(log n) で、最大 Q=20000 でも安全
# * **関数で処理**: 型アノテーションとパラメータ・返却値のコメント付き

# ```python
import sys
from typing import List

def cnt2(i: int) -> int:
    """
    与えられた整数 i を 2 で割れる回数を返す関数

    Parameters
    ----------
    i : int
        1以上の整数

    Returns
    -------
    int
        i を2で割れる回数
    """
    k: int = 0
    while i % 2 == 0:
        k += 1
        i //= 2
    return k

def get_path(n: int, start: int) -> List[int]:
    """
    BITの頂点 start から根(0)までの最短パス上の頂点列を求める関数

    Parameters
    ----------
    n : int
        BITのサイズ (1 ≦ start ≦ n)
    start : int
        開始頂点

    Returns
    -------
    List[int]
        頂点列 (start に近い順、最後は 0)
    """
    path: List[int] = []
    cur: int = start
    while cur > 0:
        path.append(cur)
        k: int = cnt2(cur)
        cur += 1 << k  # 親に移動
        if cur > n:
            cur = 0     # 根に到達
    path.append(0)
    return path

def main() -> None:
    """
    標準入力からクエリを読み取り、各クエリに対して
    BITの頂点から根までのパスを出力する
    """
    input_data: List[int] = list(map(int, sys.stdin.buffer.read().split()))
    q: int = input_data[0]
    idx: int = 1

    output: List[str] = []
    for _ in range(q):
        n: int = input_data[idx]; idx += 1
        start: int = input_data[idx]; idx += 1
        path: List[int] = get_path(n, start)
        output.append(str(len(path)))
        output.append(" ".join(map(str, path)))

    sys.stdout.write("\n".join(output))

if __name__ == "__main__":
    main()
# ```

# ---

# ### 実装のポイント

# 1. **処理時間**

#    * 各クエリは O(log n)
#    * n ≤ 10^9 → log2(n) ≈ 30
#    * Q ≤ 20000 → 最大でも 60 万回程度のループで高速

# 2. **メモリ使用量**

#    * 各パスは O(log n) で保持
#    * 入力全体も int 配列で約 4〜5MB 程度に収まる

# 3. **出力方法**

#    * `sys.stdout.write` で一括出力 → 高速化

# ---

# ご希望であれば、**このBIT構造に対する一点加算 (`add`) と区間和 (`sum`) 実装** を追加した完全版も示せます。

# 追加した版も見たいですか？

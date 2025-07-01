from typing import List
import bisect
import sys

sys.setrecursionlimit(1 << 25)

MOD: int = 10**9 + 7


class FenwickTree:
    def __init__(self, size: int) -> None:
        self.n: int = size
        self.tree: List[int] = [0] * (size + 2)

    def add(self, i: int, x: int) -> None:
        """i番目にxを加算（1-indexed）"""
        i += 1
        while i <= self.n + 1:
            self.tree[i] = (self.tree[i] + x) % MOD
            i += i & -i

    def sum(self, i: int) -> int:
        """[0, i] の総和"""
        i += 1
        res: int = 0
        while i > 0:
            res = (res + self.tree[i]) % MOD
            i -= i & -i
        return res

    def range_sum(self, l: int, r: int) -> int:
        """[l, r] の総和"""
        return (self.sum(r) - self.sum(l - 1)) % MOD


def solve() -> None:
    import sys
    input = sys.stdin.read
    data: List[str] = input().split()

    W: int = int(data[1])
    L: int = int(data[2])
    R: int = int(data[3])
    X: List[int] = list(map(int, data[4:]))

    # 全ての到達可能な位置をリストアップ
    positions: List[int] = [0] + sorted(X) + [W]
    size: int = len(positions)

    dp: List[int] = [0] * size
    dp[0] = 1

    ft: FenwickTree = FenwickTree(size)
    ft.add(0, 1)

    for i in range(1, size):
        cur_pos: int = positions[i]
        left: int = cur_pos - R
        right: int = cur_pos - L

        li: int = bisect.bisect_left(positions, left)
        ri: int = bisect.bisect_right(positions, right) - 1

        if li <= ri:
            dp[i] = ft.range_sum(li, ri)
            ft.add(i, dp[i])

    print(dp[-1])


if __name__ == "__main__":
    solve()

# ✅ 補足：使用型の説明
# 変数 / 関数	型	説明
# MOD	int	剰余演算用の定数
# positions	List[int]	圧縮された全てのジャンプ可能地点
# pos_to_idx	Dict[int, int]	座標からインデックスへの変換
# dp	List[int]	各位置に到達する通り数
# FenwickTree	class	区間和を高速に求める構造
# add(i, x)	(int, int) -> None	i 番目の値に x を加算
# sum(i)	(int) -> int	[0, i] の和
# range_sum(l,r)	(int, int) -> int	[l, r] の和

# 🧠 計算量
# 時間：O(N log N)（座標圧縮、BIT操作）
# 空間：O(N)（BITとDP配列）

# ✅ 補足：使用型の説明
# 変数 / 関数	型	説明
# MOD	int	剰余演算用の定数
# positions	List[int]	圧縮された全てのジャンプ可能地点
# pos_to_idx	Dict[int, int]	座標からインデックスへの変換
# dp	List[int]	各位置に到達する通り数
# FenwickTree	class	区間和を高速に求める構造
# add(i, x)	(int, int) -> None	i 番目の値に x を加算
# sum(i)	(int) -> int	[0, i] の和
# range_sum(l,r)	(int, int) -> int	[l, r] の和

# 🧠 計算量
# 時間：O(N log N)（座標圧縮、BIT操作）
# 空間：O(N)（BITとDP配列）


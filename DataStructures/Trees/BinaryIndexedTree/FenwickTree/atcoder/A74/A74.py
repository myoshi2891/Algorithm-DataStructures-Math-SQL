import sys

sys.setrecursionlimit(1000000)
input = sys.stdin.read
data = list(map(int, input().split()))

N = data[0]
P = [data[i:i+N] for i in range(1, len(data), N)]

row_pos = [0] * (N + 1)
col_pos = [0] * (N + 1)

# 各数字kの現在の位置(row, col)を取得
for i in range(N):
    for j in range(N):
        val = P[i][j]
        if val != 0:
            row_pos[val] = i
            col_pos[val] = j

# k=1〜N に対して現在の行・列の順列を作る
row_perm = [row_pos[k] for k in range(1, N + 1)]
col_perm = [col_pos[k] for k in range(1, N + 1)]

# 転倒数をFenwick Treeで求める
class FenwickTree:
    def __init__(self, size: int):
        self.N = size + 2  # 安全に余裕を持たせる
        self.tree = [0] * self.N

    def update(self, i: int, x: int = 1):
        i += 1
        while i < self.N:
            self.tree[i] += x
            i += i & -i

    def query(self, i: int) -> int:
        i += 1
        res = 0
        while i > 0:
            res += self.tree[i]
            i -= i & -i
        return res

def count_inversions(arr: list[int]) -> int:
    ft = FenwickTree(N)
    inv = 0
    for i in reversed(arr):
        inv += ft.query(i - 1)
        ft.update(i)
    return inv

row_moves = count_inversions(row_perm)
col_moves = count_inversions(col_perm)

print(row_moves + col_moves)

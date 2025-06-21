import sys
sys.setrecursionlimit(1 << 25)  # 再帰制限を緩めておく（Union-Findのfind用）

# 入力読み込み
input = sys.stdin.read
data = input().split()

N = int(data[0])
M = int(data[1])
edges = []

idx = 2
for _ in range(M):
    a = int(data[idx]) - 1
    b = int(data[idx + 1]) - 1
    c = int(data[idx + 2])
    edges.append((c, a, b))
    idx += 3

# 辺を重み順にソート
edges.sort()

# Union-Find構造体
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # 経路圧縮
        return self.parent[x]

    def union(self, x, y):
        rx = self.find(x)
        ry = self.find(y)
        if rx == ry:
            return False
        if self.rank[rx] < self.rank[ry]:
            self.parent[rx] = ry
        else:
            self.parent[ry] = rx
            if self.rank[rx] == self.rank[ry]:
                self.rank[rx] += 1
        return True

# クラスカル法でMST構築
uf = UnionFind(N)
total_cost = 0
edges_used = 0

for cost, u, v in edges:
    if uf.union(u, v):
        total_cost += cost
        edges_used += 1
        if edges_used == N - 1:
            break

print(total_cost)

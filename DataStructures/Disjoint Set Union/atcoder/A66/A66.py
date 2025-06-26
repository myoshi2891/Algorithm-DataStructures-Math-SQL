import sys
sys.setrecursionlimit(1 << 25)
input = sys.stdin.readline

class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n + 1))  # 1-indexed
        self.rank = [0] * (n + 1)

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # 経路圧縮
        return self.parent[x]

    def union(self, x, y):
        rx = self.find(x)
        ry = self.find(y)
        if rx == ry:
            return
        if self.rank[rx] < self.rank[ry]:
            self.parent[rx] = ry
        else:
            self.parent[ry] = rx
            if self.rank[rx] == self.rank[ry]:
                self.rank[rx] += 1

    def same(self, x, y):
        return self.find(x) == self.find(y)

def main():
    N, Q = map(int, input().split())
    uf = UnionFind(N)
    res = []
    for _ in range(Q):
        t, u, v = map(int, input().split())
        if t == 1:
            uf.union(u, v)
        else:
            res.append("Yes" if uf.same(u, v) else "No")
    print('\n'.join(res))

if __name__ == "__main__":
    main()

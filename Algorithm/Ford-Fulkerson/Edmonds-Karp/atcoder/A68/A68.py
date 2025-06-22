from collections import deque
import sys

sys.setrecursionlimit(1000000)

# 入力読み込み
input = sys.stdin.read
lines = input().splitlines()
N, M = map(int, lines[0].split())

# グラフ構築
capacity = [[0] * (N + 1) for _ in range(N + 1)]
graph = [[] for _ in range(N + 1)]

for i in range(1, M + 1):
    a, b, c = map(int, lines[i].split())
    capacity[a][b] += c  # 同じ辺が複数あれば合算
    graph[a].append(b)
    graph[b].append(a)  # 逆辺（残余グラフ）も必要

def bfs(s, t, parent):
    visited = [False] * (N + 1)
    queue = deque([s])
    visited[s] = True

    while queue:
        u = queue.popleft()
        for v in graph[u]:
            if not visited[v] and capacity[u][v] > 0:
                parent[v] = u
                visited[v] = True
                if v == t:
                    return True
                queue.append(v)
    return False

def edmonds_karp(s, t):
    flow = 0
    parent = [-1] * (N + 1)

    while bfs(s, t, parent):
        # 最小残余容量を探す
        path_flow = float('inf')
        v = t
        while v != s:
            u = parent[v]
            path_flow = min(path_flow, capacity[u][v])
            v = u

        # 残余容量更新（フロー反映）
        v = t
        while v != s:
            u = parent[v]
            capacity[u][v] -= path_flow
            capacity[v][u] += path_flow
            v = u

        flow += path_flow

    return flow

# 実行：1 から N へ
print(edmonds_karp(1, N))

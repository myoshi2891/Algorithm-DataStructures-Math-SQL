import sys
from collections import deque

sys.setrecursionlimit(1 << 25)
input = sys.stdin.readline

# 入力
N, M = map(int, input().split())
graph = [[] for _ in range(N + 1)]

for _ in range(M):
    a, b = map(int, input().split())
    graph[a].append(b)
    graph[b].append(a)  # 無向グラフ

# BFS
dist = [-1] * (N + 1)
dist[1] = 0
queue = deque([1])

while queue:
    current = queue.popleft()
    for neighbor in graph[current]:
        if dist[neighbor] == -1:
            dist[neighbor] = dist[current] + 1
            queue.append(neighbor)

# 出力
for i in range(1, N + 1):
    print(dist[i])

import sys
import heapq

sys.setrecursionlimit(1 << 25)
input = sys.stdin.readline

N, M = map(int, input().split())

graph = [[] for _ in range(N)]

for _ in range(M):
    a, b, c = map(int, input().split())
    a -= 1
    b -= 1
    graph[a].append((b, c))
    graph[b].append((a, c))  # 無向グラフ

# ダイクストラ
INF = float('inf')
dist = [INF] * N
dist[0] = 0

hq = [(0, 0)]  # (距離, 頂点)

while hq:
    d, u = heapq.heappop(hq)
    if dist[u] < d:
        continue
    for v, cost in graph[u]:
        if dist[v] > d + cost:
            dist[v] = d + cost
            heapq.heappush(hq, (dist[v], v))

for d in dist:
    print(d if d != INF else -1)

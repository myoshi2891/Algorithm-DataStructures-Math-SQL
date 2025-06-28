import sys
import heapq
from typing import List, Tuple

input = sys.stdin.readline

# 入力
N, M = map(int, input().split())
graph: List[List[Tuple[int, int, int]]] = [[] for _ in range(N + 1)]

for _ in range(M):
    a, b, c, d = map(int, input().split())
    graph[a].append((b, c, d))  # (to, cost, tree)
    graph[b].append((a, c, d))  # 双方向

# 初期化
dist = [float('inf')] * (N + 1)
trees = [-float('inf')] * (N + 1)
dist[1] = 0
trees[1] = 0

# ヒープ（優先度付きキュー） [cost, -treeCount, node]
heap: List[Tuple[int, int, int]] = []
heapq.heappush(heap, (0, 0, 1))  # (距離, -木の本数, ノード)

while heap:
    cost, neg_tree, u = heapq.heappop(heap)
    tree = -neg_tree

    if cost > dist[u]:
        continue
    if cost == dist[u] and tree < trees[u]:
        continue

    for v, c, t in graph[u]:
        new_cost = cost + c
        new_tree = tree + t
        if (new_cost < dist[v]) or (new_cost == dist[v] and new_tree > trees[v]):
            dist[v] = new_cost
            trees[v] = new_tree
            heapq.heappush(heap, (new_cost, -new_tree, v))

# 出力
print(dist[N], trees[N])
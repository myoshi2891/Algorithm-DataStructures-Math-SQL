import sys
sys.setrecursionlimit(10**6)

# 入力読み取り
N, M = map(int, sys.stdin.readline().split())
graph = [[] for _ in range(N + 1)]

# 辺情報を読み取り、隣接リストを構築
for _ in range(M):
    a, b = map(int, sys.stdin.readline().split())
    graph[a].append(b)
    graph[b].append(a)

# 訪問済み記録
visited = [False] * (N + 1)

# 深さ優先探索（DFS）
def dfs(node):
    visited[node] = True
    for neighbor in graph[node]:
        if not visited[neighbor]:
            dfs(neighbor)

# 頂点1から探索開始
dfs(1)

# すべての頂点が訪問済みか判定
if all(visited[1:]):
    print("The graph is connected.")
else:
    print("The graph is not connected.")

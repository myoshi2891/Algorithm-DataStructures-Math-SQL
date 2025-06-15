import sys
input = sys.stdin.readline

# 入力の読み取り
N, M = map(int, input().split())

# 隣接リストの初期化（1-based index）
graph = [[] for _ in range(N + 1)]

# 辺情報を追加
for _ in range(M):
    a, b = map(int, input().split())
    graph[a].append(b)
    graph[b].append(a)

# 出力
for i in range(1, N + 1):
    print(f"{i}: {{{', '.join(map(str, graph[i]))}}}")

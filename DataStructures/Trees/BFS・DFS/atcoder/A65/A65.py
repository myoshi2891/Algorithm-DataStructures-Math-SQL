import sys
sys.setrecursionlimit(10**7)  # 再帰の上限を引き上げ（最大10万まで対応）

# 入力
N = int(sys.stdin.readline())
A = list(map(int, sys.stdin.read().split()))

# 木構造（上司 → 部下）
tree = [[] for _ in range(N + 1)]  # 1-indexed

for i, parent in enumerate(A, start=2):
    tree[parent].append(i)

# 各社員の部下数（直属＋間接）
subordinates = [0] * (N + 1)

def dfs(node):
    count = 0
    for child in tree[node]:
        count += 1 + dfs(child)
    subordinates[node] = count
    return count

dfs(1)  # 社長からスタート

# 結果出力（1〜N）
print(' '.join(map(str, subordinates[1:])))

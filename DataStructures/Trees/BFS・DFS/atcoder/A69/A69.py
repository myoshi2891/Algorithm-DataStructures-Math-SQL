import sys
sys.setrecursionlimit(10000)

def main():
    input = sys.stdin.read
    data = input().splitlines()
    
    N = int(data[0])
    C = data[1:]

    adj = [[] for _ in range(N)]  # 生徒 i が希望する席のリスト
    for i in range(N):
        for j in range(N):
            if C[i][j] == '#':
                adj[i].append(j)

    match_to = [-1] * N  # 席 j に割り当てられている生徒番号（-1 は空き）
    
    def dfs(u: int, visited: list[bool]) -> bool:
        for v in adj[u]:
            if visited[v]:
                continue
            visited[v] = True
            if match_to[v] == -1 or dfs(match_to[v], visited):
                match_to[v] = u
                return True
        return False

    result = 0
    for i in range(N):
        visited = [False] * N
        if dfs(i, visited):
            result += 1

    print(result)

if __name__ == "__main__":
    main()

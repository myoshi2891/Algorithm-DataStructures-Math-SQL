import sys
from collections import deque

def main():
    input = sys.stdin.read
    data = input().split()
    
    idx = 0
    N = int(data[idx])
    idx += 1
    M = int(data[idx])
    idx += 1

    A = list(map(int, data[idx:idx + N]))
    idx += N

    # 初期状態をビットで表現
    start_state = 0
    for i in range(N):
        if A[i] == 1:
            start_state |= (1 << i)

    # 目標状態（すべてON） = 2^N - 1
    goal_state = (1 << N) - 1

    # 各操作をビットマスクで記録
    ops = []
    for _ in range(M):
        x = int(data[idx]) - 1
        y = int(data[idx + 1]) - 1
        z = int(data[idx + 2]) - 1
        idx += 3
        mask = (1 << x) | (1 << y) | (1 << z)
        ops.append(mask)

    # BFS
    visited = [False] * (1 << N)
    queue = deque()
    queue.append((start_state, 0))
    visited[start_state] = True

    while queue:
        state, steps = queue.popleft()

        if state == goal_state:
            print(steps)
            return

        for op in ops:
            next_state = state ^ op
            if not visited[next_state]:
                visited[next_state] = True
                queue.append((next_state, steps + 1))

    # 到達不可能な場合
    print(-1)

if __name__ == "__main__":
    main()

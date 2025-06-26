import sys
from collections import deque

input = sys.stdin.readline  # 高速入力

Q = int(input())
queue = deque()
output = []

for _ in range(Q):
    parts = input().split()
    if parts[0] == '1':
        queue.append(parts[1])     # 末尾に追加
    elif parts[0] == '2':
        output.append(queue[0])    # 先頭を参照
    elif parts[0] == '3':
        queue.popleft()            # 先頭を削除

print('\n'.join(output))

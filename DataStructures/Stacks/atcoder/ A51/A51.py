import sys

input = sys.stdin.readline

Q = int(input())
stack = []
output = []

for _ in range(Q):
    query = input().split()
    if query[0] == '1':
        stack.append(query[1])
    elif query[0] == '2':
        output.append(stack[-1])
    elif query[0] == '3':
        stack.pop()

print('\n'.join(output))

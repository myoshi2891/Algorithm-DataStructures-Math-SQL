import sys

input = sys.stdin.readline

Q = int(input())
scores = {}
output = []

for _ in range(Q):
    query = input().split()
    if query[0] == '1':
        # クエリ1: 登録
        name = query[1]
        score = int(query[2])
        scores[name] = score
    elif query[0] == '2':
        # クエリ2: 問い合わせ
        name = query[1]
        output.append(str(scores[name]))

# 出力
print('\n'.join(output))

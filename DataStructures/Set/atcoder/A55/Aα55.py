import sys
import bisect

input = sys.stdin.read
data = input().splitlines()

Q = int(data[0])
cards = []
results = []

for i in range(1, Q + 1):
    line = data[i].split()
    t, x = int(line[0]), int(line[1])

    if t == 1:
        bisect.insort(cards, x)  # O(log N) 挿入
    elif t == 2:
        index = bisect.bisect_left(cards, x)
        if index < len(cards) and cards[index] == x:
            cards.pop(index)  # O(N) だが平均的には高速
    elif t == 3:
        index = bisect.bisect_left(cards, x)  # x 以上の最小の index
        if index < len(cards):
            results.append(str(cards[index]))
        else:
            results.append("-1")

print("\n".join(results))

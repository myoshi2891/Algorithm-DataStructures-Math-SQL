import sys

input = sys.stdin.read
data = input().split()

T = int(data[0])
triplets = [tuple(map(lambda x: int(x) - 1, data[i:i+3])) for i in range(1, len(data), 3)]

X = [0] * 20
zero_count = 20
result = []

for p, q, r in triplets:
    indices = [p, q, r]
    gain_a = 0
    gain_b = 0

    # 操作A (+1)
    for idx in indices:
        if X[idx] == 0:
            gain_a -= 1
        if X[idx] + 1 == 0:
            gain_a += 1

    # 操作B (-1)
    for idx in indices:
        if X[idx] == 0:
            gain_b -= 1
        if X[idx] - 1 == 0:
            gain_b += 1

    if zero_count + gain_a >= zero_count + gain_b:
        # A操作を実行
        result.append("A")
        for idx in indices:
            if X[idx] == 0:
                zero_count -= 1
            X[idx] += 1
            if X[idx] == 0:
                zero_count += 1
    else:
        # B操作を実行
        result.append("B")
        for idx in indices:
            if X[idx] == 0:
                zero_count -= 1
            X[idx] -= 1
            if X[idx] == 0:
                zero_count += 1

print("\n".join(result))

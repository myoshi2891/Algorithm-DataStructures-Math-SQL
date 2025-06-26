N = int(input().strip())
a = 2  # aは2で固定

# Nが1以下またはa >= Nの場合は素数ではない
if N <= 1 or a >= N:
    print("NO")
    exit()

# Nがaで割り切れる場合は素数ではない
if N % a == 0 and N != a:
    print("NO")
    exit()

# フェルマーテストのべき乗計算（繰り返し掛け算）
fermat = 1
for _ in range(N - 1):
    fermat = (fermat * a) % N

# フェルマーテストの判定
if fermat == 1:
    print("YES")
else:
    print("NO")

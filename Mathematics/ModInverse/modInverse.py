def extgcd(a: int, b: int) -> tuple[int, int, int]:
    if b != 0:
        c, y, x = extgcd(b, a % b)
        y -= (a // b) * x
        return c, x, y
    return a, 1, 0


m, a = map(int, input().split())
c, x, y = extgcd(a, m)
ans = (x + m) % m
print(ans)
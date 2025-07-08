from typing import Tuple

def extgcd(a: int, b: int) -> Tuple[int, int, int]:
    if b != 0:
        c, y, x = extgcd(b, a % b)
        y -= (a // b) * x
        return c, x, y
    return a, 1, 0

def modpow(a: int, b: int, m: int) -> int:
    ans = 1
    while 0 < b:
        if b & 1 == 1:
            ans = (ans * a) % m
        a = (a * a) % m
        b >>= 1
    return ans

def divisor(n: int) -> Tuple[int, int]:
    for i in range(2, int(n ** (1 / 2))):
        if n % i == 0:
            p = i
            q = n // i
            return p, q
    raise ValueError("No divisors found")

n, e, E = map(int, input().split())
p, q = divisor(n)
n_prime = (p - 1) * (q - 1)

c, x, y = extgcd(e, n_prime)
d = (x + n_prime) % n_prime
message = modpow(E, d, n)  # Renamed from M to message

letter = [0] * 4
for i in range(4):
    for j in range(7):
        if message % 2 == 1:
            letter[i] += pow(2, j)
        message //= 2

output = ""
for i in range(4):
    if letter[3 - i] != 0:
        output += chr(letter[3 - i])
print(output)
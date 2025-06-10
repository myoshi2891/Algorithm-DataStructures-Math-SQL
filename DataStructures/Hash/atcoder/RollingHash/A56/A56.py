import sys
input = sys.stdin.read

MOD = 10**9 + 7
BASE = 31

def main():
    data = input().split()
    idx = 0

    N = int(data[idx]); idx += 1
    Q = int(data[idx]); idx += 1
    S = data[idx]; idx += 1

    # 前処理：prefix hashとbaseの累乗を計算
    hash_vals = [0] * (N + 1)
    power = [1] * (N + 1)

    for i in range(N):
        code = ord(S[i]) - ord('a') + 1
        hash_vals[i + 1] = (hash_vals[i] * BASE + code) % MOD
        power[i + 1] = (power[i] * BASE) % MOD

    def get_hash(l, r):
        # l, r は1-indexed
        return (hash_vals[r] - hash_vals[l - 1] * power[r - l + 1] % MOD + MOD) % MOD

    output = []
    for _ in range(Q):
        a = int(data[idx]); idx += 1
        b = int(data[idx]); idx += 1
        c = int(data[idx]); idx += 1
        d = int(data[idx]); idx += 1

        if get_hash(a, b) == get_hash(c, d):
            output.append("Yes")
        else:
            output.append("No")

    print("\n".join(output))

main()

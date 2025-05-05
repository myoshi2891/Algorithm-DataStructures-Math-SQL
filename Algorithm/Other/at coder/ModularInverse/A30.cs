using System;
using System.Numerics;

class Program
{
    const int MOD = 1000000007;
    const int MAX = 100000;

    static long[] fac = new long[MAX + 1];
    static long[] invFac = new long[MAX + 1];

    static void Main()
    {
        // 前処理（階乗と逆元の計算）
        PrecomputeFactorials();

        // 入力
        var input = Console.ReadLine().Split();
        int n = int.Parse(input[0]);
        int r = int.Parse(input[1]);

        // nCr = n! / (r! * (n - r)!) % MOD
        long result = fac[n];
        result = result * invFac[r] % MOD;
        result = result * invFac[n - r] % MOD;

        Console.WriteLine(result);
    }

    // 階乗と逆元階乗の前計算
    static void PrecomputeFactorials()
    {
        fac[0] = 1;
        for (int i = 1; i <= MAX; i++)
        {
            fac[i] = fac[i - 1] * i % MOD;
        }

        invFac[MAX] = ModPow(fac[MAX], MOD - 2); // フェルマーの小定理による逆元
        for (int i = MAX - 1; i >= 0; i--)
        {
            invFac[i] = invFac[i + 1] * (i + 1) % MOD;
        }
    }

    // a^b % MOD を高速に計算
    static long ModPow(long a, int b)
    {
        long result = 1;
        a %= MOD;

        while (b > 0)
        {
            if ((b & 1) == 1) result = result * a % MOD;
            a = a * a % MOD;
            b >>= 1;
        }

        return result;
    }
}

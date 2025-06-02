<?php
define("MOD", 1000000007);
define("MAX", 100000);

$fac = array_fill(0, MAX + 1, 1);
$invFac = array_fill(0, MAX + 1, 1);

// 標準入力から取得
fscanf(STDIN, "%d %d", $n, $r);

// 階乗と逆元を前計算
for ($i = 1; $i <= MAX; $i++) {
    $fac[$i] = ($fac[$i - 1] * $i) % MOD;
}
$invFac[MAX] = modPow($fac[MAX], MOD - 2);
for ($i = MAX - 1; $i >= 0; $i--) {
    $invFac[$i] = ($invFac[$i + 1] * ($i + 1)) % MOD;
}

// nCr = fac[n] * invFac[r] * invFac[n - r] % MOD
$result = $fac[$n];
$result = ($result * $invFac[$r]) % MOD;
$result = ($result * $invFac[$n - $r]) % MOD;

echo $result . PHP_EOL;

// a^b % MOD を計算（繰り返し二乗法）
function modPow($a, $b)
{
    $result = 1;
    $a = $a % MOD;

    while ($b > 0) {
        if ($b % 2 == 1) {
            $result = ($result * $a) % MOD;
        }
        $a = ($a * $a) % MOD;
        $b = intdiv($b, 2);
    }

    return $result;
}
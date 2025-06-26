<?php
function is_prime_miller_rabin($n)
{
    if ($n < 2) return false;
    if ($n === 2 || $n === 3) return true;
    if ($n % 2 === 0) return false;

    $d = $n - 1;
    $s = 0;
    while ($d % 2 === 0) {
        $d /= 2;
        $s++;
    }

    // 任意の基数 a（小さい値で十分）
    $bases = [2, 3, 5];
    foreach ($bases as $a) {
        if ($a >= $n) continue;

        $x = mod_pow($a, $d, $n);
        if ($x == 1 || $x == $n - 1) continue;

        $is_composite = true;
        for ($r = 1; $r < $s; $r++) {
            $x = mod_pow($x, 2, $n);
            if ($x == $n - 1) {
                $is_composite = false;
                break;
            }
        }

        if ($is_composite) return false;
    }

    return true;
}

// 繰り返し二乗法
function mod_pow($base, $exp, $mod)
{
    $result = 1;
    while ($exp > 0) {
        if ($exp % 2 === 1) {
            $result = ($result * $base) % $mod;
        }
        $base = ($base * $base) % $mod;
        $exp = intdiv($exp, 2);
    }
    return $result;
}

// 入力処理
$Q = (int)trim(fgets(STDIN));
for ($i = 0; $i < $Q; $i++) {
    $x = (int)trim(fgets(STDIN));
    echo is_prime_miller_rabin($x) ? "Yes\n" : "No\n";
}
<?php
fscanf(STDIN, "%d %d", $N, $Q);
$S = trim(fgets(STDIN));

define('MOD', 1000000007);
define('BASE', 31);

// プレフィックスハッシュと累乗を初期化
$hash = array_fill(0, $N + 1, 0);
$power = array_fill(0, $N + 1, 1);

// ハッシュと累乗の前計算
for ($i = 0; $i < $N; $i++) {
    $code = ord($S[$i]) - ord('a') + 1;
    $hash[$i + 1] = ($hash[$i] * BASE + $code) % MOD;
    $power[$i + 1] = ($power[$i] * BASE) % MOD;
}

// ハッシュ取得関数（1-indexed）
function getHash($l, $r, $hash, $power)
{
    $val = ($hash[$r] - ($hash[$l - 1] * $power[$r - $l + 1]) % MOD + MOD) % MOD;
    return $val;
}

// クエリ処理
for ($i = 0; $i < $Q; $i++) {
    fscanf(STDIN, "%d %d %d %d", $a, $b, $c, $d);
    $h1 = getHash($a, $b, $hash, $power);
    $h2 = getHash($c, $d, $hash, $power);
    echo ($h1 === $h2 ? "Yes" : "No") . "\n";
}
<?php

function modPow($a, $b, $mod) {
    $result = '1';
    $a = bcmod($a, $mod);

    while (bccomp($b, '0') > 0) {
        if (bcmod($b, '2') == '1') {
            $result = bcmod(bcmul($result, $a), $mod);
        }
        $a = bcmod(bcmul($a, $a), $mod);
        $b = bcdiv($b, '2', 0); // 0桁で整数除算
    }

    return $result;
}

// 入力読み取り
fscanf(STDIN, "%s %s", $a, $b);
$mod = '1000000007';

echo modPow($a, $b, $mod) . PHP_EOL;
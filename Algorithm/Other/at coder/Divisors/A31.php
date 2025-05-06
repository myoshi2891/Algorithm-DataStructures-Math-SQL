<?php
// 標準入力から数値を読み取る
$input = trim(fgets(STDIN));
$N = gmp_init($input); // GMPを使うことで大きな数値も扱える

// 各数の倍数の個数を求める
$countDivBy = function($x) use ($N) {
    return gmp_div_q($N, gmp_init($x));
};

// Inclusion-Exclusion Principle を適用
$count = gmp_add($countDivBy(3), $countDivBy(5));
$count = gmp_sub($count, $countDivBy(15));

// 結果を出力
echo gmp_strval($count) . PHP_EOL;
?>
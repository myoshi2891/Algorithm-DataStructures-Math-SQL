<?php
fscanf(STDIN, "%d %d", $N, $K);
$A = array_map('intval', explode(" ", trim(fgets(STDIN))));

$left = 1;
$right = 1000000000;

while ($left < $right) {
    $mid = intdiv($left + $right, 2);
    $sum = 0;

    foreach ($A as $a) {
        $sum += intdiv($mid, $a);
        if ($sum >= $K) {
            break;
        }
    }

    if ($sum >= $K) {
        $right = $mid;
    } else {
        $left = $mid + 1;
    }
}

echo $left . "\n";

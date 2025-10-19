<?php
fscanf(STDIN, "%d %d", $N, $L);

$maxTime = 0;

for ($i = 0; $i < $N; $i++) {
    fscanf(STDIN, "%d %s", $A, $B);

    if ($B === 'E') {
        $time = $L - $A;
    } else {
        $time = $A;
    }

    if ($time > $maxTime) {
        $maxTime = $time;
    }
}

echo $maxTime . PHP_EOL;
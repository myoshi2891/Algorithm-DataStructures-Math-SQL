<?php

// 標準入力を読み込む
[$N, $M] = array_map('intval', explode(' ', trim(fgets(STDIN))));
$A = array_map('intval', explode(' ', trim(fgets(STDIN))));

// 初期状態をビットで表現
$startState = 0;
for ($i = 0; $i < $N; $i++) {
    if ($A[$i] === 1) {
        $startState |= (1 << $i);
    }
}

// 目標状態（すべてON）
$goalState = (1 << $N) - 1;

// 各操作をビットマスクで格納
$ops = [];
for ($i = 0; $i < $M; $i++) {
    [$x, $y, $z] = array_map(fn($n) => (int)$n - 1, explode(' ', trim(fgets(STDIN))));
    $mask = (1 << $x) | (1 << $y) | (1 << $z);
    $ops[] = $mask;
}

// 幅優先探索（BFS）
$visited = array_fill(0, 1 << $N, false);
$queue = [[$startState, 0]];
$visited[$startState] = true;

while (!empty($queue)) {
    [$state, $steps] = array_shift($queue);

    if ($state === $goalState) {
        echo $steps . PHP_EOL;
        exit;
    }

    foreach ($ops as $op) {
        $nextState = $state ^ $op;
        if (!$visited[$nextState]) {
            $visited[$nextState] = true;
            $queue[] = [$nextState, $steps + 1];
        }
    }
}

// 到達不可能
echo -1 . PHP_EOL;
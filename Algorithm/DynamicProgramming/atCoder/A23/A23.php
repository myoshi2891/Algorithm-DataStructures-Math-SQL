<?php

fscanf(STDIN, "%d %d", $N, $M);

// クーポンごとのビットマスクを作成
$coupons = [];
for ($i = 0; $i < $M; $i++) {
    $line = trim(fgets(STDIN));
    $items = array_map('intval', explode(" ", $line));
    $bit = 0;
    for ($j = 0; $j < $N; $j++) {
        if ($items[$j] == 1) {
            $bit |= (1 << $j);
        }
    }
    $coupons[] = $bit;
}

$goal = (1 << $N) - 1; // すべての品目が揃った状態
$visited = array_fill(0, 1 << $N, false);
$queue = new SplQueue();
$queue->enqueue([0, 0]); // [現在の状態, 使用したクーポン数]
$visited[0] = true;

while (!$queue->isEmpty()) {
    list($state, $count) = $queue->dequeue();

    if ($state === $goal) {
        echo $count . PHP_EOL;
        exit;
    }

    foreach ($coupons as $coupon) {
        $next = $state | $coupon;
        if (!$visited[$next]) {
            $visited[$next] = true;
            $queue->enqueue([$next, $count + 1]);
        }
    }
}

echo -1 . PHP_EOL;
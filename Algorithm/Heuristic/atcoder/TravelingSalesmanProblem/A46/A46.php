<?php

fscanf(STDIN, "%d", $n);
$cities = [];

for ($i = 0; $i < $n; $i++) {
    fscanf(STDIN, "%d %d", $x, $y);
    $cities[] = [$x, $y];
}

// 都市間距離（ユークリッド距離の2乗）
function dist($a, $b, $cities) {
    $dx = $cities[$a][0] - $cities[$b][0];
    $dy = $cities[$a][1] - $cities[$b][1];
    return $dx * $dx + $dy * $dy;
}

// 最近傍法による初期ツアー生成
function greedyTour($n, $cities) {
    $visited = array_fill(0, $n, false);
    $tour = [0];
    $visited[0] = true;

    while (count($tour) < $n) {
        $last = end($tour);
        $next = -1;
        $minDist = PHP_INT_MAX;

        for ($i = 0; $i < $n; $i++) {
            if (!$visited[$i]) {
                $d = dist($last, $i, $cities);
                if ($d < $minDist) {
                    $minDist = $d;
                    $next = $i;
                }
            }
        }
        $tour[] = $next;
        $visited[$next] = true;
    }
    return $tour;
}

// 2-opt 法
function twoOpt($tour, $cities) {
    $n = count($tour);
    $improved = true;

    while ($improved) {
        $improved = false;

        for ($i = 1; $i < $n - 1; $i++) {
            for ($j = $i + 1; $j < $n; $j++) {
                $a = $tour[$i - 1];
                $b = $tour[$i];
                $c = $tour[$j];
                $d = $tour[($j + 1) % $n];

                $before = dist($a, $b, $cities) + dist($c, $d, $cities);
                $after  = dist($a, $c, $cities) + dist($b, $d, $cities);

                if ($after < $before) {
                    $tour = array_merge(
                        array_slice($tour, 0, $i),
                        array_reverse(array_slice($tour, $i, $j - $i + 1)),
                        array_slice($tour, $j + 1)
                    );
                    $improved = true;
                }
            }
        }
    }

    return $tour;
}

// 実行
$tour = greedyTour($n, $cities);
$tour = twoOpt($tour, $cities);

// 出力（1-indexed）
foreach ($tour as $t) {
    echo ($t + 1) . "\n";
}
echo ($tour[0] + 1) . "\n";
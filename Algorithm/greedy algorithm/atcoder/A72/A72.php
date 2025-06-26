<?php

list($H, $W, $K) = array_map('intval', explode(' ', trim(fgets(STDIN))));
$grid = [];
for ($i = 0; $i < $H; $i++) {
    $grid[] = str_split(trim(fgets(STDIN)));
}

$maxBlack = 0;

for ($bit = 0; $bit < (1 << $H); $bit++) {
    $paintedRows = [];
    for ($i = 0; $i < $H; $i++) {
        if (($bit >> $i) & 1) {
            $paintedRows[] = $i;
        }
    }

    $rowCount = count($paintedRows);
    if ($rowCount > $K) continue;

    // グリッドのコピー
    $painted = [];
    foreach ($grid as $row) {
        $painted[] = $row;
    }

    // 行を黒く塗る
    foreach ($paintedRows as $i) {
        for ($j = 0; $j < $W; $j++) {
            $painted[$i][$j] = '#';
        }
    }

    // 各列の黒マス数をカウント
    $blackCount = array_fill(0, $W, 0);
    for ($j = 0; $j < $W; $j++) {
        for ($i = 0; $i < $H; $i++) {
            if ($painted[$i][$j] === '#') {
                $blackCount[$j]++;
            }
        }
    }

    // 残りの操作回数で列を貪欲に塗る
    $gain = [];
    for ($j = 0; $j < $W; $j++) {
        $gain[] = ['gain' => $H - $blackCount[$j], 'col' => $j];
    }

    usort($gain, function ($a, $b) {
        return $b['gain'] <=> $a['gain'];
    });

    $columnsToPaint = [];
    $remainingOps = $K - $rowCount;
    for ($k = 0; $k < min($remainingOps, $W); $k++) {
        $columnsToPaint[$gain[$k]['col']] = true;
    }

    // 黒マスを数える
    $totalBlack = 0;
    for ($i = 0; $i < $H; $i++) {
        for ($j = 0; $j < $W; $j++) {
            if ($painted[$i][$j] === '#' || isset($columnsToPaint[$j])) {
                $totalBlack++;
            }
        }
    }

    $maxBlack = max($maxBlack, $totalBlack);
}

echo $maxBlack . "\n";
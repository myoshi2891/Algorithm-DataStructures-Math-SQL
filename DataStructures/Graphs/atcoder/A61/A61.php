<?php

// 入力の最初の行を読み込んで N, M を取得
[$N, $M] = array_map('intval', explode(' ', trim(fgets(STDIN))));

// 隣接リスト（1-based index）
$graph = array_fill(1, $N, []);

// M 本の辺を読み込む
for ($i = 0; $i < $M; $i++) {
    [$a, $b] = array_map('intval', explode(' ', trim(fgets(STDIN))));
    $graph[$a][] = $b;
    $graph[$b][] = $a; // 無向グラフなので逆も追加
}

// 出力
for ($i = 1; $i <= $N; $i++) {
    echo "$i: {" . implode(', ', $graph[$i]) . "}\n";
}
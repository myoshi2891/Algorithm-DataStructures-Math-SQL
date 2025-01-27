<?php
// 入力の読み取り
fscanf(STDIN, "%d %d", $H, $W);

// グリッドの読み込み
$grid = [];
for ($i = 0; $i < $H; $i++) {
  $grid[$i] = array_map('intval', explode(" ", trim(fgets(STDIN))));
}

// 累積和テーブルの構築
// 配列Sを初期化（1-based indexで扱うため、[0][...]は0で埋める）
$S = array_fill(0, $H + 1, array_fill(0, $W + 1, 0));

// 累積和を計算
for ($i = 1; $i <= $H; $i++) {
  for ($j = 1; $j <= $W; $j++) {
    $S[$i][$j] = $grid[$i - 1][$j - 1]
      + $S[$i - 1][$j]
      + $S[$i][$j - 1]
      - $S[$i - 1][$j - 1];
  }
}

// クエリの処理
fscanf(STDIN, "%d", $Q);
$results = [];
for ($q = 0; $q < $Q; $q++) {
  fscanf(STDIN, "%d %d %d %d", $A, $B, $C, $D);
  // 累積和を使って領域の総和を計算
  $sum = $S[$C][$D]
    - $S[$A - 1][$D]
    - $S[$C][$B - 1]
    + $S[$A - 1][$B - 1];
  $results[] = $sum;
}

// 結果を出力
foreach ($results as $result) {
  echo $result . PHP_EOL;
}

<?php
fscanf(STDIN, "%d %d", $N, $S);
$A = array_map('intval', explode(" ", trim(fgets(STDIN))));

// DP配列
$dp = array_fill(0, $S + 1, false);
$dp[0] = true;

foreach ($A as $a) {
    for ($j = $S; $j >= $a; $j--) {
        if ($dp[$j - $a]) {
            $dp[$j] = true;
        }
    }
}

// 結果の出力
echo $dp[$S] ? "Yes\n" : "No\n";
<?php

function lower_bound($array, $value)
{
	$low = 0;
	$high = count($array);
	while ($low < $high) {
		$mid = intdiv($low + $high, 2);
		if ($array[$mid] < $value) {
			$low = $mid + 1;
		} else {
			$high = $mid;
		}
	}
	return $low;
}

// 入力処理
$lines = explode("\n", trim(file_get_contents("php://stdin")));
$N = intval($lines[0]);
$A = array_map('intval', explode(" ", $lines[1]));

$dp = [];         // LISの末尾最小値配列
$dpIndex = [];    // dp[i] のときの A のインデックス
$prevIndex = array_fill(0, $N, -1);  // 復元用

for ($i = 0; $i < $N; $i++) {
	$a = $A[$i];
	$pos = lower_bound($dp, $a);

	if ($pos == count($dp)) {
		$dp[] = $a;
		$dpIndex[] = $i;
	} else {
		$dp[$pos] = $a;
		$dpIndex[$pos] = $i;
	}

	if ($pos > 0) {
		$prevIndex[$i] = $dpIndex[$pos - 1];
	}
}

// 復元処理
$lis = [];
$idx = $dpIndex[count($dp) - 1];

while ($idx != -1) {
	array_push($lis, $A[$idx]);
	$idx = $prevIndex[$idx];
}
$lis = array_reverse($lis);

// 出力
echo count($dp) . "\n";
echo implode(" ", $lis) . "\n";
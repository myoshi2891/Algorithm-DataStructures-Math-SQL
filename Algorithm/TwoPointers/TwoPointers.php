<?php
fscanf(STDIN, "%d %d", $N, $K);
$A = array_map('intval', explode(" ", trim(fgets(STDIN))));

$count = 0;
$j = 0; // 右端のインデックス

for ($i = 0; $i < $N; $i++) {
	while ($j < $N && $A[$j] - $A[$i] <= $K) {
		$j++;
	}
	$count += ($j - $i - 1); // i < j なので j - i - 1 通りのペアが作れる
}

echo $count . PHP_EOL;

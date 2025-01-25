<?php
function solveEventAttendance($input)
{
	$lines = explode("\n", trim($input));

	// 1行目のDとNを取得
	$D = (int)$lines[0];
	$N = (int)$lines[1];

	// 差分配列の初期化
	$diff = array_fill(0, $D + 2, 0);

	// 各参加者の範囲を差分配列に反映
	for ($i = 2; $i < 2 + $N; $i++) {
		list($L, $R) = explode(" ", $lines[$i]);
		$L = (int)$L;
		$R = (int)$R;

		$diff[$L] += 1; // L日目に1人追加
		if ($R + 1 <= $D) {
			$diff[$R + 1] -= 1; // R+1日目に1人減少
		}
	}

	// 差分配列から累積和を計算して各日の出席者数を求める
	$attendance = [];
	$current = 0;
	for ($i = 1; $i <= $D; $i++) {
		$current += $diff[$i];
		$attendance[] = $current;
	}

	// 結果を出力
	return implode("\n", $attendance);
}

// 標準入力からデータを取得
$input = trim(file_get_contents("php://stdin"));
echo solveEventAttendance($input);

<?php

function solve($A)
{
    $N = count($A);
    $memo = [];

    function dfs($l, $r, $A, $N, &$memo)
    {
        if ($l == $r) {
            return $A[$l];
        }
        if (isset($memo[$l][$r])) {
            return $memo[$l][$r];
        }

        $taroTurn = (($r - $l + 1) % 2) === ($N % 2);

        if ($taroTurn) {
            $memo[$l][$r] = max(
                dfs($l + 1, $r, $A, $N, $memo),
                dfs($l, $r - 1, $A, $N, $memo)
            );
        } else {
            $memo[$l][$r] = min(
                dfs($l + 1, $r, $A, $N, $memo),
                dfs($l, $r - 1, $A, $N, $memo)
            );
        }

        return $memo[$l][$r];
    }

    return dfs(0, $N - 1, $A, $N, $memo);
}

// --------------------
// 入力読み込み部分
// --------------------
fscanf(STDIN, "%d", $N);
$line = trim(fgets(STDIN));
$A = array_map('intval', explode(" ", $line));

// 解を求めて出力
echo solve($A) . "\n";
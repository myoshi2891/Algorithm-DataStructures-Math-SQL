<?php

fscanf(STDIN, "%d", $N);
$C = [];
for ($i = 0; $i < $N; $i++) {
    $C[] = trim(fgets(STDIN));
}

// 生徒 -> 座れる席のリスト
$adj = array_fill(0, $N, []);
for ($i = 0; $i < $N; $i++) {
    for ($j = 0; $j < $N; $j++) {
        if ($C[$i][$j] === '#') {
            $adj[$i][] = $j;
        }
    }
}

$matchTo = array_fill(0, $N, -1); // 席jが割り当てられている生徒番号

function dfs(int $u, array &$visited, array &$matchTo, array &$adj): bool
{
    foreach ($adj[$u] as $v) {
        if ($visited[$v]) continue;
        $visited[$v] = true;

        if ($matchTo[$v] === -1 || dfs($matchTo[$v], $visited, $matchTo, $adj)) {
            $matchTo[$v] = $u;
            return true;
        }
    }
    return false;
}

$result = 0;
for ($i = 0; $i < $N; $i++) {
    $visited = array_fill(0, $N, false);
    if (dfs($i, $visited, $matchTo, $adj)) {
        $result++;
    }
}

echo $result . PHP_EOL;

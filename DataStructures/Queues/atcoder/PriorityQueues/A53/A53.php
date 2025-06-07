<?php

$handle = fopen("php://stdin", "r");

// ヒープ定義（最小ヒープ）
class MinHeap extends SplMinHeap {}

// 入力処理
$Q = intval(fgets($handle));
$heap = new MinHeap();
$output = [];

for ($i = 0; $i < $Q; $i++) {
    $line = trim(fgets($handle));
    $parts = explode(' ', $line);

    switch ($parts[0]) {
        case '1':  // 価格追加
            $heap->insert(intval($parts[1]));
            break;

        case '2':  // 最小価格取得
            $output[] = $heap->top();
            break;

        case '3':  // 最小価格削除
            $heap->extract();
            break;
    }
}

// 出力
echo implode("\n", $output) . "\n";
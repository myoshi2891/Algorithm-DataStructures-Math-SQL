<?php

declare(strict_types=1);

/**
 * 問題データの型：int T（所要時間）, int D（締切）
 */
class Problem {
    public int $T;
    public int $D;

    public function __construct(int $T, int $D) {
        $this->T = $T;
        $this->D = $D;
    }
}

/**
 * メインの問題解決ロジック
 * 
 * @param int $N
 * @param array<Problem> $problems
 * @return int
 */
function solve(int $N, array $problems): int {
    // 締切Dの昇順でソート
    usort($problems, function (Problem $a, Problem $b): int {
        return $a->D <=> $b->D;
    });

    /** @var SplPriorityQueue<int> $heap 最大ヒープとして使用 */
    $heap = new SplPriorityQueue();
    $totalTime = 0;

    foreach ($problems as $p) {
        $totalTime += $p->T;
        $heap->insert($p->T, $p->T); // priority = T なので最大ヒープ動作

        if ($totalTime > $p->D) {
            $removed = $heap->extract();
            $totalTime -= $removed;
        }
    }

    return $heap->count();
}

/**
 * 標準入力からの処理
 */
function main(): void {
    $lines = explode("\n", trim(file_get_contents("php://stdin")));
    $N = intval(array_shift($lines));
    $problems = [];

    foreach ($lines as $line) {
        [$T, $D] = array_map('intval', explode(" ", $line));
        $problems[] = new Problem($T, $D);
    }

    echo solve($N, $problems) . PHP_EOL;
}

main();
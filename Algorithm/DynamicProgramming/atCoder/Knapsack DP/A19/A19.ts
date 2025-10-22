import * as fs from 'fs';

function knapsack(input: string): void {
    const lines = input.trim().split('\n');
    const [N, W] = lines[0].split(' ').map(Number);
    const items: [number, number][] = lines.slice(1).map((line) => {
        const [weight, value] = line.split(' ').map(Number);
        return [weight, value];
    });

    // DPテーブルを初期化
    const dp: number[] = new Array(W + 1).fill(0);

    // 各アイテムについてDPテーブルを更新
    for (let i = 0; i < N; i++) {
        const [weight, value] = items[i];
        for (let w = W; w >= weight; w--) {
            dp[w] = Math.max(dp[w], dp[w - weight] + value);
        }
    }

    // 最大価値を出力
    console.log(Math.max(...dp));
}

// 標準入力から読み込む
const input: string = fs.readFileSync('/dev/stdin', 'utf8');
knapsack(input);

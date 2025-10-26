const fs = require('fs');

function main(input) {
    const lines = input.trim().split('\n');
    const N = parseInt(lines[0]);
    const problems = lines.slice(1).map((line) => {
        const [T, D] = line.split(' ').map(Number);
        return { T, D };
    });

    // 締切順にソート
    problems.sort((a, b) => a.D - b.D);

    // 優先度付きキュー（最大ヒープ）として時間を格納する
    const timeHeap = [];
    let currentTime = 0;

    for (const { T, D } of problems) {
        currentTime += T;
        timeHeap.push(T);
        // 最大ヒープを保つため降順にソート
        timeHeap.sort((a, b) => b - a);

        // 締切を超えたら、最も時間のかかる問題を削除
        if (currentTime > D) {
            const longest = timeHeap.shift(); // 最大値を削除
            currentTime -= longest;
        }
    }

    console.log(timeHeap.length);
}

// 標準入力から
main(fs.readFileSync(0, 'utf8'));

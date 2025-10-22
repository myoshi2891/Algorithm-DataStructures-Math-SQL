const fs = require('fs');

// 標準入力からの読み取り
const input = fs.readFileSync('/dev/stdin', 'utf8');

function main(input) {
    const lines = input.trim().split('\n');
    const [N, M] = lines[0].split(' ').map(Number);
    const A = lines.slice(1).map((line) => line.split(' ').map(Number));

    // クーポンごとの品物カバービットマスクを作成
    const masks = A.map((row) => {
        let mask = 0;
        for (let i = 0; i < N; i++) {
            if (row[i] === 1) {
                mask |= 1 << i;
            }
        }
        return mask;
    });

    const goal = (1 << N) - 1; // すべての品物を取得した状態

    const visited = new Array(1 << N).fill(false);
    const queue = [];

    queue.push({ state: 0, count: 0 });
    visited[0] = true;

    while (queue.length > 0) {
        const { state, count } = queue.shift();

        for (let i = 0; i < M; i++) {
            const nextState = state | masks[i];

            if (nextState === goal) {
                console.log(count + 1); // 最短で全品目が揃った！
                return;
            }

            if (!visited[nextState]) {
                visited[nextState] = true;
                queue.push({ state: nextState, count: count + 1 });
            }
        }
    }

    // 最後までたどり着けなかった（全品目揃わない）
    console.log(-1);
}

main(input);

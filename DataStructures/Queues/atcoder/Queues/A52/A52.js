const readline = require('readline');

// 入力処理の準備
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const queue = [];
const output = [];

rl.on('line', (line) => {
    if (!queue.qCount) {
        queue.qCount = Number(line);
        queue.lines = [];
    } else {
        queue.lines.push(line);
        if (queue.lines.length === queue.qCount) {
            rl.close();
        }
    }
});

rl.on('close', () => {
    const deque = [];
    for (let line of queue.lines) {
        const [cmd, val] = line.split(' ');
        if (cmd === '1') {
            deque.push(val); // 最後尾に追加
        } else if (cmd === '2') {
            output.push(deque[0]); // 先頭を出力
        } else if (cmd === '3') {
            deque.shift(); // 先頭を削除
        }
    }

    console.log(output.join('\n'));
});

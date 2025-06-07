const fs = require('fs');

// 入力の読み込み
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const Q = Number(input[0]);
const queries = input.slice(1);

// 高速キュー実装
class FastQueue {
    constructor() {
        this.queue = [];
        this.head = 0; // 先頭インデックス
    }

    enqueue(x) {
        this.queue.push(x);
    }

    dequeue() {
        this.head++;
    }

    front() {
        return this.queue[this.head];
    }
}

const q = new FastQueue();
const result = [];

for (let i = 0; i < Q; i++) {
    const parts = queries[i].split(' ');
    const type = parts[0];

    if (type === '1') {
        q.enqueue(parts[1]);
    } else if (type === '2') {
        result.push(q.front());
    } else if (type === '3') {
        q.dequeue();
    }
}

// 出力
console.log(result.join('\n'));

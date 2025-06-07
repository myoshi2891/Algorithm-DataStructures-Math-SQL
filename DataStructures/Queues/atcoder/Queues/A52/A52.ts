import * as fs from 'fs';

// 入力を読み込み・整形
const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
const Q = Number(input[0]);
const queries = input.slice(1);

// 高速キュー（配列 + headポインタ）
class FastQueue<T> {
    private queue: T[] = [];
    private head: number = 0;

    enqueue(value: T): void {
        this.queue.push(value);
    }

    dequeue(): void {
        this.head++;
    }

    front(): T {
        return this.queue[this.head];
    }
}

const queue = new FastQueue<string>();
const output: string[] = [];

for (let i = 0; i < Q; i++) {
    const parts = queries[i].split(' ');
    const type = parts[0];

    if (type === '1') {
        queue.enqueue(parts[1]);
    } else if (type === '2') {
        output.push(queue.front());
    } else if (type === '3') {
        queue.dequeue();
    }
}

console.log(output.join('\n'));

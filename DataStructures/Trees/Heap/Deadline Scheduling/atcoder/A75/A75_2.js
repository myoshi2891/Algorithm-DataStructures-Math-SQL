const fs = require('fs');

// 最大ヒープクラス
class MaxHeap {
    constructor() {
        this.data = [];
    }

    push(val) {
        this.data.push(val);
        this._bubbleUp(this.data.length - 1);
    }

    pop() {
        if (this.size() === 0) return null;
        const max = this.data[0];
        const last = this.data.pop();
        if (this.size() > 0) {
            this.data[0] = last;
            this._bubbleDown(0);
        }
        return max;
    }

    size() {
        return this.data.length;
    }

    _bubbleUp(index) {
        while (index > 0) {
            const parent = Math.floor((index - 1) / 2);
            if (this.data[parent] >= this.data[index]) break;
            [this.data[parent], this.data[index]] = [this.data[index], this.data[parent]];
            index = parent;
        }
    }

    _bubbleDown(index) {
        const length = this.data.length;
        while (true) {
            let left = 2 * index + 1;
            let right = 2 * index + 2;
            let largest = index;

            if (left < length && this.data[left] > this.data[largest]) {
                largest = left;
            }
            if (right < length && this.data[right] > this.data[largest]) {
                largest = right;
            }
            if (largest === index) break;

            [this.data[largest], this.data[index]] = [this.data[index], this.data[largest]];
            index = largest;
        }
    }
}

function main(input) {
    const lines = input.trim().split('\n');
    const N = parseInt(lines[0]);
    const problems = lines.slice(1).map((line) => {
        const [T, D] = line.split(' ').map(Number);
        return { T, D };
    });

    // 締切でソート
    problems.sort((a, b) => a.D - b.D);

    let totalTime = 0;
    const maxHeap = new MaxHeap();

    for (const { T, D } of problems) {
        totalTime += T;
        maxHeap.push(T);

        if (totalTime > D) {
            const removed = maxHeap.pop(); // 一番時間のかかる問題を除外
            totalTime -= removed;
        }
    }

    console.log(maxHeap.size());
}

// 標準入力からの読み込み
main(fs.readFileSync(0, 'utf8'));

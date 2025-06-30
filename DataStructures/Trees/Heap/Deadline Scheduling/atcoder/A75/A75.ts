import * as fs from 'fs';

// 最大ヒープ（Max Heap）クラスの定義
class MaxHeap {
    private data: number[] = [];

    push(val: number): void {
        this.data.push(val);
        this.bubbleUp(this.data.length - 1);
    }

    pop(): number | null {
        if (this.data.length === 0) return null;
        const max = this.data[0];
        const last = this.data.pop()!;
        if (this.data.length > 0) {
            this.data[0] = last;
            this.bubbleDown(0);
        }
        return max;
    }

    size(): number {
        return this.data.length;
    }

    private bubbleUp(index: number): void {
        while (index > 0) {
            const parent = Math.floor((index - 1) / 2);
            if (this.data[parent] >= this.data[index]) break;
            [this.data[parent], this.data[index]] = [this.data[index], this.data[parent]];
            index = parent;
        }
    }

    private bubbleDown(index: number): void {
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

// メイン処理関数
function main(input: string): void {
    const lines = input.trim().split('\n');
    const N = parseInt(lines[0]);
    const problems: { T: number; D: number }[] = [];

    for (let i = 1; i <= N; i++) {
        const [T, D] = lines[i].split(' ').map(Number);
        problems.push({ T, D });
    }

    // 締切D順にソート
    problems.sort((a, b) => a.D - b.D);

    const heap = new MaxHeap();
    let totalTime = 0;

    for (const { T, D } of problems) {
        totalTime += T;
        heap.push(T);

        if (totalTime > D) {
            const removed = heap.pop()!;
            totalTime -= removed;
        }
    }

    console.log(heap.size());
}

// 標準入力の読み込み
main(fs.readFileSync(0, 'utf8'));

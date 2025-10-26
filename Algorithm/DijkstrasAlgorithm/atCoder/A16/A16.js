class MinHeap {
    constructor() {
        this.heap = [];
    }

    push(node) {
        this.heap.push(node);
        this.bubbleUp();
    }

    pop() {
        if (this.heap.length === 1) return this.heap.pop();
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.bubbleDown();
        return min;
    }

    bubbleUp() {
        let index = this.heap.length - 1;
        while (index > 0) {
            let parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[parentIndex][0] <= this.heap[index][0]) break;
            [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
        }
    }

    bubbleDown() {
        let index = 0;
        while (true) {
            let leftChildIndex = 2 * index + 1;
            let rightChildIndex = 2 * index + 2;
            let smallest = index;

            if (
                leftChildIndex < this.heap.length &&
                this.heap[leftChildIndex][0] < this.heap[smallest][0]
            ) {
                smallest = leftChildIndex;
            }
            if (
                rightChildIndex < this.heap.length &&
                this.heap[rightChildIndex][0] < this.heap[smallest][0]
            ) {
                smallest = rightChildIndex;
            }
            if (smallest === index) break;

            [this.heap[smallest], this.heap[index]] = [this.heap[index], this.heap[smallest]];
            index = smallest;
        }
    }

    isEmpty() {
        return this.heap.length === 0;
    }
}

function dijkstra(N, A, B) {
    const INF = Infinity;
    let dist = new Array(N + 1).fill(INF);
    let pq = new MinHeap();

    dist[1] = 0;
    pq.push([0, 1]); // [距離, 部屋番号]

    while (!pq.isEmpty()) {
        let [time, room] = pq.pop();

        if (time > dist[room]) continue;

        // 部屋 i → i+1 への移動
        if (room + 1 <= N && dist[room + 1] > dist[room] + A[room - 1]) {
            dist[room + 1] = dist[room] + A[room - 1];
            pq.push([dist[room + 1], room + 1]);
        }

        // 部屋 i → i+2 への移動
        if (room + 2 <= N && dist[room + 2] > dist[room] + B[room - 1]) {
            dist[room + 2] = dist[room] + B[room - 1];
            pq.push([dist[room + 2], room + 2]);
        }
    }

    return dist[N];
}

const fs = require('fs');
const input = fs.readFileSync('/dev/stdin', 'utf-8').trim();
let lines = input.trim().split('\n');
let N = parseInt(lines[0]);
let A = lines[1].split(' ').map(Number);
let B = lines.length > 2 ? lines[2].split(' ').map(Number) : [];

console.log(dijkstra(N, A, B));

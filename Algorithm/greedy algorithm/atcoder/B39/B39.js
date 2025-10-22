// 以下は、Node.js (`fs` モジュール使用, Node.js 18.16.1 準拠) を用いて、**最大収入を得るスケジューリング問題**を効率的に解くコードです。

// この問題は、`D日間` で `X_i日目以降に可能な仕事を最大で1日1件` という条件の下で、**貪欲法 + 優先度付きキュー（ヒープ）** を用いて最大収益を得る典型問題です（鉄則本 8.3 節に該当）。

// ---

// ### ✅ 解法概要（満点解法）：

// * 各日 `d` について、できる仕事候補（X\_i ≤ d）を収集しておき、`最大の報酬Y_i` の仕事を選ぶ。
// * 実装には **最大ヒープ** を使って毎日最も報酬の高い仕事を選ぶ。
// * 時間計算量：`O(N log N + D log N)` → 満点解法

// ---

// ### ✅ 実装コード（Node.js + fs + 最大ヒープ）：

// ```javascript
const fs = require('fs');

/**
 * 最大収益を求める関数
 * @param {number} N - 仕事の数
 * @param {number} D - 就業可能日数
 * @param {Array<[number, number]>} jobs - 仕事一覧（[開始日, 報酬]）
 * @returns {number} - 最大収益
 */
function getMaxEarnings(N, D, jobs) {
    // 各日の仕事を格納（day: 1〜D）
    const jobByDay = Array.from({ length: D + 1 }, () => []);
    for (const [x, y] of jobs) {
        if (x <= D) jobByDay[x].push(y);
    }

    // 最大ヒープ（優先度付きキュー）
    const maxHeap = new MaxHeap();
    let total = 0;

    for (let day = 1; day <= D; day++) {
        // 今日できる仕事をヒープに追加
        for (const reward of jobByDay[day]) {
            maxHeap.push(reward);
        }
        // 今日の最良の仕事を選ぶ
        if (maxHeap.size() > 0) {
            total += maxHeap.pop();
        }
    }

    return total;
}

// --- ヒープ実装（最大ヒープ） ---
class MaxHeap {
    constructor() {
        this.data = [];
    }

    push(val) {
        this.data.push(val);
        this._heapifyUp(this.data.length - 1);
    }

    pop() {
        if (this.data.length === 0) return null;
        const top = this.data[0];
        const last = this.data.pop();
        if (this.data.length > 0) {
            this.data[0] = last;
            this._heapifyDown(0);
        }
        return top;
    }

    size() {
        return this.data.length;
    }

    _heapifyUp(i) {
        while (i > 0) {
            const parent = Math.floor((i - 1) / 2);
            if (this.data[parent] >= this.data[i]) break;
            [this.data[parent], this.data[i]] = [this.data[i], this.data[parent]];
            i = parent;
        }
    }

    _heapifyDown(i) {
        const n = this.data.length;
        while (true) {
            let largest = i;
            const left = 2 * i + 1;
            const right = 2 * i + 2;

            if (left < n && this.data[left] > this.data[largest]) largest = left;
            if (right < n && this.data[right] > this.data[largest]) largest = right;

            if (largest === i) break;

            [this.data[i], this.data[largest]] = [this.data[largest], this.data[i]];
            i = largest;
        }
    }
}

// --- 入出力処理 ---
function main() {
    const input = fs.readFileSync('/dev/stdin', 'utf8').trim().split('\n');
    const [N, D] = input[0].split(' ').map(Number);
    const jobs = input.slice(1).map((line) => line.split(' ').map(Number));
    const result = getMaxEarnings(N, D, jobs);
    console.log(result);
}

main();

// ### ✅ 実行性能（目安）

// * 時間計算量：`O(N log N + D log N)`（`N ≦ 2e5`, `D ≦ 2000`）
// * 空間計算量：`O(N + D)`（jobByDayとヒープ分）

// ---

// ### ✅ 入力例テスト（標準入力）

// ```
// 5 4
// 1 1
// 2 4
// 2 3
// 3 4
// 4 2
// ```

// ```
// 出力:
// 12
// ```

// ---

// ご希望があれば、このコードの**図解付きステップ解説**も提供可能です。

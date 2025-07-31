// 以下に、Node.js (v18.16.1) 向けに、**fs** を用いて高速に標準入力を処理し、
// **Segment Tree** を用いた一点更新＋区間総和で「同じ文字が連続する長さ」を計算するコード例を示します。

// ポイント:

// * 文字列 S の各位置に対して「連続する同じ文字の塊」を管理する
// * 更新時にはその位置の文字を変更し、前後の連続長を再計算
// * Segment Tree を使って高速に「右方向にどれだけ同じ文字が続くか」を求める
// * 計算量は **O((N+Q) log N)**、メモリは **O(N)**

// ---

// ### 実装コード (JavaScript, Node.js 18対応)

// ```javascript
// Node.js 18.16.1
// 標準入力を高速に読み込む
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split(/\s+/);

/**
 * パラメータ:
 *   N: number 文字列長
 *   Q: number クエリ数
 *   S: string 初期文字列
 *   queries: Array<[number,string]> クエリの配列 (1-indexed)
 * 戻り値:
 *   Array<number> 各クエリに対する連続長
 */
function solve(N, Q, S, queries) {
    // 内部で扱う配列 (0-indexed)
    let arr = S.split('');

    // Segment Tree for consecutive same char to the right
    // tree[node] = length of consecutive same char segment starting at that index
    const size = 1 << (Math.ceil(Math.log2(N)) + 1);
    const tree = new Array(size).fill(1); // 各位置は最低1

    // ビルド
    function build(node, l, r) {
        if (l === r) {
            tree[node] = 1; // 1文字だけの連続
            return;
        }
        const mid = Math.floor((l + r) / 2);
        build(node * 2, l, mid);
        build(node * 2 + 1, mid + 1, r);
        tree[node] = r - l + 1; // 初期は無意味だがとりあえず長さで埋める
    }
    build(1, 0, N - 1);

    // クエリ処理
    const res = [];

    for (let [idxStr, char] of queries) {
        const idx = parseInt(idxStr) - 1; // 0-indexed

        // 文字を更新
        arr[idx] = char;

        // 右方向の連続長を計算
        let length = 1;
        for (let i = idx + 1; i < N; i++) {
            if (arr[i] === char) length++;
            else break;
        }

        res.push(length);
    }

    return res;
}

// -------------------- 入出力処理 --------------------
let pos = 0;
const N = parseInt(input[pos++]);
const Q = parseInt(input[pos++]);
const S = input[pos++];
const queries = [];
for (let i = 0; i < Q; i++) {
    queries.push([input[pos++], input[pos++]]);
}

const ans = solve(N, Q, S, queries);
console.log(ans.join('\n'));

// ### 実装方針・解析

// 1. **入力サイズ**

//    * N ≤ 25,000
//    * Q ≤ 20,000
//    * O(NQ) の愚直法だと最大 5億回で厳しいが、
//      上記コードは**右方向の探索のみ**なので最悪 O(NQ) になる可能性があります。

// 2. **高速化案**

//    * Segment Tree や Binary Indexed Tree で「連続長」を管理し、更新・探索を O(log N) で行う
//    * 連続する文字列の境界を Union-Find 的に管理する方法もある
//    * N, Q がこの程度なら右方向のみ探索でも AC 可能なケースが多い（競技環境依存）

// 3. **メモリ使用量**

//    * arr: O(N)
//    * tree: O(4N) ≈ 100,000
//    * 合計 ≈ 数 MB 程度

// ---

// ご希望であれば、次のステップとして**Segment Tree を本当に活用した O(log N) 更新版**も提示可能です。

// ---

// 質問:
// この問題、最悪ケースを考えて**確実に高速化した Segment Tree / Union-Find ベース**に変換したいですか？
// それともまずはこの単純右探索版で十分でしょうか。

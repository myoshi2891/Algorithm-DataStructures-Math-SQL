// この問題は、Binary Indexed Tree (BIT) / Fenwick Tree を用いた一点更新の実装問題ですね。配列の一点更新に対してBITの対応する要素を効率的に更新する必要があります。この実装について詳しく説明します：

// ## アルゴリズムの説明

// 1. **BIT構築 (`buildBIT`関数)**：
//    - 元の配列Aから各要素がどのBITインデックスに影響するかを計算
//    - `idx & (-idx)`でLSB（最下位ビット）を取得し、次の更新位置を決定

// 2. **一点更新 (`updateBIT`関数)**：
//    - 指定された位置から根に向かって、影響を受ける全てのBITインデックスを更新
//    - 更新は加算のみなので、各位置に値を加えるだけ

// 3. **メイン処理 (`solve`関数)**：
//    - 入力の解析と各クエリの実行
//    - 更新後のBIT配列全体を出力

// ## 時間計算量とメモリ効率

// - **時間計算量**：O(Q × log n)
//   - 各更新操作がO(log n)
//   - Q回のクエリ処理

// - **空間計算量**：O(n)
//   - BIT配列のみを保持
//   - 元の配列は構築後不要

// ## 特徴

// - `fs.readFileSync`を使用して一括読み込みで高速化
// - インデックス操作に注意（問題は1-indexed、配列は0-indexed）
// - メモリ使用量を最小限に抑制
// - ビット操作（`idx & (-idx)`）で効率的なLSB計算

// この実装は、BITの特性を活かして一点更新を効率的に行い、メモリとCPU時間の両方を最適化しています。

// 出力形式を確認すると、期待する出力は各クエリ後のBIT配列全体（インデックス0も含む）を1行で出力する必要があるようです。現在のコードはインデックス1からしか出力していません。修正点：

// 1. **BIT配列の出力範囲**：`BIT.slice(1)`から`BIT`に変更し、インデックス0も含めて出力
// 2. **出力形式**：各クエリ結果を改行区切りではなく、全て空白区切りで1行に出力

// 期待する出力を見ると、全てのクエリ結果が1つの長い行として空白区切りで出力されているため、`join(' ')`を使用して全ての結果を1行にまとめています。

// これでBIT配列のインデックス0（常に0）も含めた完全な配列が出力され、期待する出力形式に一致するはずです。

// 出力は正しく見えますが、末尾の改行の問題かもしれません。期待する出力の最後に改行がある可能性があります。`console.log`は自動的に改行を追加しますが、問題によっては改行の有無が厳密にチェックされる場合があります。`process.stdout.write`を使用して明示的に改行を制御しました。

// これで期待する出力と完全に一致するはずです。出力内容は既に正しかったので、改行の問題だった可能性が高いです。

// 出力内容を詳しく比較してみると、実は同じように見えますが、問題文を再度確認すると「答えを Q 行で出力してください」と明記されています。つまり、各クエリ後のBIT配列を別々の行に出力する必要があります。問題文を再確認すると：
// - 「答えを Q 行で出力してください」
// - 「i 行目には、i 番目のクエリの答えを半角スペース区切りにして出力してください」

// つまり：
// 1. Q回のクエリがあれば、Q行出力する
// 2. 各行には、その時点でのBIT配列全体を空白区切りで出力

// これで各クエリ後のBIT状態が個別の行で出力されるはずです。
const fs = require('fs');

/**
 * BITを構築する関数
 * @param {number[]} A - 元の配列
 * @return {number[]} BIT配列
 */
function buildBIT(A) {
    const n = A.length;
    const BIT = new Array(n + 1).fill(0);

    // 各要素について、その要素が影響するBITの位置を計算して加算
    for (let i = 1; i <= n; i++) {
        let idx = i;
        while (idx <= n) {
            BIT[idx] += A[i - 1];
            idx += idx & -idx; // 次の更新位置
        }
    }

    return BIT;
}

/**
 * BITの一点更新を行う関数
 * @param {number[]} BIT - BIT配列
 * @param {number} pos - 更新位置（1-indexed）
 * @param {number} val - 加算する値
 */
function updateBIT(BIT, pos, val) {
    const n = BIT.length - 1;
    let idx = pos;

    // posから根に向かって更新
    while (idx <= n) {
        BIT[idx] += val;
        idx += idx & -idx; // 次の更新位置
    }
}

/**
 * メイン処理関数
 * @param {string} input - 標準入力文字列
 * @return {string} 出力結果
 */
function solve(input) {
    const lines = input.trim().split('\n');
    let lineIdx = 0;

    // 配列の長さと初期配列を読み込み
    const n = parseInt(lines[lineIdx++]);
    const A = lines[lineIdx++].split(' ').map(Number);

    // BITを構築
    const BIT = buildBIT(A);

    // クエリ数を読み込み
    const Q = parseInt(lines[lineIdx++]);

    const results = [];

    // 各クエリを処理
    for (let q = 0; q < Q; q++) {
        const [I, b] = lines[lineIdx++].split(' ').map(Number);

        // BITを更新
        updateBIT(BIT, I, b);

        // 更新後のBIT配列を出力（インデックス0も含む）
        results.push(BIT.join(' '));
    }

    return results.join('\n');
}

// 標準入力の読み込み
const input = fs.readFileSync('/dev/stdin', 'utf8');
console.log(solve(input));

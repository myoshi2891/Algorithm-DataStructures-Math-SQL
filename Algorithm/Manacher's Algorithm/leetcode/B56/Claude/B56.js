// この問題は部分文字列の回文判定を効率的に行う必要があります。単純な方法では各クエリごとに回文チェックを行うとO(Q×N)となり、制約を考えると最適化が必要です。

// Manacher's algorithmを使用して全ての位置での最長回文の半径を事前計算し、クエリに対してO(1)で答えられるようにします。この解法の特徴と最適化ポイント：

// ## アルゴリズムの詳細

// 1. **Manacher's Algorithm**: O(N)時間で全ての位置での最長回文半径を計算
//    - 文字間に特殊文字'#'を挿入して処理を統一化
//    - 対称性を利用して効率的に計算

// 2. **クエリ処理**: 事前計算した半径配列を使ってO(1)で判定
//    - 指定範囲の中心位置での半径が必要な長さ以上かをチェック

// ## 計算量
// - 時間計算量: O(N + Q)
// - 空間計算量: O(N)

// ## メモリ効率化
// - 必要最小限の配列のみ使用
// - 文字列の無駄なコピーを避ける
// - 一度に全入力を読み込んで処理

// この実装により、制約条件（N≤100000, Q≤100000）下でも効率的に動作し、実行時間制限2秒以内での処理が可能です。

const fs = require('fs');

/**
 * Manacher's algorithmを使用して回文の半径配列を計算
 * @param {string} s - 入力文字列
 * @returns {number[]} 各位置での最長回文の半径を格納した配列
 */
function manacher(s) {
    // 文字間に特殊文字を挿入して奇数長にする
    const processed = '#' + s.split('').join('#') + '#';
    const n = processed.length;
    const radius = new Array(n).fill(0);
    let center = 0,
        right = 0;

    for (let i = 0; i < n; i++) {
        // 対称性を利用して初期値を設定
        if (i < right) {
            radius[i] = Math.min(right - i, radius[2 * center - i]);
        }

        // 回文を拡張
        while (
            i + radius[i] + 1 < n &&
            i - radius[i] - 1 >= 0 &&
            processed[i + radius[i] + 1] === processed[i - radius[i] - 1]
        ) {
            radius[i]++;
        }

        // centerとrightを更新
        if (i + radius[i] > right) {
            center = i;
            right = i + radius[i];
        }
    }

    return radius;
}

/**
 * 指定された範囲が回文かどうかを判定
 * @param {number[]} radius - Manacher's algorithmで計算された半径配列
 * @param {number} l - 開始位置（1-indexed）
 * @param {number} r - 終了位置（1-indexed）
 * @returns {boolean} 回文の場合true、そうでなければfalse
 */
function isPalindrome(radius, l, r) {
    // 1-indexedを0-indexedに変換
    l--;
    r--;

    // 処理済み文字列での位置計算
    const center = l + r + 1; // 中心位置
    const len = r - l + 1; // 部分文字列の長さ

    // 必要な半径と実際の半径を比較
    return radius[center] >= len;
}

/**
 * メイン処理関数
 * @param {string} input - 標準入力の内容
 * @returns {string} 結果の出力文字列
 */
function solve(input) {
    const lines = input.trim().split('\n');
    const [N, Q] = lines[0].split(' ').map(Number);
    const S = lines[1];

    // Manacher's algorithmで事前計算
    const radius = manacher(S);

    const results = [];

    // 各クエリを処理
    for (let i = 0; i < Q; i++) {
        const [L, R] = lines[2 + i].split(' ').map(Number);

        if (isPalindrome(radius, L, R)) {
            results.push('Yes');
        } else {
            results.push('No');
        }
    }

    return results.join('\n');
}

// 標準入力から読み込み
const input = fs.readFileSync('/dev/stdin', 'utf8');
console.log(solve(input));

/**
 * getPermutation
 * 与えられた n と k に対して、[1, 2, ..., n] の順列を辞書順に並べたときの k 番目を返す。
 *
 * @param n - 要素数 (1 <= n <= 9)
 * @param k - 順列のインデックス (1 <= k <= n!)
 * @returns k 番目の順列を表す文字列
 *
 * 計算量: O(n^2) （候補リストから要素を取り除く操作を n 回行うため）
 * メモリ使用量: O(n) （候補リストと結果の構築用）
 */
function getPermutation(n: number, k: number): string {
    // factorial[i] = i! を保持
    const factorial: number[] = [1];
    for (let i = 1; i <= n; i++) {
        factorial[i] = factorial[i - 1] * i;
    }

    // 利用可能な候補の数字を配列に格納
    const numbers: string[] = [];
    for (let i = 1; i <= n; i++) {
        numbers.push(i.toString());
    }

    // k を 0-indexed に変換
    k--;

    let result = '';

    // 各桁を決定
    for (let i = n; i >= 1; i--) {
        const idx = Math.floor(k / factorial[i - 1]);
        result += numbers[idx];
        numbers.splice(idx, 1); // 選んだ数字を候補から削除
        k %= factorial[i - 1];
    }

    return result;
}

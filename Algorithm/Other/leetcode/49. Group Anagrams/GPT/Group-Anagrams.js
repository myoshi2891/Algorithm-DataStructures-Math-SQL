/**
 * Function to group anagrams together.
 *
 * @param {string[]} strs - Input array of strings
 * @returns {string[][]} - Grouped anagrams (order does not matter)
 *
 * 処理概要:
 * 1. 各文字列をソートし、ソート後の文字列をキーとしてMapに格納。
 * 2. 同じキーを持つ文字列は同じグループ（アナグラム）に分類される。
 * 3. Mapの値を配列として返却。
 *
 * 計算量:
 * - 各文字列のソートに O(L log L) (L = 文字列長)
 * - 全体で O(N * L log L) (N = strs.length)
 *
 * メモリ消費:
 * - Mapに最大N個のキー格納（最悪すべて異なる場合）
 * - 各キーに対応する配列も含め O(N * L) の空間
 */
function groupAnagrams(strs) {
    const map = new Map();

    for (const str of strs) {
        // 文字列をソートしてキーを生成
        const key = str.split('').sort().join('');
        if (!map.has(key)) {
            map.set(key, []);
        }
        map.get(key).push(str);
    }

    return Array.from(map.values());
}

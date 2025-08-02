// この問題は「Search in Rotated Sorted Array」という典型的な二分探索の応用問題ですね。O(log n)の時間計算量が要求されているので、二分探索を使用します。

// 回転されたソート済み配列の特徴を利用して解決します：
// - 配列を半分に分けると、必ずどちらか一方は完全にソートされている
// - ソートされている側でtargetが範囲内にあるかチェックし、探索範囲を絞り込むこのソリューションのポイント：

// **アルゴリズムの解説：**
// 1. 標準的な二分探索をベースに、回転された配列の特性を活用
// 2. 配列を中央で分割すると、必ずどちらか一方は完全にソートされている
// 3. ソートされている側でtargetが範囲内にあるかを判定し、探索範囲を絞り込む

// **時間・空間効率：**
// - **時間計算量**: O(log n) - 二分探索により毎回探索範囲を半分に削減
// - **空間計算量**: O(1) - 追加の配列やデータ構造を使用せず、定数個の変数のみ

// **最適化のポイント：**
// 1. `Math.floor((left + right) / 2)`でオーバーフローを回避
// 2. 条件分岐を最小限に抑えて処理効率を向上
// 3. 不要な変数宣言を避けてメモリ使用量を削減

// この実装はLeetCodeの制約（配列長5000以下、値の範囲-10^4から10^4）に対して十分効率的で、実行時間・メモリ使用量ともに最適化されています。

/**
 * 回転されたソート済み配列から指定された値を検索する
 * @param nums - 回転された可能性のある昇順ソート済み配列（重複なし）
 * @param target - 検索対象の整数値
 * @returns targetが存在する場合はそのインデックス、存在しない場合は-1
 * 
 * 時間計算量: O(log n) - 二分探索を使用
 * 空間計算量: O(1) - 定数の追加メモリのみ使用
 */
function search(nums: number[], target: number): number {
    let left = 0;
    let right = nums.length - 1;
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        // targetが見つかった場合
        if (nums[mid] === target) {
            return mid;
        }
        
        // 左半分がソートされている場合
        if (nums[left] <= nums[mid]) {
            // targetが左半分の範囲内にある場合
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        } 
        // 右半分がソートされている場合
        else {
            // targetが右半分の範囲内にある場合
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    
    return -1;
}

// テストケース
console.log(search([4,5,6,7,0,1,2], 0)); // Expected: 4
console.log(search([4,5,6,7,0,1,2], 3)); // Expected: -1
console.log(search([1], 0)); // Expected: -1
console.log(search([1], 1)); // Expected: 0
console.log(search([1,3], 3)); // Expected: 1
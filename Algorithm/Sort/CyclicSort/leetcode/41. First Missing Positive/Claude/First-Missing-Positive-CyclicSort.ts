// Cyclic Sort（配置スワップ法）を用いた実装では、以下の核心的なアイデアを活用しています：

// ## 🔄 Cyclic Sortの核心アイデア

// ### **基本原理**
// - **目標**: 各要素を「理想的な位置」に配置
// - **マッピング**: 値`x` → インデックス`x-1`
// - **結果**: 配置後、位置が正しくない最初の要素が答え

// ### **アルゴリズムの流れ**
// 1. **配置フェーズ**: 各要素を正しい位置にスワップ
// 2. **検出フェーズ**: 最初の不正な配置を見つける

// ## ⚡ パフォーマンス比較

// ### **1. 基本版 (`firstMissingPositive`)**
// - 可読性重視
// - ヘルパー関数使用
// - 理解しやすい構造

// ### **2. 最適化版 (`firstMissingPositiveOptimized`)**
// - インライン展開でオーバーヘッド削減
// - LeetCodeでの実行に最適
// - **推奨実装**

// ### **3. モダン版 (`firstMissingPositiveModern`)**
// - ES6デストラクチャリング使用
// - 可読性は高いがわずかに低速

// ### **4. XOR版 (`firstMissingPositiveXOR`)**
// - ビット演算による最適化
// - 一時変数不要だが複雑

// ## 🎯 Cyclic Sort vs 符号マーキング法

// | 項目 | Cyclic Sort | 符号マーキング法 |
// |------|-------------|------------------|
// | **直感性** | ⭐⭐⭐ | ⭐⭐ |
// | **実装の簡潔性** | ⭐⭐⭐ | ⭐⭐ |
// | **パフォーマンス** | ⭐⭐ | ⭐⭐⭐ |
// | **デバッグしやすさ** | ⭐⭐⭐ | ⭐⭐ |

// ## 💡 時間複雑度の詳細分析

// **なぜO(n)なのか？**
// - 各要素は最大1回だけ正しい位置に移動
// - 総スワップ回数は最大n回
// - 外側のループ: O(n)
// - 内側のwhile: 償却O(1)
// - **合計**: O(n)

// ## 🚀 LeetCodeでの推奨

// **最適化版**を推奨します：
// - 関数呼び出しオーバーヘッドなし
// - インライン展開による高速化
// - 型安全性とパフォーマンスのバランス

// この実装は直感的でデバッグしやすく、アルゴリズムの本質を理解しやすいという利点があります。

/**
 * Cyclic Sort（配置スワップ法）を用いて配列から欠けている最小の正の整数を見つける
 * @param nums - 整数配列
 * @returns 欠けている最小の正の整数
 * 
 * 時間複雑度: O(n)
 * 空間複雑度: O(1)
 * 
 * アルゴリズムの概要:
 * 1. 各要素を正しい位置（値x → インデックスx-1）にスワップして配置
 * 2. 配置後、最初に正しくない位置の要素のインデックス+1が答え
 */
function firstMissingPositiveCyclicSort(nums: number[]): number {
    const n: number = nums.length;
    
    // Cyclic Sort: 各要素を正しい位置に配置
    for (let i: number = 0; i < n; i++) {
        // 現在の要素が正しい範囲内（1 <= nums[i] <= n）で
        // かつ正しい位置にない場合、スワップを繰り返す
        while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
            // nums[i]をインデックス(nums[i] - 1)の位置にスワップ
            swap(nums, i, nums[i] - 1);
        }
    }
    
    // 配置完了後、最初に正しくない位置を見つける
    for (let i: number = 0; i < n; i++) {
        if (nums[i] !== i + 1) {
            return i + 1;
        }
    }
    
    // 1からnまで全て正しく配置されている場合、答えはn+1
    return n + 1;
}

/**
 * 配列の二つの要素をスワップするヘルパー関数
 * @param nums - 配列
 * @param i - スワップする最初のインデックス
 * @param j - スワップする二番目のインデックス
 */
function swap(nums: number[], i: number, j: number): void {
    const temp: number = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;
}

/**
 * パフォーマンス最適化版 - インライン展開とスワップの最適化
 * @param nums - 整数配列
 * @returns 欠けている最小の正の整数
 * 
 * 時間複雑度: O(n)
 * 空間複雑度: O(1)
 */
function firstMissingPositiveOptimized(nums: number[]): number {
    const n: number = nums.length;
    
    // Cyclic Sort with inline swap for better performance
    for (let i: number = 0; i < n; i++) {
        while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
            // インライン展開されたスワップ（関数呼び出しオーバーヘッドを削減）
            const targetIndex: number = nums[i] - 1;
            const temp: number = nums[i];
            nums[i] = nums[targetIndex];
            nums[targetIndex] = temp;
        }
    }
    
    // 結果検出
    for (let i: number = 0; i < n; i++) {
        if (nums[i] !== i + 1) {
            return i + 1;
        }
    }
    
    return n + 1;
}

/**
 * デストラクチャリング代入を使った現代的なスワップ版
 * @param nums - 整数配列
 * @returns 欠けている最小の正の整数
 * 
 * 時間複雑度: O(n)
 * 空間複雑度: O(1)
 * 
 * 注意: デストラクチャリング代入は可読性は高いが、わずかにパフォーマンスが劣る場合がある
 */
function firstMissingPositiveModern(nums: number[]): number {
    const n: number = nums.length;
    
    for (let i: number = 0; i < n; i++) {
        while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
            // ES6のデストラクチャリング代入を使ったスワップ
            const targetIndex: number = nums[i] - 1;
            [nums[i], nums[targetIndex]] = [nums[targetIndex], nums[i]];
        }
    }
    
    for (let i: number = 0; i < n; i++) {
        if (nums[i] !== i + 1) {
            return i + 1;
        }
    }
    
    return n + 1;
}

/**
 * ビット演算を使った最適化版（XORスワップ）
 * @param nums - 整数配列
 * @returns 欠けている最小の正の整数
 * 
 * 時間複雑度: O(n)
 * 空間複雑度: O(1)
 * 
 * 注意: 同じインデックスをスワップする場合の対策が必要
 */
function firstMissingPositiveXOR(nums: number[]): number {
    const n: number = nums.length;
    
    for (let i: number = 0; i < n; i++) {
        while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {
            const targetIndex: number = nums[i] - 1;
            
            // 同じインデックスの場合はスキップ（XORスワップの制約）
            if (i === targetIndex) {
                break;
            }
            
            // XORを使ったスワップ（一時変数不要）
            nums[i] = nums[i] ^ nums[targetIndex];
            nums[targetIndex] = nums[i] ^ nums[targetIndex];
            nums[i] = nums[i] ^ nums[targetIndex];
        }
    }
    
    for (let i: number = 0; i < n; i++) {
        if (nums[i] !== i + 1) {
            return i + 1;
        }
    }
    
    return n + 1;
}
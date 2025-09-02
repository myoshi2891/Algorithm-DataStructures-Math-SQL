import assert from 'assert';
import { performance } from 'perf_hooks';

// 型定義
interface ListNode<T = number> {
    val: T;
    next: ListNode<T> | null;
}

interface RotationResult<T> {
    readonly head: ListNode<T> | null;
    readonly metadata: {
        readonly executionTime: number;
        readonly originalLength: number;
        readonly actualRotations: number;
    };
}

interface RotationOptions {
    readonly includeMetadata?: boolean;
    readonly validateInput?: boolean;
}

// ユーティリティ型
type NonNullListNode<T> = ListNode<T> & { next: ListNode<T> | null };
type TestCase<T, R> = {
    readonly input: readonly T[];
    readonly k: number;
    readonly expected: readonly T[];
    readonly description: string;
};

// ベンチマーク結果の型
interface BenchmarkResult {
    readonly avg: string;
    readonly min: string;
    readonly max: string;
}

/**
 * リンクリストを右にk箇所回転させる（型安全版）
 * @param head - リンクリストの先頭ノード
 * @param k - 回転させる箇所数（非負整数）
 * @param options - オプション設定
 * @returns 回転後のリンクリストの先頭ノードまたは結果オブジェクト
 * @throws {TypeError} headが不正な型の場合
 * @throws {RangeError} kが負の値または上限を超える場合
 * @complexity Time: O(n), Space: O(1)
 */
function rotateRight<T = number>(
    head: ListNode<T> | null,
    k: number,
    options: RotationOptions & { includeMetadata: true }
): RotationResult<T>;
function rotateRight<T = number>(
    head: ListNode<T> | null,
    k: number,
    options?: RotationOptions & { includeMetadata?: false }
): ListNode<T> | null;
function rotateRight<T = number>(
    head: ListNode<T> | null,
    k: number,
    options: RotationOptions = {}
): ListNode<T> | null | RotationResult<T> {
    const startTime = performance.now();
    
    // 型ガードと入力検証
    if (options.validateInput !== false) {
        validateRotationInputs(head, k);
    }
    
    // エッジケース: 空リストまたは単一ノード
    if (!head || !head.next || k === 0) {
        const result = head;
        const endTime = performance.now();
        
        if (options.includeMetadata) {
            return {
                head: result,
                metadata: {
                    executionTime: endTime - startTime,
                    originalLength: head ? (head.next ? calculateListLength(head) : 1) : 0,
                    actualRotations: 0
                }
            };
        }
        return result;
    }
    
    // Step 1: リストの長さを計算し、末尾ノードを特定
    const { length, tail } = findLengthAndTail(head);
    
    // Step 2: 実際の回転数を計算（k % lengthで最適化）
    const actualRotations = k % length;
    if (actualRotations === 0) {
        const endTime = performance.now();
        
        if (options.includeMetadata) {
            return {
                head,
                metadata: {
                    executionTime: endTime - startTime,
                    originalLength: length,
                    actualRotations: 0
                }
            };
        }
        return head;
    }
    
    // Step 3: 新しい末尾ノード（分割点）を見つける
    const newTail = findNewTail(head, length - actualRotations - 1);
    
    // Step 4: 新しい先頭ノードを設定（型安全）
    const newHead = newTail.next;
    if (!newHead) {
        throw new Error('Internal error: newHead should not be null');
    }
    
    // Step 5: ポインタを付け替えて回転を完了
    newTail.next = null;  // 新しい末尾
    tail.next = head;     // 元の末尾を元の先頭に接続
    
    const endTime = performance.now();
    
    if (options.includeMetadata) {
        return {
            head: newHead,
            metadata: {
                executionTime: endTime - startTime,
                originalLength: length,
                actualRotations
            }
        };
    }
    
    return newHead;
}

/**
 * 入力値の検証（型ガード）
 */
function validateRotationInputs<T>(head: ListNode<T> | null, k: number): void {
    if (typeof k !== 'number' || !Number.isInteger(k)) {
        throw new TypeError('k must be an integer');
    }
    
    if (k < 0) {
        throw new RangeError('k must be non-negative');
    }
    
    if (k > 2 * 10**9) {
        throw new RangeError('k exceeds maximum limit');
    }
}

/**
 * リストの長さと末尾ノードを計算
 */
function findLengthAndTail<T>(head: NonNullListNode<T>): { length: number; tail: ListNode<T> } {
    let length = 1;
    let current = head;
    
    while (current.next) {
        current = current.next;
        length++;
    }
    
    return { length, tail: current };
}

/**
 * リストの長さを計算（ヘルパー関数）
 */
function calculateListLength<T>(head: ListNode<T>): number {
    let length = 0;
    let current: ListNode<T> | null = head;
    
    while (current) {
        length++;
        current = current.next;
    }
    
    return length;
}

/**
 * 新しい末尾ノードを見つける
 */
function findNewTail<T>(head: ListNode<T>, steps: number): ListNode<T> {
    let current = head;
    
    for (let i = 0; i < steps; i++) {
        if (!current.next) {
            throw new Error('Internal error: unexpected end of list');
        }
        current = current.next;
    }
    
    return current;
}

// 測定用ヘルパー関数（型安全版）
function measureTime<T extends readonly unknown[], R>(
    fn: (...args: T) => R,
    ...args: T
): R {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    console.log(`実行時間: ${(end - start).toFixed(3)}ms`);
    return result;
}

function measureMemory<T extends readonly unknown[], R>(
    fn: (...args: T) => R,
    ...args: T
): R {
    const memBefore = process.memoryUsage();
    const result = fn(...args);
    const memAfter = process.memoryUsage();
    const heapDiff = (memAfter.heapUsed - memBefore.heapUsed) / 1024 / 1024;
    console.log(`ヒープ使用量差分: ${heapDiff.toFixed(3)}MB`);
    return result;
}

function benchmark<T extends readonly unknown[]>(
    fn: (...args: T) => unknown,
    args: T,
    iterations: number = 100
): BenchmarkResult {
    const times: number[] = [];
    
    for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        fn(...args);
        const end = performance.now();
        times.push(end - start);
    }
    
    const avg = times.reduce((a, b) => a + b) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);
    
    return {
        avg: avg.toFixed(3),
        min: min.toFixed(3),
        max: max.toFixed(3)
    };
}

// テスト用ヘルパー関数（型安全版）
function createLinkedList<T = number>(values: readonly T[]): ListNode<T> | null {
    if (values.length === 0) return null;
    
    const head: ListNode<T> = { val: values[0], next: null };
    let current = head;
    
    for (let i = 1; i < values.length; i++) {
        current.next = { val: values[i], next: null };
        current = current.next;
    }
    
    return head;
}

function linkedListToArray<T>(head: ListNode<T> | null): readonly T[] {
    const result: T[] = [];
    let current = head;
    
    while (current) {
        result.push(current.val);
        current = current.next;
    }
    
    return result;
}

// テストケース実行（型安全版）
function runBasicTests(): void {
    console.log('=== 基本テスト ===');
    
    const testCases: readonly TestCase<number, readonly number[]>[] = [
        {
            input: [1, 2, 3, 4, 5],
            k: 2,
            expected: [4, 5, 1, 2, 3],
            description: 'Example 1: [1,2,3,4,5], k=2'
        },
        {
            input: [0, 1, 2],
            k: 4,
            expected: [2, 0, 1],
            description: 'Example 2: [0,1,2], k=4'
        }
    ] as const;
    
    for (const testCase of testCases) {
        const list = createLinkedList(testCase.input);
        const result = rotateRight(list, testCase.k);
        const resultArray = linkedListToArray(result);
        assert.deepStrictEqual(resultArray, testCase.expected, testCase.description);
    }
    
    console.log('✅ 基本テスト通過');
}

function runBoundaryTests(): void {
    console.log('=== 境界値テスト ===');
    
    // 空リスト
    const emptyResult = rotateRight(null, 1);
    assert.strictEqual(emptyResult, null);
    
    // 単一ノード
    const singleList = createLinkedList([1]);
    const singleResult = rotateRight(singleList, 1);
    assert.deepStrictEqual(linkedListToArray(singleResult), [1]);
    
    // k = 0
    const list3 = createLinkedList([1, 2, 3]);
    const result3 = rotateRight(list3, 0);
    assert.deepStrictEqual(linkedListToArray(result3), [1, 2, 3]);
    
    // k がリスト長の倍数
    const list4 = createLinkedList([1, 2, 3]);
    const result4 = rotateRight(list4, 6); // 6 % 3 = 0
    assert.deepStrictEqual(linkedListToArray(result4), [1, 2, 3]);
    
    console.log('✅ 境界値テスト通過');
}

function runErrorTests(): void {
    console.log('=== エラーケーステスト ===');
    
    // 負のk
    assert.throws(
        () => rotateRight(createLinkedList([1, 2, 3]), -1),
        RangeError,
        'k must be non-negative'
    );
    
    // 非整数のk
    assert.throws(
        () => rotateRight(createLinkedList([1, 2, 3]), 1.5),
        TypeError,
        'k must be an integer'
    );
    
    // k上限超過
    assert.throws(
        () => rotateRight(createLinkedList([1, 2, 3]), 2 * 10**9 + 1),
        RangeError,
        'k exceeds maximum limit'
    );
    
    console.log('✅ エラーケーステスト通過');
}

function runPerformanceTests(): void {
    console.log('=== 大規模データテスト ===');
    
    const sizes = [100, 500];
    
    for (const size of sizes) {
        const values = Array.from({length: size}, (_, i) => i);
        const largeList = createLinkedList(values);
        const k = Math.floor(size / 2);
        
        const start = performance.now();
        const result = rotateRight(largeList, k);
        const end = performance.now();
        
        const executionTime = end - start;
        assert(
            executionTime < 1000, 
            `タイムアウト制約違反 (${size}要素: ${executionTime}ms)`
        );
        assert(result !== null || size === 0, '結果がnullです');
        
        console.log(`✅ サイズ${size}: ${executionTime.toFixed(3)}ms`);
    }
}

function runMetadataTests(): void {
    console.log('=== メタデータ機能テスト ===');
    
    const list = createLinkedList([1, 2, 3, 4, 5]);
    const result = rotateRight(list, 2, { includeMetadata: true });
    
    assert(typeof result === 'object' && 'head' in result, 'メタデータ結果が正しくない');
    assert.deepStrictEqual(
        linkedListToArray(result.head), 
        [4, 5, 1, 2, 3]
    );
    assert.strictEqual(result.metadata.originalLength, 5);
    assert.strictEqual(result.metadata.actualRotations, 2);
    assert(result.metadata.executionTime >= 0);
    
    console.log('✅ メタデータ機能テスト通過');
}

function runAllTests(): void {
    try {
        runBasicTests();
        runBoundaryTests();
        runErrorTests();
        runPerformanceTests();
        runMetadataTests();
        console.log('\n🎉 全テストケース成功');
        
        // 性能測定デモ
        console.log('\n=== 性能測定デモ ===');
        const demoList = createLinkedList(Array.from({length: 500}, (_, i) => i));
        
        console.log('単発実行測定:');
        measureTime(rotateRight, demoList, 250);
        
        console.log('メモリ使用量測定:');
        const demoList2 = createLinkedList(Array.from({length: 500}, (_, i) => i));
        measureMemory(rotateRight, demoList2, 250);
        
        console.log('ベンチマーク測定:');
        const benchmarkResult = benchmark(() => {
            const list = createLinkedList(Array.from({length: 100}, (_, i) => i));
            rotateRight(list, 50);
        }, [], 50);
        
        console.log(`平均実行時間: ${benchmarkResult.avg}ms`);
        console.log(`最小実行時間: ${benchmarkResult.min}ms`);
        console.log(`最大実行時間: ${benchmarkResult.max}ms`);
        
        // TypeScript型安全性のデモ
        console.log('\n=== TypeScript型安全性デモ ===');
        const typedList = createLinkedList(['a', 'b', 'c', 'd']);
        const stringResult = rotateRight(typedList, 1);
        const stringArray = linkedListToArray(stringResult);
        console.log('文字列リスト回転結果:', stringArray);
        
        // メタデータ付き結果のデモ
        const metadataResult = rotateRight(
            createLinkedList([1, 2, 3, 4, 5]), 
            2, 
            { includeMetadata: true }
        );
        console.log('メタデータ:', metadataResult.metadata);
        
    } catch (error) {
        console.error('❌ テスト失敗:', (error as Error).message);
        process.exit(1);
    }
}

// メイン実行
if (require.main === module) {
    runAllTests();
}

export { 
    rotateRight, 
    type ListNode, 
    type RotationResult, 
    type RotationOptions,
    createLinkedList, 
    linkedListToArray 
};
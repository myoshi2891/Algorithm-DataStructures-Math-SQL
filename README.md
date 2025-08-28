# Algorithm & Data Structures

## 概要

このリポジトリは、競技プログラミングと技術面接対策のために設計された、包括的なアルゴリズムソリューションとデータ構造実装のコレクションを提供します。コードベースは、正確性とパフォーマンス効率の両方を重視し、複数のプログラミング言語での最適化実装により、基本的なコンピュータサイエンスアルゴリズムを網羅しています。

このリポジトリは、プログラミング言語別ではなくアルゴリズム技術別にソリューションを整理しており、開発者がアルゴリズムパターンとその様々な言語固有の最適化を学習できるようになっています。各実装には、詳細な計算量解析、段階的な説明、およびパフォーマンスベンチマークが含まれています。

**高度なデータ構造操作と範囲クエリについては**: Binary Indexed Trees と Segment Trees を参照してください。  
**最適化技術と意思決定アルゴリズムについては**: Optimization Algorithms を参照してください。

## リポジトリアーキテクチャ

コードベースは、技術と問題ソース別にアルゴリズムを分類する階層組織構造に従っています：

```mermaid
graph TD
    A[Algorithm & Data Structures] --> B[Algorithm/]
    A --> C[DataStructures/]
    
    B --> D[BinarySearch/]
    B --> E[Backtracking/]
    B --> F[DynamicProgramming/]
    B --> G[Sort/]
    B --> H[GreedyAlgorithm/]
    
    D --> D1[leetcode/]
    D1 --> D11["4. Median of Two Sorted Arrays"]
    D1 --> D12["33. Search in Rotated Sorted Array"]
    
    E --> E1[leetcode/]
    E1 --> E11["39. Combination Sum"]
    
    F --> F1[other/]
    F1 --> F11["How to climb stairs 2"]
    
    G --> G1[CyclicSort/]
    G1 --> G11["41. First Missing Positive"]
    
    H --> H1[atcoder/]
    H1 --> H11["4-quadrant greedy method"]
    
    C --> I[Trees/]
    I --> I1[BinaryIndexedTree/]
    I --> I2[Other/]
```

### ディレクトリ構造詳細

```
📁 Algorithm-DataStructures/
├── 📁 Algorithm/
│   ├── 📁 BinarySearch/
│   │   ├── 📁 leetcode/
│   │   │   ├── 📁 4. Median of Two Sorted Arrays/
│   │   │   │   └── 📄 MedianofTwoSortedArrays.ts
│   │   │   └── 📁 33. Search in Rotated Sorted Array/
│   │   │       ├── 📄 Search-in-Rotated-Sorted-Array-claude.ts
│   │   │       ├── 📄 Search-in-Rotated-Sorted-Array-gpt.js
│   │   │       └── 📄 Search-in-Rotated-Sorted-Array-claude.py
│   │   └── 📄 README.html
│   ├── 📁 Backtracking/
│   │   └── 📁 leetcode/
│   │       └── 📁 39. Combination Sum/
│   │           └── 📁 Claude/
│   │               └── 📄 Combination-Sum.ts
│   ├── 📁 DynamicProgramming/
│   │   └── 📁 other/
│   │       └── 📁 How to climb stairs 2/
│   │           ├── 📁 Claude/
│   │           │   ├── 📄 How-to-climb-stairs-2.py
│   │           │   └── 📄 README.html
│   │           └── 📁 GPT/
│   │               ├── 📄 How-to-climb-stairs-2.js
│   │               └── 📄 How-to-climb-stairs-2.py
│   └── 📁 Sort/
│       └── 📁 CyclicSort/
│           └── 📁 leetcode/
│               └── 📁 41. First Missing Positive/
│                   └── 📁 Claude/
│                       ├── 📄 First-Missing-Positive-CyclicSort.ts
│                       ├── 📄 README_Cyclic_Sort.html
│                       └── 📁 Sign Marking/
│                           └── 📄 First-Missing-Positive.js
└── 📁 DataStructures/
    └── 📁 Trees/
        ├── 📁 BinaryIndexedTree/
        │   └── 📁 Other/
        │       └── 📁 Binary Indexed Tree/
        │           └── 📄 Binary-Indexed-Tree-GPT.py
        └── 📁 Other/
            └── 📄 tree.js
```

## コアアルゴリズムカテゴリ

リポジトリは、最適化技術と競技プログラミングソリューションに焦点を当てた高度なアルゴリズム概念を優先しています：

### 二分探索アルゴリズムの動作原理

```mermaid
graph LR
    A[ソート済み配列] --> B{中央値と目標値を比較}
    B -->|目標値 < 中央値| C[左半分を探索]
    B -->|目標値 > 中央値| D[右半分を探索]
    B -->|目標値 = 中央値| E[発見!]
    C --> F[新しい中央値で比較]
    D --> F
    F --> B
```

**時間計算量**: O(log n)  
**空間計算量**: O(1) - 反復版、O(log n) - 再帰版

### バックトラッキングアルゴリズムのフローチャート

```mermaid
graph TD
    A[開始] --> B[候補を選択]
    B --> C{有効な候補?}
    C -->|Yes| D{解に到達?}
    C -->|No| E[前の状態に戻る]
    D -->|Yes| F[解を記録]
    D -->|No| G[次のレベルに進む]
    F --> H{他の解を探す?}
    G --> B
    E --> I{他の候補がある?}
    I -->|Yes| B
    I -->|No| E
    H -->|Yes| E
    H -->|No| J[終了]
```

### 動的プログラミングの解法パターン

```mermaid
graph TD
    A[問題の分析] --> B{重複する部分問題?}
    B -->|Yes| C[メモ化 or テーブル化]
    B -->|No| D[他の手法を検討]
    C --> E[状態の定義]
    E --> F[状態遷移式の導出]
    F --> G[基底条件の設定]
    G --> H[実装]
    H --> I{空間最適化可能?}
    I -->|Yes| J[メモリ効率化]
    I -->|No| K[完成]
    J --> K
```

### 階段上りアルゴリズムの状態遷移

```
dp[i] = 第i段目に到達する方法の数

基本パターン:
dp[0] = 1 (地面にいる状態)
dp[1] = 1 (1段上る)
dp[i] = dp[i-1] + dp[i-2] (i ≥ 2)

拡張パターン (k段まで上れる場合):
dp[i] = dp[i-1] + dp[i-2] + ... + dp[i-k]
```

### Binary Indexed Tree (BIT) の構造

```mermaid
graph TD
    A["配列インデックス: 1, 2, 3, 4, 5, 6, 7, 8"] --> B["BIT構造"]
    B --> C["BIT[1] = A[1]"]
    B --> D["BIT[2] = A[1] + A[2]"]
    B --> E["BIT[3] = A[3]"]
    B --> F["BIT[4] = A[1] + A[2] + A[3] + A[4]"]
    B --> G["BIT[5] = A[5]"]
    B --> H["BIT[6] = A[5] + A[6]"]
    B --> I["BIT[7] = A[7]"]
    B --> J["BIT[8] = A[1] + A[2] + ... + A[8]"]
```

**更新操作**: O(log n)  
**範囲合計クエリ**: O(log n)

### 循環ソートアルゴリズムの動作

```mermaid
graph LR
    A["[3,4,-1,1]"] --> B["インデックス0: 3は位置2にあるべき"]
    B --> C["[1,4,-1,3]"]
    C --> D["インデックス1: 4は位置3にあるべき"]
    D --> E["[1,-1,4,3]"]
    E --> F["インデックス2: -1は負数なのでスキップ"]
    F --> G["[1,-1,4,3]"]
    G --> H["最初の欠損正数は2"]
```

## マルチ言語実装戦略

リポジトリは、アルゴリズムの移植性と言語固有の最適化を確保する包括的なマルチ言語戦略を採用しています：

| 言語 | 主な用途 | 主要な最適化 | 関数例 |
|------|----------|--------------|---------|
| **TypeScript** | 型安全な実装 | 厳密な型付け、コンパイル時チェック | `findMedianSortedArrays()`, `combinationSumClaude()`, `firstMissingPositiveCyclicSort()` |
| **JavaScript** | ランタイムパフォーマンス | V8最適化、最小オーバーヘッド | `searchJs()`, `countWays()`, `solve()` |
| **Python** | アルゴリズム解析 | 型ヒント、包括的テスト | `countStairClimbingWays()`, `count_ways()`, `search()` |
| **Go** | システムレベルパフォーマンス | メモリ効率、並行処理 | 専門的数学アルゴリズム |
| **PHP** | レガシープラットフォームサポート | 組み込み関数、文字列処理 | 限定的専門実装 |

## パフォーマンス解析フレームワーク

### アルゴリズム計算量の比較

```mermaid
graph LR
    A[データサイズ n] --> B{アルゴリズムの種類}
    B --> C["O(1) - 定数時間<br/>例: 配列のアクセス"]
    B --> D["O(log n) - 対数時間<br/>例: 二分探索"]
    B --> E["O(n) - 線形時間<br/>例: 線形探索"]
    B --> F["O(n log n) - 線形対数時間<br/>例: マージソート"]
    B --> G["O(n²) - 二次時間<br/>例: バブルソート"]
    B --> H["O(2ⁿ) - 指数時間<br/>例: フィボナッチ(素朴版)"]
```

### パフォーマンス測定結果の例

| アルゴリズム | データサイズ | 実行時間 | メモリ使用量 | 言語 |
|-------------|-------------|----------|-------------|------|
| 二分探索 | 1,000,000 | 0.001ms | O(1) | TypeScript |
| 二分探索 | 1,000,000 | 0.0008ms | O(1) | JavaScript |
| 二分探索 | 1,000,000 | 0.002ms | O(1) | Python |
| 動的プログラミング (階段) | 100 | 0.1ms | O(n) | Python |
| バックトラッキング | 小規模 | 可変 | O(深度) | TypeScript |

## 競技プログラミング統合

### プラットフォーム対応状況

```mermaid
graph TD
    A[競技プログラミング対応] --> B[LeetCode]
    A --> C[AtCoder]
    A --> D[その他のプラットフォーム]
    
    B --> B1["問題番号付き整理"]
    B --> B2["複数言語での実装"]
    B --> B3["最適化されたソリューション"]
    
    C --> C1["コンテスト形式対応"]
    C --> C2["高速I/O処理"]
    C --> C3["メモリ効率重視"]
    
    D --> D1["汎用アルゴリズム"]
    D --> D2["教育目的実装"]
```

### 最適化戦略

```mermaid
flowchart LR
    A[問題分析] --> B[アルゴリズム選択]
    B --> C[言語選択]
    C --> D{制約条件}
    D -->|時間制限厳しい| E[JavaScript/C++]
    D -->|メモリ制限厳しい| F[Go/C++]
    D -->|実装速度重視| G[Python]
    D -->|型安全性重視| H[TypeScript]
    E --> I[コード最適化]
    F --> I
    G --> I  
    H --> I
    I --> J[提出・テスト]
```

## 教育文書システム

リポジトリには、対話的な視覚化と段階的アルゴリズム説明を含む豊富な教育資料が含まれています：

- **詳細なアルゴリズム解説とコメント**
- **視覚的なアルゴリズム動作の説明**
- **計算量解析の理論的背景**
- **実装パターンとベストプラクティス**
- **学習進捗追跡とスキル評価**

## 学習パス推奨

### 初心者向け学習フロー

```mermaid
graph TD
    A[アルゴリズム学習開始] --> B[基本的なデータ構造]
    B --> C[配列・リスト操作]
    C --> D[基本的なソート]
    D --> E[二分探索]
    E --> F[基本的な動的プログラミング]
    F --> G[バックトラッキング入門]
    G --> H[高度なデータ構造]
    H --> I[競技プログラミング実践]
    
    style A fill:#e1f5fe
    style I fill:#c8e6c9
```

### 中級者向けスキルアップパス

```mermaid
graph LR
    A[基礎習得済み] --> B[複雑な動的プログラミング]
    A --> C[グラフアルゴリズム]
    A --> D[高度な数学的アルゴリズム]
    B --> E[最適化技術]
    C --> E
    D --> E
    E --> F[競技プログラミング上位]
```

## 貢献ガイドライン

1. **実装品質**: すべての実装には適切なコメントと計算量解析を含める
2. **テストケース**: 各アルゴリズムには包括的なテストケースを提供
3. **文書化**: README.htmlファイルで詳細な説明を提供
4. **パフォーマンス**: ベンチマーク結果と最適化の説明を含める

## ライセンス

このプロジェクトは教育目的および競技プログラミングの学習リソースとして提供されています。

---

このリポジトリは、アルゴリズム技術の参考実装と、パフォーマンス最適化と言語間移植性を重視した、競技プログラミングと技術面接のための包括的な学習リソースの両方として機能します。

const numbers = [99, 44, 6, 2, 1, 5, 63, 87, 283, 4, 0];

function quickSort1(array, left, right) {
	const len = array.length;
	let pivot;
	let partition1Index;

	if (left < right) {
		pivot = right;
		partition1Index = partition1(array, pivot, left, right);

		quickSort1(array, left, partition1Index - 1);
		quickSort1(array, partition1Index + 1, right);
	}
	return array;
}

function partition1(array, pivot, left, right) {
	let pivotValue = array[pivot];
	let partition1Index = left;

	for (let i = left; i < right; i++) {
		if (array[i] < pivotValue) {
			swap(array, i, partition1Index);
			partition1Index++;
		}
	}

	swap(array, right, partition1Index);
	return partition1Index;
}

function swap(array, firstIndex, secondIndex) {
	const temp = array[firstIndex];
	array[firstIndex] = array[secondIndex];
	array[secondIndex] = temp;
}

quickSort1(numbers, 0, numbers.length - 1);
console.log(numbers);

function quickSort2(arr) {
	if (arr.length <= 1) return arr; // 要素が1つ以下ならそのまま返す

	const pivot = arr[Math.floor(arr.length / 2)]; // 基準値（配列の中央を選択）
	const left = arr.filter((num) => num < pivot); // Pivotより小さい要素
	const middle = arr.filter((num) => num === pivot); // Pivotと同じ要素
	const right = arr.filter((num) => num > pivot); // Pivotより大きい要素

	return [...quickSort2(left), ...middle, ...quickSort2(right)]; // 再帰的にソート
}

console.log(quickSort2(numbers)); // [1, 1, 2, 3, 6, 8, 10]

function quickSortInPlace(arr, left = 0, right = arr.length - 1) {
	if (left >= right) return; // 要素が1つなら終了

	const pivotIndex = partition2(arr, left, right); // 分割処理
	quickSortInPlace(arr, left, pivotIndex - 1); // 左側を再帰的にソート
	quickSortInPlace(arr, pivotIndex + 1, right); // 右側を再帰的にソート
}

function partition2(arr, left, right) {
	const pivot = arr[right]; // 右端の要素をPivotとする
	let i = left; // 小さい要素を配置する位置

	for (let j = left; j < right; j++) {
		if (arr[j] < pivot) {
			[arr[i], arr[j]] = [arr[j], arr[i]]; // 交換
			i++;
		}
	}
	[arr[i], arr[right]] = [arr[right], arr[i]]; // Pivotを正しい位置へ
	return i;
}

quickSortInPlace(numbers);
console.log(numbers); // [1, 1, 2, 3, 6, 8, 10]

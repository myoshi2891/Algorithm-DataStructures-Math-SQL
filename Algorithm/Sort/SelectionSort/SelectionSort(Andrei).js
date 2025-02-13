const numbers = [99, 44, 6, 2, 1, 5, 63, 87, 283, 4, 0];
function selectionSort(arr) {
	const length = arr.length;
	for (let i = 0; i < length; i++) {
		let minIndex = i;
		let temp = arr[i];
		for (let j = i + 1; j < length; j++) {
			if (arr[j] < arr[minIndex]) {
				minIndex = j;
			}
		}
		arr[i] = arr[minIndex];
		arr[minIndex] = temp;
	}
	return arr;
}

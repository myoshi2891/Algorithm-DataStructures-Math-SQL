// add a method remove() to the linked list that deletes a node to the specified index.
class Node {
	constructor(val) {
		this.val = val;
		this.next = null;
		this.prev = null;
	}
}

class DoublyLinkedList {
	// constructor(val) {
	// 	this.head = {
	// 		val: val,
	// 		next: null,
	// 		prev: null,
	// 	};
	// 	this.tail = this.head;
	// 	this.length = 1;
	// }

	constructor() {
		this.head = null;
		this.tail = null;
		this.length = 0;
	}

	push(val) {
		const newNode = new Node(val);
		if (this.length === 0) {
			this.head = newNode;
			this.tail = newNode;
		} else {
			this.tail.next = newNode;
			newNode.prev = this.tail;
			this.tail = newNode;
		}

		this.length++;
		return this;
	}

	pop() {
		if (!this.head) return undefined;
		let poppedNode = this.tail;
		if (this.length === 1) {
			this.head = null;
			this.tail = null;
		} else {
			this.tail = poppedNode.prev;
			this.tail.next = null;
			poppedNode.prev = null;
		}
		this.length--;
		return poppedNode;
	}

	shift() {
		if (this.length === 0) return undefined;
		let shiftedNode = this.head;
		if (this.length === 1) {
			this.head = null;
			this.tail = null;
		} else {
			this.head = shiftedNode.next;
			this.head.prev = null;
			shiftedNode.next = null;
		}
		this.length--;
		return shiftedNode;
	}

	unshift(val) {
		let newNode = new Node(val);
		if (this.length === 0) {
			this.head = newNode;
			this.tail = newNode;
		} else {
			this.head.prev = newNode;
			newNode.next = this.head;
			this.head = newNode;
		}
		this.length++;
		return this;
	}

	get(index) {
		if (index < 0 || index >= this.length) return null;

		let count, current;
		if (index <= this.length / 2) {
			count = 0;
			current = this.head;
			while (count !== index) {
				current = current.next;
				count++;
			}
		} else {
			count = this.length - 1;
			current = this.tail;
			while (count !== index) {
				current = current.prev;
				count--;
			}
		}
		return current;
	}

	set(index, val) {
		let foundNode = this.get(index);
		if (foundNode !== null) {
			foundNode.val = val;
			return true;
		}
		return false;
	}

	insert(index, val) {
		if (index < 0 || index > this.length) return false;
		if (index === 0) return !!this.unshift(val);
		if (index === this.length) return !!this.push(val);

		let newNode = new Node(val);
		let beforeNode = this.get(index - 1);
		let afterNode = beforeNode.next;

		(beforeNode.next = newNode), (newNode.prev = beforeNode);
		(newNode.next = afterNode), (afterNode.prev = newNode);
		this.length++;
		return true;
	}

	remove(index) {
		if (index < 0 || index >= this.length) return undefined;
		if (index === 0) return this.shift();
		if (index === this.length - 1) return this.pop();
		let removedNode = this.get(index);
		let beforeNode = removedNode.prev;
		let afterNode = removedNode.next;

		beforeNode.next = afterNode;
		afterNode.prev = beforeNode;

		// removedNode.prev.next = removedNode.next;
		// removedNode.next.prev = removedNode.prev;
		removedNode.next = null;
		removedNode.prev = null;
		this.length--;
		return removedNode;
	}
	append(val) {
		const newNode = {
			val: val,
			next: null,
			prev: null,
		};
		newNode.prev = this.tail;
		this.tail.next = newNode;
		this.tail = newNode;
		this.length++;
		return this;
	}
	prepend(val) {
		const newNode = {
			val: val,
			next: null,
			prev: null,
		};
		newNode.next = this.head;
		this.head.prev = newNode;
		this.head = newNode;
		this.length++;
		return this;
	}
	printList() {
		const array = [];
		let currentNode = this.head;
		while (currentNode !== null) {
			array.push(currentNode.val);
			currentNode = currentNode.next;
		}
		return array;
	}
	// insert(index, val) {
	// 	//Check for proper parameters;
	// 	if (index >= this.length) {
	// 		return this.append(val);
	// 	}

	// 	const newNode = {
	// 		val,
	// 		next: null,
	// 		prev: null,
	// 	};
	// 	const leader = this.traverseToIndex(index - 1);
	// 	const follower = leader.next;
	// 	leader.next = newNode;
	// 	newNode.prev = leader;
	// 	newNode.next = follower;
	// 	follower.prev = newNode;
	// 	this.length++;
	// 	console.log(this);
	// 	return this.printList();
	// }
	traverseToIndex(index) {
		//Check parameters
		let counter = 0;
		let currentNode = this.head;
		while (counter !== index) {
			currentNode = currentNode.next;
			counter++;
		}
		return currentNode;
	}
	// remove(index) {
	// 	// Check Parameters
	// 	const leader = this.traverseToIndex(index - 1);
	// 	const unwantedNode = leader.next;
	// 	leader.next = unwantedNode.next;
	// 	this.length--;
	// 	return this.printList();
	// }
}

let myLinkedList = new DoublyLinkedList();

myLinkedList.push("test")
myLinkedList.push("1")
myLinkedList.push("23")
// console.log(myLinkedList.pop())
// console.log(myLinkedList.unshift(21))
// console.log(myLinkedList)
// console.log(myLinkedList.set(2, "tester"))
// console.log(myLinkedList.unshift("start"))
console.log(myLinkedList.insert(2, "insertion"))
console.log(myLinkedList)
console.log(myLinkedList.remove(2))
console.log(myLinkedList)
// console.log(myLinkedList)

// myLinkedList.append(5);
// myLinkedList.append(16);
// myLinkedList.prepend(1);
// console.log(myLinkedList);

// myLinkedList.insert(1, 99);
// // myLinkedList.insert(20, 88);
// console.log(myLinkedList.printList());

// myLinkedList.remove(1);
// // myLinkedList.remove(2);
// console.log(myLinkedList.printList());

// add a method remove() to the linked list that deletes a node to the specified index.
class Node {
	constructor(value) {
		this.value = value;
		this.next = null;
	}
}

class LinkedList {
	constructor(value) {
		this.head = new Node(value);
		this.tail = this.head;
		this.length = 1;
	}

	printList() {
		const array = [];
		let currentNode = this.head;
		while (currentNode !== null) {
			array.push(currentNode.value);
			currentNode = currentNode.next;
		}
		return array;
	}

	print() {
		let arr = [];
		let current = this.head;
		while (current) {
			arr.push(current.value);
			current = current.next;
		}
		console.log(arr);
	}

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

	// traverse() {
	// 	let current = this.head;
	// 	while (current) {
	// 		console.log(current.val);
	// 		current = current.next;
	// 	}
	// }

	append(value) {
		const newNode = new Node(value);
		this.tail.next = newNode;
		this.tail = newNode;
		this.length++;
		return this;
	}

	prepend(value) {
		const newNode = new Node(value);
		newNode.next = this.head;
		this.head = newNode;
		this.length++;
		return this;
	}

	pop() {
		if (!this.head) return undefined;
		let current = this.head;
		let newTail = current;
		while (current.next) {
			newTail = current;
			current = current.next;
		}
		this.tail = newTail;
		this.tail.next = null;
		this.length--;
		if (this.length === 0) {
			this.head = null;
			this.tail = null;
		}
		return current;
	}
	shift() {
		if (!this.head) return undefined;
		let currentHead = this.head;
		this.head = currentHead.next;
		this.length--;
		if (this.length === 0) {
			this.tail = null;
		}
		return currentHead;
	}

	unshift(val) {
		let newNode = new Node(val);
		if (!this.head) {
			this.head = this.tail = newNode;
		} else {
			newNode.next = this.head;
			this.head = newNode;
		}
		this.length++;
		return this;
	}

	get(index) {
		if (index < 0 || index >= this.length) return null;
		let counter = 0;
		let current = this.head;
		while (counter !== index) {
			current = current.next;
			counter++;
		}
		return current;
	}

	set(index, value) {
		let foundNode = this.get(index);
		if (foundNode) {
			foundNode.value = value;
			return true;
		}
		return false;
	}

	insert(index, value) {
		// solution 1
		//Check for proper parameters;
		// if (index >= this.length) {
		// 	return this.append(value);
		// }
		// if (index < 0) {
		// 	return this.prepend(value);
		// }
		// const newNode = new Node(value);
		// const leader = this.traverseToIndex(index - 1);
		// const holdingPointer = leader.next;
		// leader.next = newNode;
		// newNode.next = holdingPointer;
		// this.length++;
		// return this.printList();

		// solution 2
		if (index < 0 || index > this.length) return false;
		if (index === this.length) return !!this.append(value);
		if (index === 0) return !!this.unshift(value);

		let newNode = new Node(value);
		let prev = this.get(index - 1);
		let temp = prev.next;
		// the other way
		// newNode.next = prev.next;
		prev.next = newNode;
		newNode.next = temp;
		this.length++;
		return true;
	}

	remove(index) {
		// solution 1
		// const leader = this.traverseToIndex(index - 1);
		// const unwantedNode = leader.next;
		// leader.next = unwantedNode.next;
		// this.length--;
		// return this.printList();

		// solution 2
		if (index < 0 || index >= this.length) return undefined;
		if (index === 0) return this.shift();
		if (index === this.length - 1) return this.pop();

		let prevNode = this.get(index - 1);
		let removed = prevNode.next;
		prevNode.next = removed.next;
		this.length--;
		return removed;
	}
	reverse() {
		// solution 1
		// if (!this.head.next) {
		// 	return this.head;
		// }
		// let first = this.head;
		// this.tail = this.head;
		// let second = first.next;
		// while (second) {
		// 	const temp = second.next;
		// 	second.next = first;
		// 	first = second;
		// 	second = temp;
		// 	console.log("temp", temp);
		// }
		// this.head.next = null;
		// this.head = first;
		// return this;

		// solution 2
		let node = this.head;
		this.head = this.tail;
		this.tail = node;
		let next;
		let prev = null;

		for (let i = 0; i < this.length; i++) {
			next = node.next;
			node.next = prev;
			prev = node;
			node = next;
		}
		return this;
	}
}

let myLinkedList = new LinkedList(10);
myLinkedList.append(5);
myLinkedList.append(16);
myLinkedList.prepend(1);
// console.log(myLinkedList.printList());

// myLinkedList.insert(20, 88);
// myLinkedList.remove(2);
// myLinkedList.remove(2);
// console.log(myLinkedList.printList());
// myLinkedList.reverse();
// myLinkedList.shift();
// console.log(myLinkedList.printList());
myLinkedList.unshift("test");
console.log(myLinkedList.insert(2, 99));
// console.log(myLinkedList.printList());

// console.log(myLinkedList.pop());
// console.log(myLinkedList.remove(0));
// console.log(myLinkedList.remove(1));
// console.log(myLinkedList.remove(0));
// console.log(myLinkedList.pop());
// console.log(myLinkedList.get(5));
// myLinkedList.insert(3, 99);

// console.log(myLinkedList.set(5, "!!!"));
// console.log(myLinkedList.get(5));
// console.log(myLinkedList.printList());
// console.log(myLinkedList);
myLinkedList.print();
myLinkedList.reverse();
myLinkedList.print();

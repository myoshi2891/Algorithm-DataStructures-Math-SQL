// add a method remove() to the linked list that deletes a node to the specified index.

class LinkedList {
	constructor(value) {
		this.head = {
			value: value,
			next: null,
		};
		this.tail = this.head;
		this.length = 1;
	}
	append(value) {
		const newNode = {
			value: value,
			next: null,
		};
		this.tail.next = newNode;
		this.tail = newNode;
		this.length++;
		return this;
	}
	prepend(value) {
		const newNode = {
			value: value,
			next: null,
		};
		newNode.next = this.head;
		this.head = newNode;
		this.length++;
		return this;
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
	insert(index, value) {
		//Check for proper parameters;
		if (index >= this.length) {
			return this.append(value);
		}

		const newNode = {
			value,
			next: null,
		};
		const leader = this.traverseToIndex(index - 1);
		const holdingPointer = leader.next;
		leader.next = newNode;
		newNode.next = holdingPointer;
		this.length++;
		return this.printList();
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
	remove(index) {
		// Check Parameters
		const leader = this.traverseToIndex(index - 1);
		const unwantedNode = leader.next;
		leader.next = unwantedNode.next;
		this.length--;
		return this.printList();
	}
	reverse() {
		if (!this.head.next) {
			return this.head;
		}

		let first = this.head;
		this.tail = this.head;
		let second = first.next;

		while (second) {
			console.log(
				"----------------------------------------------------------------"
			);
			console.log("first", first);
			console.log("second", second);
			console.log(
				"----------------------------------------------------------------"
			);
			const temp = second.next;
			second.next = first;
			first = second;
			second = temp;
			console.log("temp", temp);
		}
		console.log(first);

		this.head.next = null;
		this.head = first;
		return this;
	}
}

let myLinkedList = new LinkedList(10);
myLinkedList.append(5);
myLinkedList.append(16);
myLinkedList.prepend(1);
// console.log(myLinkedList.printList());

myLinkedList.insert(2, 99);
myLinkedList.insert(20, 88);
myLinkedList.remove(2);
myLinkedList.remove(2);
console.log(myLinkedList.printList());
myLinkedList.reverse();
console.log(myLinkedList.printList());

class Graph {
	constructor() {
		this.adjacencyList = {};
	}

	addVertex(vertex) {
		if (!this.adjacencyList[vertex]) {
			this.adjacencyList[vertex] = [];
		}
	}

	addEdge(vertex1, vertex2) {
		this.adjacencyList[vertex1].push(vertex2);
		this.adjacencyList[vertex2].push(vertex1);
	}

	removeEdge(vertex1, vertex2) {
		this.adjacencyList[vertex1] = this.adjacencyList[vertex1].filter(
			v => v !== vertex2
		);
		this.adjacencyList[vertex2] = this.adjacencyList[vertex2].filter(
			v => v !== vertex1
		);
	}

	removeVertex(vertex) {
		while (this.adjacencyList[vertex].length) {
			const adjacencyVertex = this.adjacencyList[vertex].pop();
			this.removeEdge(adjacencyVertex, vertex);
		}
		delete this.adjacencyList[vertex];
	}
}

const g = new Graph();
g.addVertex('Tokyo');
g.addVertex('NewYork');
g.addVertex('LA');

g.addEdge('Tokyo', 'NewYork');
g.addEdge('Tokyo', 'LA');
console.log(g);

// g.removeEdge('Tokyo', 'NewYork');
g.removeVertex('LA');
console.log(g);

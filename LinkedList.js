'use strict';

export default class LinkedList {
	constructor() {
		this.head = null;
	}


	insertFirst(item) {
		this.head = new _Node(item, this.head);
	}


	insertBefore(item, key) {
		if(this.head === null) {
			this.insertFirst(item)
		}

		let prev = this.head;
		let current = this.head;

		while(current !== null && current.value !== key) {
			prev = current;
			current = current.next;
		}

		if (current === null) {
			return null;
		}

		prev.next = new _Node(item, current);
	}


	insertAfter(item, key) {
		let current = this.find(key);
		let temp = current.next;
		current.next = new _Node(item, temp);
	}


	insertAt(item, index) {
		if(index === 0) {
			this.insertFirst(item);
		}

		if(this.head === null) {
			return null;
		}

		let current = this.head;
		let prev = this.head;
		let count = 0;

		while(current !== null && count !== index) {
			prev = current;
			current = current.next;
			count++;
		}

		if (current === null) {
			throw new Error(`There are only ${count} elements in the list`);
		}

		prev.next = new _Node(item, current);
	}


	insertLast(item) {
		if(this.head === null) {
			this.insertFirst(item);
		} else {
			let iterNode = this.head;
			while(iterNode.next !== null) {
				iterNode = iterNode.next;
			}
			iterNode.next = new _Node(item, null);
		}
	}


	find(item) {
		if(this.head === null) {
			return null;
		}
		let iter = this.head;
		while(iter.value !== item) {
			if(iter.next === null) {
				return null;
			}
			iter = iter.next;
		}
		return iter;
	}


	remove(item) {
		if(this.head === null) {
			return null;
		}
		let prev = this.head;
		let iter = this.head;

		while(iter !== null && iter.value !== item) {
			prev = iter;
			iter = iter.next;
		}
		if(iter === null) {
			return null;
		}
		prev.next = iter.next;
	}
}



class _Node {
	constructor(value, next) {
		this.value = value;
		this.next = next;
	}
}
class TreeNode {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.left = null;
        this.right = null;
    }
}

export default class BinarySearchTree {
    constructor(limit = Infinity, direction = 'right') {
        this.root = null;
        this.limit = limit;
        this.direction = direction;
        this.size = 0;
    }


    insert(key, value) {
        const newNode = new TreeNode(key, value);
        let insertionFlag = true;

        if (!this.root) {
            this.root = newNode;
            this.size++;
        } else {
            let current = this.root;
            let parent;

            while (current) {
                parent = current;
                if (key < current.key) {
                    current = current.left;
                } else if (key > current.key) {
                    current = current.right;
                } else {
                    insertionFlag = false;

                    if (current.value !== value) {
                        current.value = value;
                    }

                    return;
                }
            }

            if (insertionFlag) {
                if (key < parent.key) {
                    parent.left = newNode;
                } else {
                    parent.right = newNode;
                }

                this.size++;
            }

        }
    }

    _removeExcessNodes() {
        const stack = [];
        let current = this.root;

        while (current || stack.length > 0) {
            while (current) {
                stack.push(current);
                current = current.left;
            }

            current = stack.pop();

            if (this.direction === 'left') {
                this._removeNodeLeft(current);
            } else if (this.direction === 'right') {
                this._removeNodeRight(current);
            }

            current = current.right;
        }
    }

    removeOldestNode() {
        if (!this.root) return null;

        let parent = null;
        let current = this.root;
        let direction = this.direction === 'left' ? 'left' : 'right';

        // Traverse to the most left or most right node depending on direction
        while (current[direction]) {
            parent = current;
            current = current[direction];
        }

        // Remove the node
        if (parent) {
            parent[direction] = current[direction === 'left' ? 'right' : 'left'];
        } else {
            // The root is the oldest node
            this.root = this.root[direction === 'left' ? 'right' : 'left'];
        }

        this.size--;
        return current;
    }

    remove(key) {
        this.root = this._removeNode(this.root, key);
    }

    _removeNode(node, key) {
        let current = node;
        let parent = null;

        while (current) {
            if (key < current.key) {
                parent = current;
                current = current.left;
            } else if (key > current.key) {
                parent = current;
                current = current.right;
            } else {
                if (current.key === key) {
                    if (!current.left) {
                        // Case 2: Node has only right child
                        if (parent) {
                            if (parent.left === current) {
                                parent.left = current.right;
                            } else {
                                parent.right = current.right;
                            }
                        } else {
                            this.root = current.right;
                        }
                    } else if (!current.right) {
                        // Case 3: Node has only left child
                        if (parent) {
                            if (parent.left === current) {
                                parent.left = current.left;
                            } else {
                                parent.right = current.left;
                            }
                        } else {
                            this.root = current.left;
                        }
                    } else {
                        // Case 4: Node has both left and right children
                        // Find the minimum value in the right subtree
                        let minNode = current.right;
                        let minParent = current;

                        while (minNode.left) {
                            minParent = minNode;
                            minNode = minNode.left;
                        }

                        // Replace the current node's key and value with the minimum node's key and value
                        current.key = minNode.key;
                        current.value = minNode.value;

                        // Remove the minimum node
                        if (minParent.left === minNode) {
                            minParent.left = minNode.right;
                        } else {
                            minParent.right = minNode.right;
                        }
                    }

                    this.size--;
                    break;
                } else {
                    break;
                }
            }
        }
        return node;
    }

    countNodes() {
        const countSubtreeNodes = (node) => {
            if (!node) {
                return 0;
            }
            return 1 + countSubtreeNodes(node.left) + countSubtreeNodes(node.right);
        };
        return countSubtreeNodes(this.root);
    }

    toArray() {
        const result = [];
        const stack = [];
        let current = this.root;

        while (current || stack.length > 0) {
            while (current) {
                stack.push(current);
                current = current.right; 
            }

            current = stack.pop();
            result.push([current.key, current.value]);
            current = current.left; 
        }

        return result; 
    }

}

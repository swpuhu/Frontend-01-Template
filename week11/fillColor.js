var sortedListToBST = function (head) {
    if (!head) return null;
    const findMid = (l) => {
        let fast = slow = l
        while (fast && fast.next) {
            prev = slow;
            slow = slow.next;
            fast = fast.next.next;
        }
        if (prev) {
            prev.next = null;
        }
        return slow;
    }

    const help = (list) => {
        if (!list) return null;
        let mid = findMid(list);
        let node = new TreeNode(mid.val);
        if (list === mid) return node;
        node.left = help(list);
        node.right = help(mid.next);
        return node;
    }

    return help(head);
};

function TreeNode (val) {
    this.val = val;
    this.left = this.right = null;
}
function ListNode (val) {
    this.val = val;
    this.next = null;
}
function arrayToLinkedList(array) {
    let  d = p = new ListNode();
    for (let i = 0; i < array.length; i++) {
        p.next = new ListNode(array[i]);
        p = p.next;
    }
    return d.next;
}

let list = arrayToLinkedList([-10, -3, 0, 5, 9]);
console.log(list);
let res = sortedListToBST(list);
console.log(res);




// https://leetcode.cn/problems/lru-cache/description/?envType=study-plan-v2&envId=baidu-2023-fall-sprint

/*
 * 请你设计并实现一个满足  LRU (最近最少使用) 缓存 约束的数据结构。
 * 实现 LRUCache 类：
 * LRUCache(int capacity) 以 正整数 作为容量 capacity 初始化 LRU 缓存
 * int get(int key) 如果关键字 key 存在于缓存中，则返回关键字的值，否则返回 -1 。
 * void put(int key, int value) 如果关键字 key 已经存在，则变更其数据值 value ；如果不存在，
 * 则向缓存中插入该组 key-value 。如果插入操作导致关键字数量超过 capacity ，则应该 逐出 最久未使用的关键字。
 * 函数 get 和 put 必须以 O(1) 的平均时间复杂度运行。
 * 示例：
 * 
 * 输入
 * ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]
 * [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
 * 输出
 * [null, null, null, 1, null, -1, null, -1, 3, 4]
 * 
 * 解释
 * LRUCache lRUCache = new LRUCache(2);
 * lRUCache.put(1, 1); // 缓存是 {1=1}
 * lRUCache.put(2, 2); // 缓存是 {1=1, 2=2}
 * lRUCache.get(1);    // 返回 1
 * lRUCache.put(3, 3); // 该操作会使得关键字 2 作废，缓存是 {1=1, 3=3}
 * lRUCache.get(2);    // 返回 -1 (未找到)
 * lRUCache.put(4, 4); // 该操作会使得关键字 1 作废，缓存是 {4=4, 3=3}
 * lRUCache.get(1);    // 返回 -1 (未找到)
 * lRUCache.get(3);    // 返回 3
 * lRUCache.get(4);    // 返回 4
 * /

 

/** 
 * 题目要求获取与删除都是O(1)的复杂度所以使用双向链表
 * 1.使用双向链表保存结构
 * 2.使用头、尾 指针进行插入或者删除节点
 * 
 */

function insertNode(link, node) {
    //头尾指针 link 
    if (!link.first) {
        //lru中没有任何节点时
        link.first = node;
        link.last = node;
        return;
    }
    //之前有节点放到最后 
    //为什么放到最后？
    //因为lru是保持旧节点在尾部，新节点在头部的结构
    //每次重新取会将老节点删除，再将该及节点插入到头部。
    //此方案设计是，将没有访问的节点放到双向链表的first指针处
    //将经常访问的节点放到last处.
    //由于是双向链表 在头部插入在尾部删除，效果相同。
    const last = link.last;
    node.prev = link.last;
    last.next = node;
    link.last = node;
}

function removeNode(link, node) {
    if (node.prev) {
        node.prev.next = node.next;
    } else {
        link.first = node.next;
    }

    if (node.next) {
        node.next.prev = node.prev;
    } else {
        link.last = node.prev;
    }

}


/**
 * @param {number} capacity
 */
var LRUCache = function(capacity) {
    this.state = {
        map: new Map(),
        link: {
            first: null,
            last: null,
        },
    }
    this.capacity = capacity;
};

/** 
 * @param {number} key
 * @return {number}
 */
LRUCache.prototype.get = function(key) {
    const { map } = this.state;
    if (map.has(key)) {
        const result = map.get(key);
        this.put(result.key, result.value);
        return result.value;
    } else {
        return -1;
    }
};


/** 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
LRUCache.prototype.put = function(key, value) {
    const { map, link } = this.state;
    const {capacity} = this;
    const node = {
        prev: null,
        next: null,
        key,
        value,
    };
    insertNode(link, node);

    if (map.has(key)) {
        // 删除旧的 node
        removeNode(link, map.get(key))
    }

    map.set(key, node);
    // 超出限制，删除第一个
    if (map.size > capacity) {
        map.delete(link.first.key)
        removeNode(link, link.first);
    }
};

/**
 * Your LRUCache object will be instantiated and called as such:
 * var obj = new LRUCache(capacity)
 * var param_1 = obj.get(key)
 * obj.put(key,value)
 */ 
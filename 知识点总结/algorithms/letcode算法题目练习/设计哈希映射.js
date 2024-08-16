// https://leetcode-cn.com/problems/design-hashmap/
// 不使用任何内建的哈希表库设计一个哈希映射（HashMap）。

// 实现 MyHashMap 类：

// MyHashMap() 用空映射初始化对象
// void put(int key, int value) 向 HashMap 插入一个键值对 (key, value) 。如果 key 已经存在于映射中，则更新其对应的值 value 。
// int get(int key) 返回特定的 key 所映射的 value ；如果映射中不包含 key 的映射，返回 -1 。
// void remove(key) 如果映射中存在 key 的映射，则移除 key 和它所对应的 value 。
//  

// 示例：

// 输入：
// ["MyHashMap", "put", "put", "get", "get", "put", "get", "remove", "get"]
// [[], [1, 1], [2, 2], [1], [3], [2, 1], [2], [2], [2]]
// 输出：
// [null, null, null, 1, -1, null, 1, null, -1]

// 解释：
// MyHashMap myHashMap = new MyHashMap();
// myHashMap.put(1, 1); // myHashMap 现在为 [[1,1]]
// myHashMap.put(2, 2); // myHashMap 现在为 [[1,1], [2,2]]
// myHashMap.get(1);    // 返回 1 ，myHashMap 现在为 [[1,1], [2,2]]
// myHashMap.get(3);    // 返回 -1（未找到），myHashMap 现在为 [[1,1], [2,2]]
// myHashMap.put(2, 1); // myHashMap 现在为 [[1,1], [2,1]]（更新已有的值）
// myHashMap.get(2);    // 返回 1 ，myHashMap 现在为 [[1,1], [2,1]]
// myHashMap.remove(2); // 删除键为 2 的数据，myHashMap 现在为 [[1,1]]
// myHashMap.get(2);    // 返回 -1（未找到），myHashMap 现在为 [[1,1]]
//  

// 提示：

// 0 <= key, value <= 106
// 最多调用 104 次 put、get 和 remove 方法
//  

// 进阶：你能否不使用内置的 HashMap 库解决此问题？
// 此题主要考察哈希表的实现原理，主要知道哈希表是通过 数组 结构来实现，并且为了解决 hash 冲突 ，所以也使用了 链表 来共同实现即可完成该题。

// 解题思路
// 首先自定义一个基础数字，用于计算出一个 hash 值即可。
// 再定义一个足够使用的数组用于存放映射值即可。
// 剩下的工作，无论是新增映射，修改映射，删除映射，操作流程都如下：
// 3.1 首先计算出该映射的 hash 值
// 3.2 再遍历该数组位上的链表
// 3.3 执行对应功能即可



/**
 * Initialize your data structure here.
 */
 var MyHashMap = function() {
    this.base = 500
    this.data = new Array(this.base).fill(0).map(()=>new Array())

};

/**
 * value will always be non-negative. 
 * @param {number} key 
 * @param {number} value
 * @return {void}
 */
MyHashMap.prototype.put = function(key, value) {
    let h = this.hash(key)
    for(const it of this.data[h]){
        if(it[0]===key){
            it[1]=value
        }
        
    }
    this.data[h].push([key,value])
};

/**
 * Returns the value to which the specified key is mapped, or -1 if this map contains no mapping for the key 
 * @param {number} key
 * @return {number}
 */
MyHashMap.prototype.get = function(key) {
    let h = this.hash(key)
    for(const it of this.data[h]){
        if(it[0]===key){
            return it[1]
        }
    }
    return -1
};

/**
 * Removes the mapping of the specified value key if this map contains a mapping for the key 
 * @param {number} key
 * @return {void}
 */
MyHashMap.prototype.remove = function(key) {
    let h = this.hash(key)
    for(const it of this.data[h]){
        if(it[0]===key){
           let index = this.data[h].indexOf(it);
            this.data[h].splice(index, 1);
        }
    }
};
MyHashMap.prototype.hash = function (key){
    return key % this.base
}


//带注释的相同题解 
/**
 * 要实现哈希表映射，首先我们需要用到数组来存储映射关系
 * 但是，为了解决 hash 函数的返回值重复，导致多个数据映射在数组的同一索引位置
 * 我们就需要使用链表来存储对应键值对，便于查找
 */
 var MyHashMap = function() {
    // 声明一个基本的数字，用于取余操作，计算出一个 hash 值
    this.base = 1000;
    // 声明一个足够大的空间来存储映射关系
    this.data = new Array(this.base).fill(0).map(i => new Array());
};

/**
 * 该函数只需注意，若是数组某位上的 key 不存在，直接追加数据
 * 若是 key 已存在，修改对应 key 的值即可
 */
MyHashMap.prototype.put = function(key, value) {
    let hash = key % this.base;
    // 遍历该数组某索引上的链表
    for(let i of this.data[hash]){
        // 若已存在该 key，执行更新 value 的操作即可
        if(i[0] === key) return i[1] = value;
    }
    // 该链表上无此 key，新增一个链表值即可
    this.data[hash].push([key, value]);
};

/**
 * 在数组某位上查找链表，找到就返回对应值
 * 否则，返回 -1
 */
MyHashMap.prototype.get = function(key) {
    let hash = key % this.base;
    for(let i of this.data[hash]){
        if(i[0] === key) return i[1];
    }
    return -1;
};

/**
 * 在数组某位遍历链表，找到就删除即可
 */
MyHashMap.prototype.remove = function(key) {
    let hash = key % this.base;
    for(let i of this.data[hash]){
        if(i[0] === key) {
            let index = this.data[hash].indexOf(i);
            this.data[hash].splice(index, 1);
        }
    }
};

/**
 * Your MyHashMap object will be instantiated and called as such:
 * var obj = new MyHashMap()
 * obj.put(key,value)
 * var param_2 = obj.get(key)
 * obj.remove(key)
 */

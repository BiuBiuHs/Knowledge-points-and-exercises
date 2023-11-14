const is = (val1, val2) => {
    if (val1 === val2) {
    // 处理 +0 === -0
        return val1 !== 0 || 1 / val1 === 1 / val2;
    }else {
        // 处理NaN，利用NaN !== NaN 的特型
        return val1 !== val1 && val2 !== val2
    }
};

// 首先看一下对于NaN的处理，处理NaN的是建立在val1 !== val2的基础之上，若是传入的是两个不同的数据且存在不为NaN的数据时，
// 那么x !== x恒等为false，那么is函数最终返回false，若是都为NaN时，在JS中有且仅有NaN !== NaN返回true

// 看一下对于+0 === -0的处理逻辑，由于在严格相等中+0 === -0返回的是true，因为进入if逻辑中包含前述情况，
// 由于Object.is属于对严格相等的功能补全，进入此逻辑中的其他情况都会返回true，因此return逻辑主要是处理+0、-0


//在react的useEffect 中 对于deps（依赖项的比较就是使用object.is） 
//object.is 的比较是浅比较 
//对于值类型，对比值是否相同 ，
//对于引用类型，则比较是否是形同的引用地址 ，相同则返回true 不同则为false 
// eg:object.is(window,window)
// eg:object.is({}},{}})
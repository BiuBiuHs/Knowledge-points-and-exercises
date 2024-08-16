function shuffle(arr) {
    let i = arr.length;
    while (--i) {
        //使用random * 下标i 
        //再随机呼唤元素的位置 即可完成数组乱序
        let j = Math.floor(Math.random() * i);
        [arr[j], arr[i]] = [arr[i], arr[j]];
    }
}

/**
 * @param {number[]} arr
 */
function bubbleSort(arr) {
    for(let i = 0; i < arr.length; i++) {
      let swaped = false;
      //从 i + 1开始 每次用当前的值去遍历数组 比较大小
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] > arr[j]) {
            //换位
          [arr[i], arr[j]] = [arr[j], arr[i]];
          swaped = true;
        }
      }
      if(!swaped) {
        break;
      }
    }
  }
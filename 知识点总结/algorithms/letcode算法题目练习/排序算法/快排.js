function quickSort(arr, l=0, r=arr.length-1) {
    if (l>r) return;
    const pIndex=partition(arr,l,r);
    quickSort(arr,l,pIndex-1);
    quickSort(arr,pIndex+1,r);
  }
  
  function partition(arr,l,r) {
    /**
     * 取出第一个元素x  ，所有的元素都与x元素比较 
     * 所有大于 x元素的值放到右边
     * 小于等于 x元素的值位置不变 
     * 当不满足条件l<= r时 
     * 此时将x元素与右指针的位置的元素互换
     * 此时形成的数组 一定是 左侧小于等于x元素 的区间，x右侧都是大于等于x的数值区间 
     */
    
    //注意此处
    //一定要使用下标 index 方便后续的元素换位
    const pivot=l++;
    
    while (l<=r) {
      if (arr[l]<=arr[pivot])
        l++;
      else {
        [arr[l], arr[r]]=[arr[r], arr[l]];
        r--;
      }
    }
    [arr[pivot], arr[r]]=[arr[r], arr[pivot]];
    return r;
  }
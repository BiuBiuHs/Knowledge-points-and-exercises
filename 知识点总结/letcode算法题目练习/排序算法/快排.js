function quickSort(arr, l=0, r=arr.length-1) {
    if (l>r) return;
    const pIndex=partition(arr,l,r);
    quickSort(arr,l,pIndex-1);
    quickSort(arr,pIndex+1,r);
  }
  
  function partition(arr,l,r) {
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
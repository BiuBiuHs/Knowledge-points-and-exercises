function insertSort (arr) {

    for(var i = 1; i < arr.length; i++) {
        for(var j = 0; j < i ; j++){
            const insert =  arr[i]
            const current = arr[j]
            if(current > insert) {
                [arr[i],arr[j]] = [arr[j],arr[i]]
            }
        }
    }
    return arr
}
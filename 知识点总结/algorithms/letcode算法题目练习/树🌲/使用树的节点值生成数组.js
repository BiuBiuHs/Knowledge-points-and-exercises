var treeNode = [
    {
        title:'华东',
        fieldId:"A",
        children:[
            {
                title:'天津',
                fieldId:"B",
            },
            {
                title:'北京',
                fieldId:"B",
            },
        ]
    },
    {
        title:'华南',
        fieldId:"A",
        children:[
            {
                title:'上海',
                fieldId:"B",
            },
            {
                title:'深圳',
                fieldId:"B",
            },
        ]
    },
]


var getNodeStr = (nodeArr,prevstr='')=>{
    if(!nodeArr) return prevstr
    return  nodeArr.map(item=>{
        var {title} = item
       return  getNodeStr(item?.children,prevstr + title)
    })
}

getNodeStr(treeNode)



function baseFlatten(array, depth, isStrict,result) {
    var index = -1,
        length = array.length;
    result || (result = []);
    while (++index < length) {
      var value = array[index];
      if (depth > 0 && Object.prototype.toString.call(value)=== '[object Array]' ) {
        if (depth > 1) {
          // Recursively flatten arrays (susceptible to call stack limits).
          baseFlatten(value, depth - 1,  isStrict, result);
        } else {
          arrayPush(result, value);
        }
      } else if (!isStrict) {
        result[result.length] = value;
      }
    }
    return result;
  }

  var deepArr = [
    [
        "华东天津",
        "华东北京"
    ],
    [
        "华南上海",
        "华南深圳"
    ]
]
baseFlatten(deepArr,Infinity)

  
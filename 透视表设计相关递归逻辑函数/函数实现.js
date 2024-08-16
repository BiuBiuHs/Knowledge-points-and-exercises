// 函数实现

// headerArr
/**
 * 
 * 
 */



//深度遍历生成树
var DFS = (obj,columnFieldIdArr)=>{
    //终止条件 列维度key数组为空
    if(!columnFieldIdArr.length) return 
    const shadowArr = [...columnFieldIdArr]
    //取出首个列维度
    let parentKey = shadowArr.shift()
    //todo 如果在obj中取不到值是否需要处理待定
    // if(!obj[parentKey]) return 
    //根据列维度的key与对应的数据（obj）构造表头数据结构
    let parentObj = {
        originName:obj[parentKey]??'置空节点',
        unique_id:parentKey,
    }
    if(columnFieldIdArr.length === 1)return parentObj
    //dfs 由于最后结束条件返回undefined 所以最后一级的表头数据结构的children中可能存在undefined
    parentObj.children = [DFS(obj,shadowArr)]
    
    return parentObj

}


DFS(  {
    A:'华北',
    B:'北京',
    C:'海淀'
},['A','B','C',])




[ //行维度
{
    "originName": "置空节点",
    "unique_id": "A",
    "children": [
        {
            "originName": "置空节点",
            "unique_id": "B",
            "children": [
                {
                    "originName": "置空节点",
                    "unique_id": "C",
                    "children": [
                        {
                            "originName": "商品数量",
                            "unique_id": "E"
                        },
                        {
                            "originName": "日期",
                            "unique_id": "F"
                        }
                    ],
                    "dataMeasureIndex": 18
                }
            ]
        }
    ]
}]

var columnFieldIdArr = ['A','B','C']

var testNode =[
   
    {
        "originName": "华北",
        "unique_id": "A",
        "children": [
            {
                "originName": "北京",
                "unique_id": "B",
                "children": [
                    {
                        "originName": "海淀",
                        "unique_id": "C",
                    }
                ]
            },
            {
                "originName": "天津",
                "unique_id": "B",
                "children": [
                    {
                        "originName": "武清",
                        "unique_id": "C",
                    }
                ]
            }
        ]
    },
    {
        "originName": "置空节点",
        "unique_id": "A",
        "children": [
            {
                "originName": "置空节点",
                "unique_id": "B",
                "children": [
                    {
                        "originName": "总和",
                        "unique_id": "C",
                    }
                ]
            }
        ]
    }
]

var testMeasres = [
    {
        originName:'销售金额',
        unique_id:'N',
    },
    {
        originName:'销售数量',
        unique_id:'M'
    },
]

//合并指标数据结构与index
var mergeMeasureWithIndex = (measureObjArr,index,needMergeIndex)=>{
   return  measureObjArr.map(item=>({
        ...item,
        unique_id:needMergeIndex?item.unique_id +index:item.unique_id
    }))
}

/**
 * 
 * @param {*} nodeArr 生成的表头节点数据结构数组
 * @param {*} lastColumnFieldIdKey  最后一个列维度的 unique_Id
 * @param {*} hasColumnTotal 是否有组内列合计
 */
let leafNodeCount = 0
var addMeasureSubNode = ({nodeArr,lastColumnFieldIdKey,measureObj,hasinnerColumnTotal,needMergeIndex=false})=>{
    //处理组内合计逻辑
    const fieldIdkeyArr = nodeArr.map(item => item.unique_id)
    const fieldValArr = nodeArr.map(item=>item.originName)
    //处理总和列 不能push 合计
    if(hasinnerColumnTotal && fieldIdkeyArr.includes(lastColumnFieldIdKey)&& !fieldValArr.includes('总和') ){
        nodeArr.push({
                    originName:'合计',
                    unique_id:lastColumnFieldIdKey,
                    children:[]
                })
    }

    return nodeArr.map((item)=>{
        const {unique_id}= item
        //不是最后一级的cell 
        if(unique_id!==lastColumnFieldIdKey){
            return {
                ...item,
                children:addMeasureSubNode({
                    nodeArr: item.children,
                    lastColumnFieldIdKey,
                    measureObj,
                    hasinnerColumnTotal,
                    needMergeIndex
                })
            }
           
        }else{
            leafNodeCount++
            return {
                ...item,
                children:mergeMeasureWithIndex(measureObj,leafNodeCount,needMergeIndex),
                dataMeasureIndex:leafNodeCount
            }
        }

    })
}


//给处理好的只包含列维度数据的表头中 添加指标数据结构 与组内合计数据结构
addMeasureSubNode({
    nodeArr:testNode,lastColumnFieldIdKey:'C',measureObj:testMeasres,hasinnerColumnTotal:true,needMergeIndex:true
})

const emptyNode =  [{
    "originName": "置空节点",
    "unique_id": "A",
    "children": [
        {
            "originName": "置空节点",
            "unique_id": "B",
            "children": [
                {
                    "originName": "置空节点",
                    "unique_id": "C",
                    "children": [
                        null
                    ]
                }
            ]
        }
    ]
}]

const testFieldObj= [
    {
        originName:'商品数量',
        unique_id:'E'
    },{
        originName:'日期',
        unique_id:'F'
    }
]

//处理行维度 
addMeasureSubNode({
    nodeArr:emptyNode,lastColumnFieldIdKey:'C',measureObj:testFieldObj,hasinnerColumnTotal:false,needMergeIndex:false
})





//合并表头数据结构
var mergeHeaderItem = ({headerItemObj,columnFieldIdArr=[],nextItem={},deepth=1})=> {
    if (deepth >= columnFieldIdArr.length) return;
    //按列维度的顺序 遍历每个层级下的children数组
    let subChildrenArr = headerItemObj?.children;
    //获取某个层级的所有子节点的值
    let NameArr = subChildrenArr?.map((item) => item.originName);
    //获取下条数据的第I个key的值
    let curColumnFieldVal = nextItem[columnFieldIdArr[deepth]];
    //说明已经有相同的值已经保存在节点数中并且不是最后一个层级的表头
    if (NameArr && NameArr.includes(curColumnFieldVal) && deepth !== columnFieldIdArr.length - 1) {
      const sameNameItemIndex = subChildrenArr.findIndex((item) => item.originName === curColumnFieldVal);
      //生成新的子节点数组
      const newSubItem = mergeHeaderItem({
        headerItemObj: subChildrenArr[sameNameItemIndex],
        columnFieldIdArr,
        nextItem,
        deepth: ++deepth
      });
      console.log(newSubItem, 'newSubItem');
      headerItemObj.children.splice(sameNameItemIndex, 1, newSubItem);
    }
    //如果name不存在 说明没有生成过结构
    if (!NameArr.includes(curColumnFieldVal)) {
      //根据deepth切割，生成新的二级表头数据结构
      let columnsKeyIdBydeepth = columnFieldIdArr.slice(deepth)
      //根据深度生成结构
      let curNodeItem = DFS(nextItem,columnsKeyIdBydeepth)
      headerItemObj.children.push(curNodeItem);
    }
  
    return headerItemObj;
  }




//初次生成只包含列维度的表头
var formatHeader = (headerArr = [],columnFieldIdArr) => {
    //只记录是否生成过 第一层表头的key值
    const fieldValMap = {};
   return  headerArr.reduce((headerTree, nextItem) => {
      //todo 列维度可能不存在 逻辑处理
      //取出第一个列维度的unique_id
      const [firstColumnIdKey] = columnFieldIdArr;
      const firstColumnVal = nextItem[firstColumnIdKey];
      //如果存在说明处理过表头结构 ，需要取出上一次处理过的结构对表头数据进行合并
      if (fieldValMap[firstColumnVal]) {
       const newSubNode =  mergeHeaderItem({
        headerItemObj:headerTree[(fieldValMap[firstColumnVal] - 1)], 
        columnFieldIdArr, 
        nextItem
       });
       console.log(2222233333);
       //分割一下
       headerTree.splice([fieldValMap[firstColumnVal]-1],1,newSubNode)
      } else {
        const Node = DFS(nextItem, columnFieldIdArr);
        console.log(Node,'node');
        //放到表头数组中
        headerTree.push(Node);
        //用维度值来记录 index 例如{北京:1}
        fieldValMap[firstColumnVal] = headerTree.length ;
      }
      return headerTree
    }, []);
   
  };

var columnFieldIdArr = ['A','B','C']

//
var headerArr = [
    {
        A:'华北',
        B:'北京',
        C:'海淀'
    },
    {
        A:'华北',
        B:'天津',
        C:'武清'
    },
    {
        A:'华东',
        B:'江苏',
        C:'无锡'
    },
    {
        A:'华东',
        B:'上海',
        C:'浦东'
    },
    {
        A:'华东',
        B:'浙江',
        C:'杭州'
    },
    {
        A:'华南',
        B:'福建',
        C:'厦门'
    },
    {
        A:'华南',
        B:'广东',
        C:'佛山'
    },
    {
        A:'华南',
        B:'深圳',
        C:'南山'
    },

]

//初次生成只包含列维度的表头
formatHeader(headerArr,columnFieldIdArr)


//生成最后的列总和 数据结构
var getOuterColumnTotal = (columnFieldIdArr)=>{
    const lastColumnFieldIdKey = [...columnFieldIdArr].pop()
    //没有配置列维度
    if(!columnFieldIdArr.length) return {
        originName:'总和',
        unique_id:lastColumnFieldIdKey,
        children:[]
    }
    const columnTotalObj = {[lastColumnFieldIdKey]:'总和'}
    return DFS(columnTotalObj,columnFieldIdArr)

}

getOuterColumnTotal(['A','B','C'])

//根据列的层级获取第N级的路径
const getPath = (number,str = '')=>{
    if(number <= 0)return 'children'
    number--
    str += getPath(number,'children.');
    return str
}

//'children.children.children' 
// getPath(3)



var a = {
    "originName": "华北",
    "unique_id": "A",
    "children": [
        {
            "originName": "北京",
            "unique_id": "B",
            "children": [
                {
                    "originName": "海淀",
                    "unique_id": "C",
                    "children": [
                        null
                    ]
                },
                
            ]
        },
    ]
}

mergeHeaderItem({
    headerItemObj:a,
    columnFieldIdArr:['A','B','C'],
    nextItem:{
        A:'华北',
        B:'河北',
        C:'廊坊',
    },
})


DFS(  {
    A:'华北',
    B:'北京',
    C:'海淀'
},['A','B','C',])



//使用数结构中每个数节点的值 来拼装一直到叶子结点的字符串
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


//使用数结构中每个数节点的值 来拼装一直到叶子结点的字符串
var getNodeStr = (nodeArr,prevstr='')=>{
    if(!nodeArr) return prevstr
    return  nodeArr.map(item=>{
        var {title} = item
       return  getNodeStr(item?.children,`${prevstr}${prevstr?'*':''}${title}`)
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

  

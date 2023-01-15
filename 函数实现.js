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
        children:[]
    }
    //dfs 由于最后结束条件返回undefined 所以最后一级的表头数据结构的children中可能存在undefined
    parentObj.children.push(DFS(obj,shadowArr))
    return parentObj

}


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
                        "children": [
                            null
                        ]
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
                        "children": [
                            null
                        ]
                    }
                ]
            }
        ]
    },
    {
        "originName": "华东",
        "unique_id": "A",
        "children": [
            {
                "originName": "江苏",
                "unique_id": "B",
                "children": [
                    {
                        "originName": "无锡",
                        "unique_id": "C",
                        "children": [
                            null
                        ]
                    }
                ]
            },
            {
                "originName": "上海",
                "unique_id": "B",
                "children": [
                    {
                        "originName": "浦东",
                        "unique_id": "C",
                        "children": [
                            null
                        ]
                    }
                ]
            },
            {
                "originName": "浙江",
                "unique_id": "B",
                "children": [
                    {
                        "originName": "杭州",
                        "unique_id": "C",
                        "children": [
                            null
                        ]
                    }
                ]
            }
        ]
    },
    {
        "originName": "华南",
        "unique_id": "A",
        "children": [
            {
                "originName": "福建",
                "unique_id": "B",
                "children": [
                    {
                        "originName": "厦门",
                        "unique_id": "C",
                        "children": [
                            null
                        ]
                    }
                ]
            },
            {
                "originName": "广东",
                "unique_id": "B",
                "children": [
                    {
                        "originName": "佛山",
                        "unique_id": "C",
                        "children": [
                            null
                        ]
                    }
                ]
            },
            {
                "originName": "深圳",
                "unique_id": "B",
                "children": [
                    {
                        "originName": "南山",
                        "unique_id": "C",
                        "children": [
                            null
                        ]
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



/**
 * 
 * @param {*} nodeArr 生成的表头节点数据结构数组
 * @param {*} lastColumnFieldIdKey  最后一个列维度的 unique_Id
 * @param {*} hasColumnTotal 是否有组内列合计
 */
var addTargetSubNode = ({nodeArr,lastColumnFieldIdKey,measureObj,hasColumnTotal})=>{
    //处理合计逻辑
    const fieldIdkeyArr = nodeArr.map(item => item.unique_id)
    if(hasColumnTotal && fieldIdkeyArr.includes(lastColumnFieldIdKey) ){
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
                children:addTargetSubNode({
                    nodeArr: item.children,
                    lastColumnFieldIdKey,
                    measureObj,
                    hasColumnTotal,
                })
            }
           
        }else{
            return {
                ...item,
                children:measureObj
            }
        }

    })


}

addTargetSubNode({
    nodeArr:testNode,lastColumnFieldIdKey:'C',measureObj:testMeasres,hasColumnTotal:true,
})



//合并表头数据结构
var mergeHeaderItem = ({headerItemObj,columnFieldIdArr=[],nextItem={},deepth=1})=> {
    if (deepth >= columnFieldIdArr.length) return;
    //按列维度的顺序 遍历每个层级下的children数组
    let subChildrenArr = headerItemObj.children;
    //获取某个层级的所有子节点的值
    let NameArr = subChildrenArr.map((item) => item.originName);
    //获取下条数据的第I个key的值
    let curColumnFieldVal = nextItem[columnFieldIdArr[deepth]];
    //说明已经有相同的值已经保存在节点数中并且不是最后一个层级的表头
    if (NameArr.includes(curColumnFieldVal) && deepth !== columnFieldIdArr.length - 1) {
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



formatHeader(headerArr,columnFieldIdArr)



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
                {
                    "originName": "朝阳",
                    "unique_id": "C",
                    "children": []
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
                    "children": []
                }
            ]
        }
    ]
}

mergeHeaderItem({
    headerItemObj:a,
    columnFieldIdArr:['A','B','C'],
    nextItem:{
        A:'华北',
        B:'北京',
        C:'通州',
    },
})


DFS(  {
    A:'华北',
    B:'北京',
    C:'海淀'
},['A','B','C',"D"])


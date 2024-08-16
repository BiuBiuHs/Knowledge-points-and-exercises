// 1.生成表头

// 假设表头数据结构为
// 表头有单元格自动合并逻辑 ,但是需要正确处理层级与合并数据，层级展示为children
[
  {
    formatterName: '华北',
    originName: 华北,
    unique_id: 'xxxxxx',
    //配置可能有N级
    children: [
      {
        formatterName: '北京', //（时间 可能需要格式化 天、周、月、年）
        originName: '北京', //（时间值 2022-06-09 00:00:00）
        unique_id:'xxxx',
        children: [
        //假设目前有三层 （也就是两个列维度，带指标层级
        //todo	需要按照顺序放入配置的指标的中文名称
            {
                formatterName:'指标1',
                originName:'指标1',
                unique_id:'xxxxxx',
                //对应的表格数据的列 key值转换 
                columnKey:'指标对应的 unique_id' + '当前parent的顺序index + lastCount'

            },
            {
                formatterName:'指标2',
                originName:'指标2',
                unique_id:'xxxxxx',
                //对应的表格数据的列 key值转换 
                columnKey:'指标对应的 unique_id' + '当前parent的顺序index  + lastCount'
            }
        ]
      },
      //其他最后一个维度的值
      {
        formatterName: '天津', //（时间 可能需要格式化 天、周、月、年）
        originName: '天津', //（时间值 2022-06-09 00:00:00）
        unique_id:'xxxx',
        children: [
       
        //todo	需要按照顺序放入配置的指标的中文名称
            
        ]
      },
      //第一次生成表头的列维度时，根据是否设置了 列-组内合计 插入列合计 
      {
        formatterName:'合计',
        originName:'合计',
        children:[
            //放入指标配置
        ]
      }

      //后续可能还有其他兄弟节点 
    ]
  }
];

//table 数据
[
    {
        
        '行维度1':'value',
        '行维度2':'value',

        '指标1unique_id + index':'val',
        '指标2unique_id + index':'val',

        '指标1unique_id + index+1':'val',
        '指标2unique_id + index+1':'val',

        '指标1unique_id + index+2':'val',
        '指标2unique_id + index+2':'val',

        
    
    }
]
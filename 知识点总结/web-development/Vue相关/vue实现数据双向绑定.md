```

function Myvue(options={}){
// 将所有的属性挂载到$options身上
    this.$options=options;
     // 获取到data数据（Model）
    data=this._data=this.$options.data;

    observe(data)
}

function Observe (data){

    for (let key in data){
     // 递归 =》来实现深层的数据监听
        let val=data[key];
        observe(val)；
        Object.defineProperty(data,key,{
            enumerable:true;
            get(){
                return val;
            },
            set(newVal){
                if(val=newVal){
                    return
                }
                val=newVal;
                observe(newVal)  // 这里要把新设置的值也在添加一次数据劫持来实现深度响应,
            }
        })
    }
}
function observe(data){
    if(typeof data != "Object" ){return }
  return new Observe(data)
}
```

#### 简单实现

```
let data={}

let input=document.getElementById('input';);

Object.defineProperty(data,'key',{
    get(){
        return val;
    },
    set(newVal){
        input.value=newVal;
        this.value=value;
    }
})
input.onchange=function(e){
data.key=e.target.value;
}
```

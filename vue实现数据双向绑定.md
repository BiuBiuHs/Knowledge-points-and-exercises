```

function Myvue(options={}){
    this.$options=options;
    data=this._data=this.$options.data;

    observe(data)
}

function Observe (data){

    for (let key in data){
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
                observe(newVal)
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

### Axios

### 基本使用

```
Axios.method('url',{[...data],options)
  .then(function(res){})
  .catch(function(err){})
```

### 合并请求

```
this.$axios.all([请求1,请求2])
  .then(this.$axios.spread(function(res1,res2){
    })
  )
```

### 取消请求

const CancelToken = axios.CalcelToken;
const source = CancelToken.source();//创建标识 请求的源对象

      this.source=source;//将对象存储到组件
      
      cancelToken:source.token, //设置请求的options属性
      this.source.cancel();//取消之前的那个请求

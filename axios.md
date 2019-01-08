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

### 请求拦截器
```
import axios from 'axios' // axios引用
import store from '../../store' // store引用
const serivce = axios.create({ // 创建服务
  baseURL: 'http://test.api.rujiaowang.net', // 基础路径
  timeout: 5000 // 请求延时
})
--------------------- 
serivce.interceptors.request.use( // 请求拦截
  config => {
    if (store.getters.userToken) {
      config.headers['X-Token'] = store.getters.userToken
      config.headers['User-Type'] = store.getters.userType ? store.getters.userType : '' // 请求头中存放用户信息
      config.onUploadProgress = (progressEvent) => {
        var complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%'
        store.dispatch('setupLoadPercent', complete)
      }
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
```
### 响应拦截器
```
serivce.interceptors.response.use( //响应拦截，主要针对部分回掉数据状态码进行处理
  response => {
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

```

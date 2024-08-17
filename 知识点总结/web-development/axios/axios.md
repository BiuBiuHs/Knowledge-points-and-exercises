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

```
import axios from 'axios'
import Cookies from 'js-cookie'
 
let pending = [] //axios 请求数组
let CancelToken = axios.CancelToken //创建取消请求
 
let cancelPending = (config) => {
  pending.forEach((item, index) => {
    if (config) {
      if (item.UrlPath === config.url) { //通过判断url ，来辨别是否是同一请求 ，相同请求则 取消
        item.Cancel() // 取消请求
        pending.splice(index, 1) // 移除当前请求记录
      };
    } else {
      item.Cancel() // 取消请求
      pending.splice(index, 1) // 移除当前请求记录
    }
  })
}
 
// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 600000 // 请求超时时间
})
 
service.interceptors.request.use(
  config => {
    if (Cookies.get('Admin-Token')) { 
      config.headers['Authorization'] = Cookies.get('Admin-Token')//放入token
    }
    cancelPending(config) //调用上面的定义好的函数  取消重复的请求
    config.cancelToken = new CancelToken(res => {
    // 这个参数res 就是CancelToken构造函数里面 自带的取消请求的函数，调用该函数 即可取消请求
      pending.push({'UrlPath': config.url, 'Cancel': res})
    })
    return config
  },
  (error, response) => {
    console.log(error)
    console.log(response)
  }
)
 
service.interceptors.response.use(
  response => {
    cancelPending(response.config)
    return response.data
  }, error => {
    console.log(error)
    return Promise.reject(error)
  }
)
export default service

```

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


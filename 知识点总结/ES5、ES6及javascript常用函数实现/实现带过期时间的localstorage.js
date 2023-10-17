window.myLocalStorage = {
    getItem(key) {
      try {
        const {value, maxAge, createdAt} = JSON.parse(localStorage.getItem(key))
        
        //  获取时用现在时间- 创建时间 与设置的存在时间对比 是否能够返回正确的值
        if (maxAge !== undefined && Date.now() - createdAt >= maxAge) {
          this.removeItem(key)
          return null
        }
        
        return value
      } catch (e) {
        return null
      }    
    },
    
    setItem(key, value, maxAge) {
      const entry = {
        value,
        maxAge,
        createdAt: Date.now()
        //存储时+创建时间 
      }
      
      localStorage.setItem(key, JSON.stringify(entry))
    },
    
    removeItem(key) {
      return localStorage.removeItem(key)
    },
    
    clear() {
      localStorage.clear()
    }
  }
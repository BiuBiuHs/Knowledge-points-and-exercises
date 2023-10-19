
// please complete the implementation
class EventEmitter {
    constructor(){
      this.watcher =new Map()
    }
    subscribe(eventName, callback) {
      let watcher = this.watcher
      if(!watcher.has(eventName)){
        watcher.set(eventName,[callback])
      }else{
        watcher.set(eventName,[...watcher.get(eventName),callback])
      }
      return {
        release:function (){
           watcher.get(eventName).map((item,index) => {
            if (item == callback) {
              watcher.get(eventName).splice(index,1);
            } else {
              return item;
            }
          })
        }
      } 
    }
    
    emit(eventName, ...args) {
        const callbacks = this.watcher.get(eventName)
      if(callbacks.length){
        callbacks.map(item=>{
          return item.apply(this,args)
        })
      }
  
    }
  }
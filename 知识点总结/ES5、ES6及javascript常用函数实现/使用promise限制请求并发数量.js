// 要保证同时同时有pool个请求执行
function createRequest(tasks=[],pool){
    pool = pool || 5; //限制并发的数量
    let results = [];
    let running = 0; // 当前运行个数
    let resultsLength = tasks.length; // 用来判断最后的是否全部成功
    return new Promise((resolve,reject)=>{
        next();
        function next(){
            while(running < pool && tasks.length){ // 这个wile循环保证 一直有pool个请求在进行
            running++;
            let task = tasks.shift();
            task().then(result => {
                results.push(result);
            }).finally(()=>{
                running--;
                next();
            })
            }
            if(results.length === resultsLength) { // 全部执行结束
                resolve(results);
            }
        }
    })
}

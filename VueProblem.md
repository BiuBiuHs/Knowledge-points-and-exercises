#### Vue问题记录
 
 ##### 定时器 刷新 某个Vue属性 会导致某些问题,在接下对页面进行操作 或跳转时一定要将定时器清除。
 
 ```
  var funName1 = setTimeout(function(){
       return ;
   },1000);
  
    var funName2  = setInterval(function(){
        return fun2;
    },1000)
   
    //清除Timeout的定时器,传入id(创建定时器时会返回一个id)
    clearTimeout(funName1 );
   
    //清除Interval的定时器,传入id(创建定时器时会返回一个id)
    clearInterval(funName2  );
//也可以使用return值 来清除
setTimeout(function(){
  console.log("33");
  return 33;
},3000);
 clearTimeout(33);
 ```

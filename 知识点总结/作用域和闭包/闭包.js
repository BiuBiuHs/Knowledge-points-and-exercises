// 闭包就是能够读取其他函数内部变量的函数。

// 通俗的讲就是函数a的内部函数b，被函数a外部的一个变量引用的时候，就创建了一个闭包。

// 当我们需要在模块中定义一些变量，并希望这些变量一直保存在内存中但又不会 “污染” 全局的变量时，就可以用闭包来定义这个模块

//闭包中被外部引用的变量 会一直在内存中

// 它的最大用处有两个，一个是它可以读取函数内部的变量，另一个就是让这些变量的值始终保持在内存中。

//创建数组元素
var num = new Array();
for(var i=0; i<4; i++){
    //num[i] = 闭包;//闭包被调用了4次，就会生成4个独立的函数
    //每个函数内部有自己可以访问的个性化(差异)的信息
    num[i] = f1(i);
}
function f1(n){
     function f2(){
         alert(n);
     }
     return f2;
}
num[2]();  //2
num[1]();  //1
num[0]();  //0
num[3]();  //3

//练习题 
function test(){
    var arr = [];
    for(var i = 0; i < 10; i++){
        arr[i] = function(){
        console.log(i);
        }
    }
    return arr;
}
var myArr = test();
for(var j = 0;j<10;j++){
    myArr[j]();
}
//i 一直都是10

// 如果解决 
// 使用立即执行函数 固定i的值 

//解决
function test(){
    var arr = [];
    for(var i = 0; i < 10; i++){
       (function(j){
        arr[j] = function(){
            console.log(j);
            }
       }(i))
    }
    return arr;
}
var myArr = test();
for(var j = 0;j<10;j++){
    myArr[j]();
}

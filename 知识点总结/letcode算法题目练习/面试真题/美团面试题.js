//给定a.b.c 的字符串 让你访问一个对象的某个属性 算法如何实现

//递归
function getObjAttr(obj, str) {
  if (obj == undefined || !str) return obj;
  let strArr = str.split(".");
  let targetKey = strArr.shift();
  console.log(targetKey);
  return getObjAttr(obj[targetKey], strArr.join("."));
}

var res = getObjAttr({ a: { b: { c: 1 } } }, "a.b.c.d");
    

//迭代
function getObjAttr (obj,path) {
  if (obj == undefined || !path) return obj;
  const pathArr = path.split('.')
  while(pathArr.length){
    const curKey = pathArr.shift()
    if(typeof obj ==='object' && obj?.[curKey] ){
      obj = obj[curKey]
    }else{
      return undefined
    }
  }
  return obj
}
var res = getObjAttr({ a: { b: { c: 1 } } }, "a.b.c.d");
//给定a.b.c 的字符串 让你访问一个对象的某个属性 算法如何实现

function getObjAttr(obj, str) {
  if (obj == undefined || !str) return obj;
  let strArr = str.split(".");
  let targetKey = strArr.shift();
  console.log(targetKey);
  return getObjAttr(obj[targetKey], strArr.join("."));
}

var res = getObjAttr({ a: { b: { c: 1 } } }, "a.b.c.d");
    
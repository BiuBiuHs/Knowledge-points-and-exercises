/**
 * @param {any} object
 * @return {string}
 */

function stringifyNull(value) {
    return String(value);
}

function stringifyUndefined() {
    return stringifyNull(null);
}

function stringifyBoolean(value) {
    return String(value);
}

function stringifyNumber(value) {
    return String(value);
}

function stringifyString(value) {
    return '"' + value + '"';
}

function stringifyArray(arr) {
    return "[" + arr.map((v) => jsonStringify(v)).join(",") + "]"
}

function stringifyObject(obj) {
   let result = "{"
   Object.keys(obj).forEach((key, index) => {
       if (index > 0) {
           result += ","
       }
       result = result + '"' + key + '":';
       result = result + jsonStringify(obj[key])
   })
   result += "}"
   return result;
}

var jsonStringify = function(object) {
   const type = typeof object;
   if (object === null) {
       return stringifyNull(object)
   }
   if (Array.isArray(object)) {
       return stringifyArray(object);
   }

   switch(type) {
       case 'boolean':
           return stringifyBoolean(object);
       case 'number':
           return stringifyNumber(object);
       case 'string':
           return stringifyString(object);
       case 'undefined':
           return stringifyUndefined()
       case 'object':
           return stringifyObject(object)
       default:
           throw new Error('not support stringify type')
   }
};
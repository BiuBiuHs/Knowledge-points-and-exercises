// 实现 strStr() 函数。

// 给定一个 haystack 字符串和一个 needle 字符串，在 haystack 字符串中找出 needle 字符串出现的第一个位置 (从0开始)。如果不存在，则返回  -1。

// 示例 1:

// 输入: haystack = "hello", needle = "ll"
// 输出: 2
// 示例 2:

// 输入: haystack = "aaaaa", needle = "bba"
// 输出: -1
// 说明:

// 当 needle 是空字符串时，我们应当返回什么值呢？这是一个在面试中很好的问题。

// 对于本题而言，当 needle 是空字符串时我们应当返回 0 。这与C语言的 strstr() 以及 Java的 indexOf() 定义相符。


// 方法一.

        var strStr = function(haystack, needle) {
            if(needle.length>haystack.length) return -1;
            if(!needle.length) return 0;
            return haystack.indexOf(needle)
        }; 
// 方法二。

    var strStr = function(haystack, needle) {
    var needleLength = needle.length;

    if (needleLength == 0) {
        return 0;
    }

    if (haystack.length < needleLength) {
        return -1;
    }

    var first = needle[0];
    var tmpStr;
    for (let index = 0; index < haystack.length; index++) {
        const element = haystack[index];
        
        if (element == first) {
            var subStr = haystack.substr(index, needleLength);
            if (needle == subStr) {
                return index;
            }
        }
    }

    return -1;
};
// 方法三 kmp算法 （抄）。

        var strStr2 = function(haystack, needle) {
            var m = haystack.length, n = needle.length;
            if(!n) return 0;
            var next = kmpProcess(needle);
            for(var i = 0, j = 0; i < m;) {
                if(haystack[i] == needle[j]) { // 字符匹配，i和j都向前一步
                    i++, j++;
                }
                if(j == n) return i - j; // needle完全匹配上，返回匹配位置
                if(haystack[i] != needle[j]) { // 字符不匹配
                    if(j > 0) {
                        j = next[j - 1]; // 重置j
                    } else {
                        i++;
                    }
                    
                }
                
            }
            return -1;
        };

        var kmpProcess = function(needle) {
            var y = 0;
            var x = 1;
            var next = new Array(needle.length).fill(0);
            while (x < needle.length) {
                if (needle[x] == needle[y]) {
                    y++;
                    next[x] = y;
                    x++;
                } else if (y > 0) {
                    y = next[y - 1];
                } else {
                    next[x] = 0;
                    x++;
                }
            }
            return next;
        }
    console.log(strStr2("mississippi", "issip")); 

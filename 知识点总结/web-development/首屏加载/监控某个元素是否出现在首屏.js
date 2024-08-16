//一般使用intersectionObserver

var observer = new IntersectionObserver(callback[_, options]);


// callback
// 当元素可见比例超过指定阈值后，会调用一个回调函数，此回调函数接受两个参数：

// entries
// 一个IntersectionObserverEntry对象的数组，每个被触发的阈值，都或多或少与指定阈值有偏差。

// observer
// 被调用的IntersectionObserver实例。


// options 可选
// 一个可以用来配置 observer 实例的对象。如果options未指定，observer 实例默认使用文档视口作为 root，
// 并且没有 margin，阈值为 0%（意味着即使一像素的改变都会触发回调函数）。你可以指定以下配置：

// root
// 监听元素的祖先元素Element对象，其边界盒将被视作视口。目标在根的可见区域的任何不可见部分都会被视为不可见。

// rootMargin
// 一个在计算交叉值时添加至根的边界盒 (bounding_box (en-US)) 中的一组偏移量，类型为字符串 (string) ，
// 可以有效的缩小或扩大根的判定范围从而满足计算需要。语法大致和 CSS 中的margin 属性等同; 
// 可以参考 intersection root 和 root margin 来深入了解 margin 的工作原理及其语法。默认值是"0px 0px 0px 0px"。

// threshold
// 规定了一个监听目标与边界盒交叉区域的比例值，可以是一个具体的数值或是一组 0.0 到 1.0 之间的数组。
// 若指定值为 0.0，则意味着监听元素即使与根有 1 像素交叉，此元素也会被视为可见。若指定值为 1.0，
// 则意味着整个元素都在可见范围内时才算可见。可以参考阈值来深入了解阈值是如何使用的。阈值的默认值为 0.0。


// 一般是使用 observer实例 

IntersectionObserver.disconnect()
// 使 IntersectionObserver 对象停止监听目标。

IntersectionObserver.observe()
// 使 IntersectionObserver 开始监听一个目标元素。

IntersectionObserver.takeRecords()
// 返回所有观察目标的 IntersectionObserverEntry 对象数组。

IntersectionObserver.unobserve()


// IntersectionObserverEntry.isIntersecting (en-US) 
// 返回一个布尔值，如果目标元素与交叉区域观察者对象 (intersection observer) 的根相交，则返回 true .如果返回 true, 则 
// IntersectionObserverEntry 描述了变换到交叉时的状态; 如果返回 false, 那么可以由此判断，变换是从交叉状态到非交叉状态。

function intersectionCallback(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        intersectingCount += 1;
      } else {
        intersectingCount -= 1;
      }
    });
  }

const ob = new IntersectionObserver(intersectionCallback,{root:'xxxxx'})

//可以ob多个dom元素 此时 callback中的entries数组会有多个元素。
ob.observer('dom1')
ob.observer('dom2')
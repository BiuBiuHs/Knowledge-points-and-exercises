// 防抖（Debounce）和节流（Throttle）是两种常用的控制函数调用频率的技术，尤其在处理频繁触发的事件（如滚动、输入、窗口调整大小等）时非常有用。

// ### 防抖（Debounce）

// 防抖函数在事件触发后一定时间内不会再次触发，如果在这个时间内事件再次被触发，则重新计时。适用于输入框搜索等场景。

//简单实现版本 记住这个版本即可。
function debounce(func, delay) {
	let timeoutId;

	return function (...args) {
		const context = this;
		clearTimeout(timeoutId); // 清除之前的定时器
		timeoutId = setTimeout(() => {
			func.apply(context, args); // 在延迟后调用函数
		}, delay);
	};
}

// 示例使用
console.log(1);
const input = document.getElementById("input");
input.addEventListener(
	"input",
	debounce((event) => {
		console.log("Input value:", event.target.value);
	}, 300)
);

// ### 节流（Throttle）

// 节流函数限制一个函数在一定时间内只能执行一次。适用于处理滚动、窗口调整大小等频繁触发的事件。

function throttle(func, limit) {
	let lastFunc;
	let lastRan;

	return function (...args) {
		const context = this;

		if (!lastRan) {
			func.apply(context, args); // 立即执行
			lastRan = Date.now(); // 记录执行时间
		} else {
			clearTimeout(lastFunc); // 清除之前的定时器
			lastFunc = setTimeout(() => {
				if (Date.now() - lastRan >= limit) {
					func.apply(context, args); // 超过限制时间执行
					lastRan = Date.now(); // 更新上次执行时间
				}
			}, limit - (Date.now() - lastRan));
		}
	};
}

// 示例使用
window.addEventListener(
	"resize",
	throttle(() => {
		console.log("Window resized");
	}, 500)
);

// ### 总结

// - **防抖**：在事件停止触发后的指定时间内才会执行，适合处理输入框等场景。
// - **节流**：限制函数在一定时间内只执行一次，适合处理滚动、调整大小等频繁事件。

// 这两种技术都可以帮助提高性能，减少不必要的函数调用。

//复杂版本
//BFE.dev
//节流
function throttle(func, wait, option = { leading: true, trailing: true }) {
	var { leading, trailing } = option;
	var lastArgs = null;
	var timer = null;

	const setTimer = () => {
		if (lastArgs && trailing) {
			func.apply(this, lastArgs);
			lastArgs = null;
			timer = setTimeout(setTimer, wait);
		} else {
			timer = null;
		}
	};

	return function (...args) {
		if (!timer) {
			if (leading) {
				func.apply(this, args);
			}
			timer = setTimeout(setTimer, wait);
		} else {
			lastArgs = args;
		}
	};
}

//防抖
//每次输入都会清空上一个timer 开启一个新的timer  等到停止输入后指定的秒数后 出发callback
function debounce(func, wait, option = { leading: false, trailing: true }) {
	let timer = null;

	return function (...args) {
		let isInvoked = false;
		// if not cooling down and leading is true, invoke it right away
		if (timer === null && option.leading) {
			func.call(this, ...args);
			isInvoked = true;
		}

		// no matter what, timer needs to be reset
		window.clearTimeout(timer);
		timer = window.setTimeout(() => {
			if (option.trailing && !isInvoked) {
				func.call(this, ...args);
			}

			timer = null;
		}, wait);
	};
}

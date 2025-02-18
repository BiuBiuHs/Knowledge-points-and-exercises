function requestWrapper(request) {
	return new Promise((resolve, reject) => {
		// 模拟网络请求
		setTimeout(() => {
			resolve(request);
		}, Math.random() * 2000); // 随机延迟 0-2000 毫秒
	});
}

function concurrentRequest(requests, concurrency) {
	const results = [];
	const pendingRequests = new Set();

	function processNextRequest() {
		if (requests.length === 0 && pendingRequests.size === 0) {
			return;
		}

		while (requests.length > 0 && pendingRequests.size < concurrency) {
			const request = requests.shift();
			const promise = requestWrapper(request);

			pendingRequests.add(promise);

			promise
				.then((result) => {
					results.push(result);
					pendingRequests.delete(promise);
					processNextRequest();
				})
				.catch((error) => {
					pendingRequests.delete(promise);
					processNextRequest();
				});
		}
	}

	processNextRequest();

	return new Promise((resolve, reject) => {
		if (results.length === requests.length) {
			resolve(results);
		} else {
			const allPromises = Array.from(pendingRequests);
			Promise.all(allPromises)
				.then(() => {
					resolve(results);
				})
				.catch(reject);
		}
	});
}

// 示例用法
const requests = Array.from({ length: 10 }, (_, i) => `request ${i + 1}`);

concurrentRequest(requests, 3)
	.then((results) => {
		console.log("All requests completed:", results);
	})
	.catch((error) => {
		console.error("Error:", error);
	});

//另类实现
/**
 * @param {Function[]} functions
 * @param {number} n
 * @return {Function}
 */
var promisePool = async function (functions, n) {
	const queue = [...functions];
	async function wroker() {
		while (queue.length > 0) {
			await queue.shift()();
		}
	}
	await Promise.allSettled([...new Array(n)].map(wroker));
};

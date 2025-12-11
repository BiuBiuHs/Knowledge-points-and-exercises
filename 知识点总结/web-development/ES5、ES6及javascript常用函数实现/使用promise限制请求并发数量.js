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
// const requests = Array.from({ length: 10 }, (_, i) => `request ${i + 1}`);

// concurrentRequest(requests, 3)
// 	.then((results) => {
// 		console.log("All requests completed:", results);
// 	})
// 	.catch((error) => {
// 		console.error("Error:", error);
// 	});

// ==================== 简单版本实现 ====================

/**
 * 简单版本1：基于 Promise.race 的并发控制
 * @param {Array} tasks - 任务数组（返回 Promise 的函数）
 * @param {number} limit - 并发限制数量
 * @returns {Promise} 返回所有任务结果
 */
async function concurrentControl(tasks, limit) {
	const results = [];
	const executing = [];

	for (const [index, task] of tasks.entries()) {
		// 执行当前任务
		const promise = Promise.resolve().then(() => task());
		results[index] = promise;
		console.log(results, "results in for loop");
		// 如果限制了并发数量
		if (limit <= tasks.length) {
			// 任务完成后从 executing 中移除
			const clean = promise.then(() => {
				executing.splice(executing.indexOf(clean), 1);
			});
			executing.push(clean);

			// 如果正在执行的任务数量达到限制，等待其中一个完成
			if (executing.length >= limit) {
				await Promise.race(executing);
			}
		}
	}
	console.log(results, "results");

	// 等待所有任务完成
	return Promise.all(results);
}

/**
 * 简单版本2：基于 Worker 的并发控制（最简洁）
 * @param {Array} tasks - 任务数组（返回 Promise 的函数）
 * @param {number} limit - 并发限制数量
 * @returns {Promise} 返回所有任务结果
 */
async function simpleConcurrent(tasks, limit) {
	const queue = [...tasks];
	const results = [];

	// 创建 worker 函数
	async function worker() {
		while (queue.length > 0) {
			const task = queue.shift();
			const result = await task();
			results.push(result);
		}
	}

	// 创建固定数量的 worker 并发执行
	const workers = Array(limit)
		.fill(0)
		.map(() => worker());
	await Promise.all(workers);

	return results;
}

// ==================== 测试示例 ====================

// 测试 concurrentControl
async function testConcurrentControl() {
	console.log("\n=== 测试 concurrentControl ===");

	// 模拟异步任务
	const createTask = (id, delay) => () => {
		console.log(`任务 ${id} 开始`);
		return new Promise((resolve) => {
			setTimeout(() => {
				console.log(`任务 ${id} 完成`);
				resolve(`结果 ${id}`);
			}, delay);
		});
	};

	// 创建8个任务
	const tasks = [
		createTask(1, 1000),
		createTask(2, 500),
		createTask(3, 800),
		createTask(4, 300),
		createTask(5, 1200),
		createTask(6, 600),
		createTask(7, 900),
		createTask(8, 400),
	];

	// 限制并发数为 3
	const results = await concurrentControl(tasks, 3);
	console.log("所有任务完成:", results);
}

// 测试 simpleConcurrent
async function testSimpleConcurrent() {
	console.log("\n=== 测试 simpleConcurrent ===");

	const createTask = (id, delay) => () => {
		console.log(`任务 ${id} 开始`);
		return new Promise((resolve) => {
			setTimeout(() => {
				console.log(`任务 ${id} 完成`);
				resolve(`结果 ${id}`);
			}, delay);
		});
	};

	const tasks = [
		createTask(1, 1000),
		createTask(2, 500),
		createTask(3, 800),
		createTask(4, 300),
		createTask(5, 1200),
	];

	const results = await simpleConcurrent(tasks, 2);
	console.log("所有任务完成:", results);
}

// 取消注释下面的代码来运行测试
testConcurrentControl();
// testSimpleConcurrent();

// worker.js - 独立的 Worker 文件示例

/**
 * Worker 监听主线程的消息
 */
self.onmessage = function (e) {
	console.log("Worker 收到消息:", e.data);

	const { type, data } = e.data;

	switch (type) {
		case "calculate":
			// 大量计算
			const result = calculateSum(data.max);
			self.postMessage({
				type: "calculate",
				result,
				message: "计算完成！",
			});
			break;

		default:
			self.postMessage({
				type: "error",
				message: `未知的任务类型: ${type}`,
			});
	}
};

/**
 * 计算 1 到 max 的和
 */
function calculateSum(max) {
	let sum = 0;
	for (let i = 1; i <= max; i++) {
		sum += i;
	}
	return sum;
}

/**
 * 错误处理
 */
self.onerror = function (error) {
	console.error("Worker 错误:", error);
	self.postMessage({
		type: "error",
		message: error.message,
	});
};

// Worker 启动日志
console.log("✅ Worker 已启动，等待任务...");

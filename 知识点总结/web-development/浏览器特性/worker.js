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

		case "processData":
			// 带进度的数据处理
			processDataWithProgress(data.items);
			break;

		case "processImage":
			// 图片处理
			processImageData(data.imageData, data.width, data.height);
			break;

		case "performanceTest":
			// 性能测试
			const startTime = performance.now();
			calculateSum(data.max);
			const endTime = performance.now();
			self.postMessage({
				type: "performanceTest",
				time: endTime - startTime,
			});
			break;

		case "multiWorker":
			// 多 Worker 任务
			const taskResult = processChunk(data.start, data.end);
			self.postMessage({
				type: "multiWorker",
				result: taskResult,
				workerId: data.workerId,
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
 * 带进度反馈的数据处理
 */
function processDataWithProgress(items) {
	const total = items.length;
	let processed = 0;

	for (let i = 0; i < total; i++) {
		// 模拟复杂处理
		let temp = items[i];
		for (let j = 0; j < 10000; j++) {
			temp = Math.sqrt(temp * j + 1);
		}

		processed++;

		// 每处理 10% 发送一次进度
		if (processed % Math.floor(total / 10) === 0 || processed === total) {
			const progress = Math.floor((processed / total) * 100);
			self.postMessage({
				type: "progress",
				progress,
				processed,
				total,
			});
		}
	}

	self.postMessage({
		type: "complete",
		message: `处理完成！共处理 ${total} 项数据`,
	});
}

/**
 * 图片灰度处理
 */
function processImageData(imageData, width, height) {
	const data = new Uint8ClampedArray(imageData);

	for (let i = 0; i < data.length; i += 4) {
		// 计算灰度值（RGB 平均值）
		const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
		data[i] = avg; // R
		data[i + 1] = avg; // G
		data[i + 2] = avg; // B
		// data[i + 3] 是 alpha 通道，保持不变
	}

	// 使用 Transferable Objects 转移所有权，提高性能
	self.postMessage(
		{
			type: "imageProcessed",
			imageData: data.buffer,
			width,
			height,
		},
		[data.buffer]
	);
}

/**
 * 处理数据块（用于多 Worker 协同）
 */
function processChunk(start, end) {
	let sum = 0;
	for (let i = start; i <= end; i++) {
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

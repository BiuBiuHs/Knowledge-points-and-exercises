const { spawn } = require("child_process");
const path = require("path");

console.log("🚀 启动所有跨域示例服务...\n");

// 服务配置
const services = [
	{
		name: "JSONP API Server",
		script: path.join(__dirname, "JSONP", "server.js"),
		port: 3100,
		url: "http://127.0.0.1:3100/api/user?uid=123&callback=test",
	},
	{
		name: "JSONP Static Server",
		script: path.join(__dirname, "JSONP", "static-server.js"),
		port: 8080,
		url: "http://127.0.0.1:8080",
	},
	{
		name: "CORS API Server",
		script: path.join(__dirname, "CORS", "server.js"),
		port: 3200,
		url: "http://127.0.0.1:3200/api/info",
	},
	{
		name: "CORS Static Server",
		script: path.join(__dirname, "CORS", "static-server.js"),
		port: 8081,
		url: "http://127.0.0.1:8081",
	},
];

const processes = [];

// 启动所有服务
services.forEach((service, index) => {
	setTimeout(() => {
		console.log(`📡 启动 ${service.name}...`);

		const child = spawn("node", [service.script], {
			stdio: "pipe",
			cwd: path.dirname(service.script),
		});

		child.stdout.on("data", (data) => {
			const output = data.toString().trim();
			if (output) {
				console.log(`[${service.name}] ${output}`);
			}
		});

		child.stderr.on("data", (data) => {
			console.error(`[${service.name}] ERROR: ${data.toString().trim()}`);
		});

		child.on("close", (code) => {
			console.log(`[${service.name}] 进程退出，代码: ${code}`);
		});

		processes.push({ child, service });
	}, index * 1000); // 每秒启动一个服务，避免端口冲突
});

// 延迟显示访问信息
setTimeout(() => {
	console.log("\n✅ 所有服务启动完成！\n");
	console.log("📋 访问地址：");
	console.log("┌─────────────────────────────────────────────────────────┐");
	console.log("│  JSONP 示例                                             │");
	console.log("│  前端页面: http://127.0.0.1:8080                       │");
	console.log("│  API 接口: http://127.0.0.1:3100/api/user              │");
	console.log("├─────────────────────────────────────────────────────────┤");
	console.log("│  CORS 示例                                              │");
	console.log("│  前端页面: http://127.0.0.1:8081                       │");
	console.log("│  API 接口: http://127.0.0.1:3200/api/info              │");
	console.log("└─────────────────────────────────────────────────────────┘");
	console.log("\n💡 提示：按 Ctrl+C 可以停止所有服务\n");
}, 5000);

// 优雅关闭所有进程
process.on("SIGINT", () => {
	console.log("\n🛑 正在关闭所有服务...");

	processes.forEach(({ child, service }) => {
		console.log(`📴 关闭 ${service.name}`);
		child.kill("SIGINT");
	});

	setTimeout(() => {
		console.log("✅ 所有服务已关闭");
		process.exit(0);
	}, 2000);
});

// 防止进程意外退出
process.on("uncaughtException", (err) => {
	console.error("未捕获的异常:", err);
});

process.on("unhandledRejection", (reason, promise) => {
	console.error("未处理的 Promise 拒绝:", reason);
});

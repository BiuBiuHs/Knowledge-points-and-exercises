const http = require("http");
const url = require("url");

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
	const parsed = url.parse(req.url, true);

	console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

	// 处理 /api/user 接口
	if (parsed.pathname === "/api/user" && req.method === "GET") {
		const callback = parsed.query.callback;
		const uid = parsed.query.uid || "0";
		console.log(callback, "callback in server");

		// 验证回调函数名的安全性
		if (!callback || !/^[a-zA-Z_$][0-9a-zA-Z_$\.]*$/.test(callback)) {
			res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
			return res.end("Invalid callback parameter");
		}

		// 模拟用户数据
		const userData = {
			uid: uid,
			name: "Alice Wang",
			email: "alice@example.com",
			timestamp: Date.now(),
			message: "JSONP 请求成功！",
		};

		// 返回 JSONP 格式的响应
		const jsonpResponse = `${callback}(${JSON.stringify(userData)})`;

		res.writeHead(200, {
			"Content-Type": "application/javascript; charset=utf-8",
			// 可选：添加一些额外的响应头
			"X-Powered-By": "Node.js JSONP Server",
		});

		return res.end(jsonpResponse);
	}

	// 处理其他请求 - 返回 404
	res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
	res.end("Not Found");
});

// 启动服务器
const PORT = 3100;
server.listen(PORT, "127.0.0.1", () => {
	console.log(`JSONP 服务器已启动`);
	console.log(`地址: http://127.0.0.1:${PORT}`);
	console.log(
		`API 端点: http://127.0.0.1:${PORT}/api/user?uid=123&callback=yourCallback`
	);
	console.log("按 Ctrl+C 停止服务器");
});

// 优雅关闭
process.on("SIGINT", () => {
	console.log("\n正在关闭服务器...");
	server.close(() => {
		console.log("服务器已关闭");
		process.exit(0);
	});
});

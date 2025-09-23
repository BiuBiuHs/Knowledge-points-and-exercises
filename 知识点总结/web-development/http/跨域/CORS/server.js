const http = require("http");
const url = require("url");

// 设置 CORS 头
function setCORSHeaders(res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, OPTIONS"
	);
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	res.setHeader("Access-Control-Max-Age", "86400"); // 预检请求缓存24小时
}

// 读取请求体
function getRequestBody(req) {
	return new Promise((resolve) => {
		let body = "";
		req.on("data", (chunk) => {
			body += chunk.toString();
		});
		req.on("end", () => {
			resolve(body);
		});
	});
}

// 创建 HTTP 服务器
const server = http.createServer(async (req, res) => {
	const parsed = url.parse(req.url, true);

	console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

	// 处理预检请求 (OPTIONS)
	if (req.method === "OPTIONS") {
		setCORSHeaders(res);
		res.writeHead(204);
		return res.end();
	}

	// 处理 GET /api/info
	if (parsed.pathname === "/api/info" && req.method === "GET") {
		setCORSHeaders(res);

		const responseData = {
			message: "CORS GET 请求成功！",
			method: "GET",
			timestamp: Date.now(),
			userAgent: req.headers["user-agent"] || "Unknown",
			origin: req.headers.origin || "None",
		};

		res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
		return res.end(JSON.stringify(responseData));
	}

	// 处理 POST /api/echo
	if (parsed.pathname === "/api/echo" && req.method === "POST") {
		setCORSHeaders(res);

		try {
			const body = await getRequestBody(req);
			let requestData = null;

			if (body) {
				try {
					requestData = JSON.parse(body);
				} catch (e) {
					requestData = { raw: body };
				}
			}

			const responseData = {
				message: "CORS POST 请求成功！",
				method: "POST",
				timestamp: Date.now(),
				youSent: requestData,
				origin: req.headers.origin || "None",
			};

			res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
			return res.end(JSON.stringify(responseData));
		} catch (error) {
			res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
			return res.end(JSON.stringify({ error: "服务器内部错误" }));
		}
	}

	// 处理其他请求 - 返回 404
	setCORSHeaders(res);
	res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
	res.end(JSON.stringify({ error: "接口不存在" }));
});

// 启动服务器
const PORT = 3200;
server.listen(PORT, "127.0.0.1", () => {
	console.log(`CORS 服务器已启动`);
	console.log(`地址: http://127.0.0.1:${PORT}`);
	console.log(`GET 端点: http://127.0.0.1:${PORT}/api/info`);
	console.log(`POST 端点: http://127.0.0.1:${PORT}/api/echo`);
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

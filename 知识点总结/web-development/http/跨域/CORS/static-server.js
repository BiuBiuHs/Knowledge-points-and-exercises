const http = require("http");
const fs = require("fs");
const path = require("path");

// MIME 类型映射
const mimeTypes = {
	".html": "text/html",
	".js": "text/javascript",
	".css": "text/css",
	".json": "application/json",
	".png": "image/png",
	".jpg": "image/jpg",
	".gif": "image/gif",
	".ico": "image/x-icon",
	".svg": "image/svg+xml",
};

// 获取文件的 MIME 类型
function getMimeType(filePath) {
	const ext = path.extname(filePath).toLowerCase();
	return mimeTypes[ext] || "application/octet-stream";
}

// 创建静态文件服务器
const server = http.createServer((req, res) => {
	console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

	// 解析请求的 URL
	let filePath = req.url === "/" ? "/frontend.html" : req.url;
	filePath = path.join(__dirname, filePath);

	// 检查文件是否存在
	fs.access(filePath, fs.constants.F_OK, (err) => {
		if (err) {
			// 文件不存在，返回 404
			res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
			res.end(`
        <!DOCTYPE html>
        <html>
        <head><title>404 - 文件未找到</title></head>
        <body>
          <h1>404 - 文件未找到</h1>
          <p>请求的文件 ${req.url} 不存在</p>
          <a href="/">返回首页</a>
        </body>
        </html>
      `);
			return;
		}

		// 读取并返回文件
		fs.readFile(filePath, (err, data) => {
			if (err) {
				res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
				res.end(`
          <!DOCTYPE html>
          <html>
          <head><title>500 - 服务器错误</title></head>
          <body>
            <h1>500 - 服务器内部错误</h1>
            <p>无法读取文件: ${err.message}</p>
          </body>
          </html>
        `);
				return;
			}

			// 设置正确的 Content-Type
			const mimeType = getMimeType(filePath);
			res.writeHead(200, { "Content-Type": mimeType });
			res.end(data);
		});
	});
});

// 启动静态文件服务器
const PORT = 8081;
server.listen(PORT, "127.0.0.1", () => {
	console.log(`CORS 静态文件服务器已启动`);
	console.log(`前端页面地址: http://127.0.0.1:${PORT}`);
	console.log(`直接访问: http://127.0.0.1:${PORT}/frontend.html`);
	console.log("按 Ctrl+C 停止服务器");
});

// 优雅关闭
process.on("SIGINT", () => {
	console.log("\n正在关闭静态文件服务器...");
	server.close(() => {
		console.log("静态文件服务器已关闭");
		process.exit(0);
	});
});

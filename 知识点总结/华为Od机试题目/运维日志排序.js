function sortLogs(logs) {
	/* 日志排序 */
	logs.sort((log1, log2) => {
		const time1 = convertToMillisecond(log1);
		const time2 = convertToMillisecond(log2);
		return time1 < time2 ? -1 : 1;
	});

	for (const log of logs) {
		console.log(log);
	}
}

function convertToMillisecond(timeStr) {
	const match = timeStr.match(/(\d+):(\d+):(\d+).(\d+)/);
	return (
		parseInt(match[1]) * 3600000 +
		parseInt(match[2]) * 60000 +
		parseInt(match[3]) * 1000 +
		parseInt(match[4])
	);
}

console.log(sortLogs(["01:41:8.9", "1:1:09.211"]));

function compation(playerArr, scroreArr) {
	try {
		// ===================== 步骤1：解析输入数据 =====================
		// 解析第一行：评委数M、选手数N
		const [M, N] = playerArr;
		// 解析打分矩阵：第2~M+1行是评委打分
		const scoreMatrix = scroreArr;

		// ===================== 步骤2：严格校验输入合法性 =====================
		let isValid = true;
		// 校验1：M和N的取值范围
		if (M < 3 || M > 10 || N < 3 || N > 100) isValid = false;
		// 校验2：打分行数是否等于评委数M
		if (scoreMatrix.length !== M) isValid = false;
		// 校验3：每行打分数量等于N，且每个分数在1~10之间
		scoreMatrix.forEach((row) => {
			if (row.length !== N) isValid = false;
			row.forEach((score) => {
				if (score < 1 || score > 10) isValid = false;
			});
		});
		// 任意异常，直接输出-1并结束
		if (!isValid) {
			console.log(-1);
			return;
		}

		// ===================== 步骤3：初始化选手统计数据 =====================
		// 每个选手结构：{ id:选手编号, total:总分, scoreCount:[0,0,...0] }
		// scoreCount下标0不用，1-10对应分数，值为该分数的个数
		const playerList = [];
		for (let i = 1; i <= N; i++) {
			playerList.push({
				id: i,
				total: 0,
				scoreCount: new Array(11).fill(0), // 下标0-10，0无意义
			});
		}

		// ===================== 步骤4：统计每个选手的总分+分值频次 =====================
		scoreMatrix.forEach((scoreRow) => {
			// 遍历每个评委的打分行
			scoreRow.forEach((score, index) => {
				// 遍历该行的每个选手分数
				const player = playerList[index]; // index=0 → 1号选手
				player.total += score; // 累加总分
				player.scoreCount[score]++; // 对应分数的个数+1
			});
		});

		// ===================== 步骤5：按规则降序排序选手 =====================
		playerList.sort((a, b) => {
			// 优先级1：总分高的排前面
			if (b.total !== a.total) {
				return b.total - a.total;
			}
			// 优先级2：总分相同，从10分到1分依次比较个数，多的排前面
			for (let s = 10; s >= 1; s--) {
				if (b.scoreCount[s] !== a.scoreCount[s]) {
					return b.scoreCount[s] - a.scoreCount[s];
				}
			}
			return 0; // 题目说明无完全相同的情况，此return不会执行
		});

		// ===================== 步骤6：提取前3名编号并输出 =====================
		const top3 = playerList.slice(0, 3).map((item) => item.id);
		console.log(top3.join(","));
	} catch (err) {
		// 捕获任何解析异常，直接输出-1
		console.log(-1);
	}
}

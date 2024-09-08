// 机器人搬砖，一共有N堆砖存放在N个不同的仓库中，第 i 堆中有 bricks[i] 块砖头，要求在8小时内搬完。

// 机器人每小时能搬砖的数量取决于有多少能量格，机器人一个小时中只能在一仓库中搬砖，机器人的能量格每小时补充一次且能量格只在这一个小时有效，为使得机器人损耗最小化，应尽量减小每次补充的能量格数。

// 为了保障在8小时内能完成砖任务，请计算每小时始机器人充能的最小能量格数。

// 备注:

// 1、无需考虑机器人补充能量的耗时

// 2、无需考虑机器人搬砖的耗时

// 3、机器人每小时补充能量格只在这一个小时中有效

// 输入描述
// 程序有输入为“30 12 25 8 19”一个整数数组，数组中的每个数字代表第i堆砖的个数，每堆砖的个数不超过100

// 输出描述
// 输出在8小时内完成搬砖任务，机器人每小时最少需要充多少个能量格；

// 如果8个小时内无法完成任务，则输出“-1”；

// 示例1
// 输入：
// 30 12 25 8 19

// 输出：
// 15

/**
 * 计算机器人每小时需要的最小能量格数
 * @param {number[]} bricks - 每堆砖的数量
 * @returns {number} - 每小时需要的最小能量格数，如果无法完成则返回 -1
 */
function minEnergyPerHour(bricks) {
	// 检查给定的能量格数是否足够在8小时内完成任务
	function canFinish(energy) {
		//计算 每小时充电的能量来搬所有的砖块 是否能够在8小时内完成。
		//能量 = 能搬的砖块的数量
		let hours = 0
		for (let b of bricks) {
			// 计算搬的时间 需要小于等于8小时
			hours += Math.ceil(b / energy)
			if (hours > 8) return false
		}
		return true
	}

	let left = 1
	let right = Math.max(...bricks)

	while (left < right) {
		let mid = Math.floor((left + right) / 2)
		if (canFinish(mid)) {
			right = mid
		} else {
			left = mid + 1
		}
	}

	return canFinish(left) ? left : -1
}

// 测试
console.log(minEnergyPerHour([30, 12, 25, 8, 19])) // 应输出 15

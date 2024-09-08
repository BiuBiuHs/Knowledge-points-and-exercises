// 公司用一个字符串来表示员工的出勤信息

// absent：缺勤

// late：迟到

// leaveearly：早退

// present：正常上班

// 现需根据员工出勤信息，判断本次是否能获得出勤奖，能获得出勤奖的条件如下：

// 缺勤不超过一次；

// 没有连续的迟到/早退；

// 任意连续7次考勤，缺勤/迟到/早退不超过3次。

// 输入描述

// 用户的考勤数据字符串

// 记录条数 >= 1；

// 输入字符串长度 < 10000；

// 不存在非法输入；

// 输出描述

// 根据考勤数据字符串，如果能得到考勤奖，输出”true”；否则输出”false”。

// 用例1

// 输入

// 2

// present

// present present

// 输出

// true true

/**
 * 判断员工是否能获得出勤奖
 * @param {string} attendanceRecord - 员工的出勤记录字符串
 * @returns {boolean} - 是否能获得出勤奖
 */
function canGetAttendanceAward(attendanceRecord) {
	const records = attendanceRecord.split(' ')
	let absentCount = 0
	let consecutiveLateOrEarly = 0
	let recentSevenDays = []

	for (let i = 0; i < records.length; i++) {
		const current = records[i]

		// 检查缺勤次数
		if (current === 'absent') {
			absentCount++
			if (absentCount > 1) return false
		}

		// 检查连续迟到/早退
		if (current === 'late' || current === 'leaveearly') {
			consecutiveLateOrEarly++
			if (consecutiveLateOrEarly > 1) return false
		} else {
			consecutiveLateOrEarly = 0
		}

		// 检查最近7天的记录
		recentSevenDays.push(current)
		if (recentSevenDays.length > 7) {
			recentSevenDays.shift()
		}
		if (recentSevenDays.length === 7) {
			let badDays = recentSevenDays.filter(
				(day) => day !== 'present'
			).length
			if (badDays > 3) return false
		}
	}

	return true
}

// 处理输入
const readline = require('readline')
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

let lineCount = 0
let totalLines

rl.on('line', (line) => {
	if (lineCount === 0) {
		totalLines = parseInt(line)
	} else {
		console.log(canGetAttendanceAward(line))
	}

	lineCount++

	if (lineCount > totalLines) {
		rl.close()
	}
})

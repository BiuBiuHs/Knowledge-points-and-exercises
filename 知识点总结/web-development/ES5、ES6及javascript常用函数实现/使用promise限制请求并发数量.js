//gpt 给出的实现方案
class RequestQueue {
	constructor(maxConcurrent) {
		this.maxConcurrent = maxConcurrent
		this.queue = []
		this.runningCount = 0
	}

	enqueue(promiseFactory) {
		return new Promise((resolve, reject) => {
			this.queue.push({ promiseFactory, resolve, reject })
			this.dequeue()
		})
	}

	dequeue() {
		if (
			this.runningCount >= this.maxConcurrent ||
			this.queue.length === 0
		) {
			return
		}

		const { promiseFactory, resolve, reject } = this.queue.shift()
		this.runningCount++

		promiseFactory()
			.then(resolve)
			.catch(reject)
			.finally(() => {
				this.runningCount--
				this.dequeue()
			})
	}
}

// 使用示例
const queue = new RequestQueue(3) // 最大并发数为3

function makeRequest(id) {
	return new Promise((resolve) => {
		setTimeout(() => {
			console.log(`Request ${id} completed`)
			resolve(`Result ${id}`)
		}, Math.random() * 2000)
	})
}

for (let i = 1; i <= 10; i++) {
	queue
		.enqueue(() => makeRequest(i))
		.then((result) => {
			console.log(`Received result: ${result}`)
		})
}

//另类实现
/**
 * @param {Function[]} functions
 * @param {number} n
 * @return {Function}
 */
var promisePool = async function (functions, n) {
	const queue = [...functions]
	async function wroker() {
		while (queue.length > 0) {
			await queue.shift()()
		}
	}
	await Promise.allSettled([...new Array(n)].map(wroker))
}

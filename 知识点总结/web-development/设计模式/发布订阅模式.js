class EventEmitter {
	/**
	 * 构造函数用于初始化监听器对象
	 *
	 * @param {Object} listeners - 用于存储事件处理函数的对象
	 */
	constructor() {
		this.listeners = {}
	}

	// 订阅事件
	/**
	 * 将回调函数注册到指定事件上。
	 * 如果事件尚未有任何监听器，则创建一个新数组作为监听器列表。
	 *
	 * @param {string} event - 要监听的事件名称。
	 * @param {function} callback - 当事件被触发时要调用的回调函数。
	 *
	 * @returns {void}
	 */
	on(event, callback) {
		if (!this.listeners[event]) {
			this.listeners[event] = []
		}
		this.listeners[event].push(callback)
	}

	/**
	 * 在事件触发一次后执行回调函数
	 *
	 * @param {string} event - 指定的事件名称
	 * @param {function} callback - 当事件被触发时要执行的回调函数
	 *
	 * 该函数会绑定一个只会在指定事件触发一次后执行的回调函数。当事件被触发时，回调函数会被调用并从事件中接收参数，然后解绑这个回调函数，确保只执行一次。
	 */
	once(event, callback) {
		// 只订阅一次事件
		const onceWrapper = (...args) => {
			callback.apply(this, args)
			this.off(event, onceWrapper)
		}
		this.on(event, onceWrapper)
	}

	// 发布事件
	emit(event, ...args) {
		const eventListeners = this.listeners[event]
		if (eventListeners) {
			eventListeners.forEach((callback) => {
				callback.apply(this, args)
			})
		}
	}

	// 取消订阅
	off(event, callback) {
		const eventListeners = this.listeners[event]
		if (eventListeners) {
			this.listeners[event] = eventListeners.filter(
				(listener) => listener !== callback
			)
		}
	}
}

// 使用示例
const emitter = new EventEmitter()

// 订阅 'message' 事件
const messageHandler1 = (data) => console.log('Handler 1:', data)
const messageHandler2 = (data) => console.log('Handler 2:', data)

emitter.on('message', messageHandler1)
emitter.once('message', messageHandler2)

// 发布 'message' 事件
emitter.emit('message', 'Hello, world!')

// 再次发布 'message' 事件
emitter.emit('message', 'Hello again!')

import { getToken } from "./auth"

class WebSocketService {
  /**
   * WebSocket 服务构造函数
   * @param {string} url - WebSocket 服务器地址
   * @param {Object} options - 配置选项
   * @param {boolean} [options.autoReconnect=true] - 是否自动重连
   * @param {number} [options.maxRetries=3] - 最大重试次数
   * @param {number} [options.reconnectInterval=5000] - 重连间隔时间（毫秒）
   * @param {number} [options.heartbeatInterval=15000] - 心跳间隔时间（毫秒）
   * @param {number} [options.heartbeatTimeout=5000] - 心跳超时时间（毫秒）
   * @param {number} [options.messageTimeout=30000] - 消息超时时间（毫秒）
   */
  constructor(url, options = {}) {
    // WebSocket 基本配置
    this.url = url // WebSocket 服务器地址
    this.ws = null // WebSocket 实例

    // 配置选项，使用默认值
    this.autoReconnect = options.autoReconnect // 是否自动重连
    this.maxRetries = options.maxRetries // 最大重试次数
    this.reconnectInterval = options.reconnectInterval || 5000
    this.heartbeatInterval = options.heartbeatInterval || 15000
    this.heartbeatTimeout = options.heartbeatTimeout || 5000
    this.messageTimeout = options.messageTimeout || 30000

    // 重连相关
    this.retryCount = 0 // 当前重连次数

    // 定时器
    this.heartbeatTimer = null // 心跳定时器
    this.heartbeatTimeoutTimer = null // 心跳超时定时器
    this.messageTimeoutTimer = null // 消息超时定时器
    this.lastMessageTime = null // 最后收到消息的时间戳
    this.reconnectTimer = null // 重连定时器

    // 回调函数
    this.onMessageCallback = null // 消息接收回调
    this.onOpenCallback = null // 连接成功回调
    this.onCloseCallback = null // 连接关闭回调
    this.onErrorCallback = null // 错误处理回调
    this.onNetworkStatusCallback = null // 网络状态回调

    // 状态标志
    this.manualClose = false // 是否手动关闭连接
    this.isConnected = false // 当前连接状态
    this.waitingForPong = false // 是否正在等待心跳响应
  }

  /**
   * 建立 WebSocket 连接
   */
  connect() {
    try {
      // 创建 WebSocket 实例，附加 token 用于认证
      this.ws = new WebSocket(this.url + `?access_token=${getToken()}`)
      this.setupEventHandlers()
    } catch (error) {
      console.error("WebSocket 连接创建失败:", error)
      this.handleNetworkError("CONNECTION_ERROR")
    }
  }

  /**
   * 设置 WebSocket 事件处理器
   */
  setupEventHandlers() {
    // 连接成功处理
    this.ws.onopen = () => {
      console.log("WebSocket 连接已打开")
      this.isConnected = true
      this.retryCount = 0
      this.manualClose = false
      this.startHeartbeat() // 启动心跳检测
      this.startMessageTimeout() // 启动消息超时检测
      this.handleNetworkStatus("CONNECTED")
      if (this.onOpenCallback) this.onOpenCallback()
    }

    // 消息接收处理
    this.ws.onmessage = (event) => {
      this.lastMessageTime = Date.now()
      try {
        const data = JSON.parse(event.data)

        // 处理服务器主动关闭的消息
        if (data.message === "close by server") {
          console.log("服务器主动关闭连接")
          this.manualClose = true // 标记为手动关闭，防止重连
          this.onCloseCallback() // 调用关闭回调
          this.close() // 关闭连接
          return
        }

        // 处理心跳响应
        if (data.message === "pong") {
          this.handlePong()
          return
        }
        if (this.onMessageCallback) this.onMessageCallback(event.data)
      } catch (error) {
        // 非 JSON 格式消息直接传递
        if (this.onMessageCallback) this.onMessageCallback(event.data)
      }
    }

    // 错误处理
    this.ws.onerror = (error) => {
      console.error("WebSocket 错误:", error)
      this.handleNetworkError("SOCKET_ERROR")
      if (this.onErrorCallback) this.onErrorCallback(error)
    }

    // 连接关闭处理
    this.ws.onclose = () => {
      console.log("WebSocket 连接已关闭")
      this.isConnected = false
      this.stopHeartbeat()
      this.stopMessageTimeout()
      if (!this.manualClose) {
        this.handleNetworkStatus("DISCONNECTED")
      }

      if (this.onCloseCallback) this.onCloseCallback()

      // 根据配置决定是否自动重连
      if (!this.manualClose && this.autoReconnect) {
        if (this.retryCount < this.maxRetries) {
          this.retryCount++
          console.log(`重连尝试 #${this.retryCount}`)
          this.reconnect()
        } else {
          console.log("已达到最大重试次数，停止重连")
          this.handleNetworkError("MAX_RETRIES_REACHED")
        }
      }
    }
  }

  /**
   * 启动心跳检测机制
   */
  startHeartbeat() {
    this.stopHeartbeat() // 确保之前的心跳被清理

    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        // 如果上一次心跳还未响应，触发超时处理
        if (this.waitingForPong) {
          this.handleHeartbeatTimeout()
          return
        }

        this.waitingForPong = true
        this.sendMessage(JSON.stringify({ message: "ping" }))

        // 设置心跳响应超时检测
        this.heartbeatTimeoutTimer = setTimeout(() => {
          this.handleHeartbeatTimeout()
        }, this.heartbeatTimeout)
      }
    }, this.heartbeatInterval)
  }

  /**
   * 启动消息超时检测
   */
  startMessageTimeout() {
    this.stopMessageTimeout()
    this.lastMessageTime = Date.now()

    this.messageTimeoutTimer = setInterval(() => {
      const now = Date.now()
      if (this.lastMessageTime && now - this.lastMessageTime > this.messageTimeout) {
        this.handleMessageTimeout()
      }
    }, this.messageTimeout / 2)
  }

  /**
   * 处理心跳响应
   */
  handlePong() {
    this.waitingForPong = false
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer)
      this.heartbeatTimeoutTimer = null
    }
  }

  /**
   * 处理心跳超时
   */
  handleHeartbeatTimeout() {
    console.log("心跳超时")
    this.waitingForPong = false
    this.handleNetworkError("HEARTBEAT_TIMEOUT")
    // 只在启用自动重连时进行重连
    if (this.autoReconnect) {
      this.reconnect()
    }
  }

  /**
   * 处理消息接收超时
   */
  handleMessageTimeout() {
    console.log("消息接收超时")
    this.handleNetworkError("MESSAGE_TIMEOUT")
    // 只在启用自动重连时进行重连
    if (this.autoReconnect) {
      this.reconnect()
    }
  }

  /**
   * 处理网络错误
   * @param {string} type - 错误类型
   */
  handleNetworkError(type) {
    if (this.onNetworkStatusCallback) {
      this.onNetworkStatusCallback({
        status: "ERROR",
        type: type,
        retryCount: this.retryCount
      })
    }
  }

  /**
   * 处理网络状态变化
   * @param {string} status - 网络状态
   */
  handleNetworkStatus(status) {
    if (this.onNetworkStatusCallback) {
      this.onNetworkStatusCallback({
        status: status,
        retryCount: this.retryCount
      })
    }
  }

  /**
   * 停止心跳检测
   */
  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer)
      this.heartbeatTimeoutTimer = null
    }
    this.waitingForPong = false
  }

  /**
   * 停止消息超时检测
   */
  stopMessageTimeout() {
    if (this.messageTimeoutTimer) {
      clearInterval(this.messageTimeoutTimer)
      this.messageTimeoutTimer = null
    }
  }

  /**
   * 重新连接
   */
  reconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }

    this.handleNetworkStatus("RECONNECTING")

    this.reconnectTimer = setTimeout(() => {
      if (!this.isConnected && !this.manualClose) {
        this.connect()
      }
    }, this.reconnectInterval)
  }

  /**
   * 关闭连接
   */
  close() {
    this.manualClose = true
    this.stopHeartbeat()
    this.stopMessageTimeout()
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    if (this.ws) {
      this.ws.close()
      this.isConnected = false
    }
  }

  /**
   * 发送消息
   * @param {string} message - 要发送的消息
   */
  sendMessage(message) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(message)
      console.log("发送消息:", message)
    } else {
      console.log("WebSocket 未连接，无法发送消息")
      this.handleNetworkError("NOT_CONNECTED")
    }
  }

  /**
   * 设置网络状态回调
   * @param {Function} callback - 回调函数
   */
  onNetworkStatus(callback) {
    this.onNetworkStatusCallback = callback
  }

  /**
   * 设置消息接收回调
   * @param {Function} callback - 回调函数
   */
  onMessage(callback) {
    this.onMessageCallback = callback
  }

  /**
   * 设置连接成功回调
   * @param {Function} callback - 回调函数
   */
  onOpen(callback) {
    this.onOpenCallback = callback
  }

  /**
   * 设置连接关闭回调
   * @param {Function} callback - 回调函数
   */
  onClose(callback) {
    this.onCloseCallback = callback
  }

  /**
   * 设置错误处理回调
   * @param {Function} callback - 回调函数
   */
  onError(callback) {
    this.onErrorCallback = callback
  }

  /**
   * 手动重连方法
   * 即使禁用了自动重连，也可以通过这个方法手动触发重连
   */
  manualReconnect() {
    if (this.retryCount < this.maxRetries) {
      this.retryCount++
      console.log(`手动重连尝试 #${this.retryCount}`)
      this.reconnect()
      return true
    }
    console.log("已达到最大重试次数，无法重连")
    return false
  }
}

export default WebSocketService

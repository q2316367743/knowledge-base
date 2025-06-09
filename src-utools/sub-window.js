const {ipcRenderer} = require('electron')

class SubWindow {

  constructor(channel) {
    this.channel = channel;
  }

  /***  接收主窗口发送过来的消息  ***/
  receiveMsg(callback) {
    ipcRenderer.on(this.channel, (event, res) => {
      // 保存插件的窗口ID
      this.parentId = event.senderId;
      if (res) {
        callback(res);
      }
    })
  }

  /***  向插件主窗口发送消息  ***/
  sendMsg(msg) {
    // 优先使用新的API
    if (utools.sendToParent) {
      utools.sendToParent(this.channel, msg);
      return;
    }
    if (this.parentId) {
      ipcRenderer.sendTo(this.parentId, this.channel, msg);
    }
  }
}

window.preload = {
  ipcRenderer: {
    buildSubWindow(channel) {
      return new SubWindow(channel);
    }
  }
}

Page({
    data: {
      videoPath: '',
      isFullScreen: false
    },
  
    onLoad: function(options) {
      const path = decodeURIComponent(options.path);
      this.setData({ videoPath: path });
  
      // 创建视频上下文
      this.videoContext = wx.createVideoContext('myVideo');
  
      // 监听窗口尺寸变化
      wx.getSystemInfo({
        success: (res) => {
          this.handleScreenOrientation(res);
        }
      });
  
      wx.onWindowResize((res) => {
        this.handleScreenOrientation(res);
      });
    },
  
    handleScreenOrientation: function(res) {
      const { windowWidth, windowHeight } = res;
      const isLandscape = windowWidth > windowHeight;
  
      if (isLandscape && !this.data.isFullScreen) {
        // 横屏时请求全屏播放
        this.videoContext.requestFullScreen({ direction: 90 });
        this.setData({ isFullScreen: true });
      } else if (!isLandscape && this.data.isFullScreen) {
        // 竖屏时退出全屏播放
        this.videoContext.exitFullScreen();
        this.setData({ isFullScreen: false });
      }
    },
  
    onUnload: function() {
      // 监听页面卸载时取消窗口尺寸监听
      wx.offWindowResize();
    }
  });
  
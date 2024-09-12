Page({
    data: {
      videos: [],
      currentVideo: '',
      currentDirectory: '',
      currentIndex: 0
    },
  
    onLoad: function (options) {
      const videoPath = decodeURIComponent(options.currentVideo);
      const currentDirectory = decodeURIComponent(options.currentDirectory);
      console.log(videoPath)
      this.setData({
        currentVideo: videoPath,
        currentDirectory: currentDirectory,
        displayPath: this.extractDisplayPath(videoPath)
      });
  
      // 重新加载index.json并过滤出视频文件
      this.loadVideos(currentDirectory);
    },
  
    loadVideos: function (directory) {
      wx.request({
        url: directory + 'index.json',
        success: (res) => {
          const videoFiles = res.data.filter(item => 
            item.name.toLowerCase().endsWith('.mp4') || 
            item.name.toLowerCase().endsWith('.avi') || 
            item.name.toLowerCase().endsWith('.mov') || 
            item.name.toLowerCase().endsWith('.wmv')
          );
        //   console.log(videoFiles)
          const currentIndex = videoFiles.findIndex(video => video.path === this.data.currentVideo);
          this.setData({
            // currentVideo: videoFiles,
            videos: videoFiles,
            currentIndex: currentIndex
          });
        }
      });
    },
  
    prevVideo: function () {
      let index = this.data.currentIndex - 1;
      if (index < 0) index = this.data.videos.length - 1;
      this.setData({
        currentVideo: this.data.videos[index].path,
        currentIndex: index
      });
    },
  
    nextVideo: function () {
        let index = this.data.currentIndex + 1;
        if (index >= this.data.videos.length) index = 0;
      
        this.setData({
          currentVideo: this.data.videos[index].path,
          currentIndex: index
        }, () => {
          // 获取video上下文并调用play方法
          const videoContext = wx.createVideoContext('videoPlayer');
          videoContext.play();
        });
      },
      saveVideo: function () {
        wx.downloadFile({
          url: this.data.currentVideo,
          success: (res) => {
            if (res.statusCode === 200) {
              wx.saveVideoToPhotosAlbum({
                filePath: res.tempFilePath,
                success: () => {
                  wx.showToast({
                    title: '保存成功',
                    icon: 'success'
                  });
                },
                fail: (err) => {
                  wx.showToast({
                    title: '保存失败',
                    icon: 'none'
                  });
                  console.error('保存视频失败：', err);
                }
              });
            }
          },
          fail: (err) => {
            wx.showToast({
              title: '下载失败',
              icon: 'none'
            });
            console.error('下载视频失败：', err);
          }
        });
      },
    // 提取显示路径
    extractDisplayPath: function(fullPath) {
        // 从 "photo/" 开始提取
        const match = fullPath.match(/\/nfs\/disk1\/(.+)/);
        return match ? match[1] : fullPath;
    },

    // 切换信息显示
    toggleInfo: function() {
        this.setData({
        showInfo: !this.data.showInfo
        });
    },  
    goBack: function () {
      wx.navigateBack();
    }
  });
  
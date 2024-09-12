Page({
    data: {
      images: [],
      currentIndex: 0,
      currentImage: ''
    },
  
    onLoad(options) {
      const currentDirectory = decodeURIComponent(options.currentDirectory);
      const path = decodeURIComponent(options.path);
    //   console.log("path:" + path)
    //   console.log("currentDirectory:" + currentDirectory)
      this.setData({
        currentImage: path,
        displayPath: this.extractDisplayPath(path)
      });
      this.loadDirectory(currentDirectory);
    },
  
    loadDirectory(path) {
      wx.request({
        url: `${path}/index.json`,
        success: res => {
          const images = res.data.filter(item => item.path.toLowerCase().endsWith('.jpg'));
          const currentIndex = images.findIndex(img => img.path === this.data.currentImage);
          this.setData({
            images: images,
            currentIndex: currentIndex
          });
        },
        fail: err => {
          console.error('请求失败', err);
        }
      });
    },
  
    prevImage() {
      if (this.data.currentIndex > 0) {
        const prevIndex = this.data.currentIndex - 1;
        this.setData({
          currentIndex: prevIndex,
          currentImage: this.data.images[prevIndex].path
        });
      }
    },
  
    nextImage() {
      if (this.data.currentIndex < this.data.images.length - 1) {
        const nextIndex = this.data.currentIndex + 1;
        this.setData({
          currentIndex: nextIndex,
          currentImage: this.data.images[nextIndex].path
        });
      }
    },
    saveImage: function () {
        wx.downloadFile({
          url: this.data.currentImage,
          success: (res) => {
            if (res.statusCode === 200) {
              wx.saveImageToPhotosAlbum({
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
                  console.error('保存图片失败：', err);
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
    // 上滑（下拉）事件，播放上一个文件
    onPullDownRefresh: function() {
        this.prevImage();
        wx.stopPullDownRefresh();
      },
    
      // 下滑（触底）事件，播放下一个文件
      onReachBottom: function() {
        this.nextImage();
      },    
    goBack() {
      wx.navigateBack();
    }
  });
  
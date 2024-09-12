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
        currentImage: path
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
  
    goBack() {
      wx.navigateBack();
    }
  });
  
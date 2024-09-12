Page({
    data: {
      baseUrl: 'http://192.168.2.15:81/nfs/disk1/photo/', // 根目录
      currentDirectory: '', // 当前目录
      files: [], // 当前目录下的文件和子目录
      currentFile: null, // 当前正在播放的文件
      fileIndex: -1, // 当前文件索引
      noMoreFiles: false // 到头标志
    },
  
    onLoad: function() {
      // 加载根目录
      this.loadDirectory(this.data.baseUrl);
    },
  
    // 加载目录
    loadDirectory: function(path) {
      const url = path + 'index.json';
      const self = this; // 保存当前的 this 引用
      wx.request({
        url: url,
        success(res) {
            // 为每个文件/目录增加 isDirectory 属性
            const files = res.data.map(item => {
              const name = item.name.split('/').pop(); // 提取文件名
              const lowerFilename = name.toLowerCase();
              const isDirectory = !/\.[a-zA-Z0-9]+$/.test(name); // 判断是否为目录
              const isVideo = lowerFilename.endsWith('.mp4') || lowerFilename.endsWith('.mov'); // 判断是否为视频
              const isImage = lowerFilename.endsWith('.jpg') || lowerFilename.endsWith('.heic'); // 判断是否为图片
      
              return { ...item, isDirectory, isVideo, isImage }; // 添加这些属性
            });
      
        self.setData({
            currentDirectory: path,
            files: files,
            currentFile: null,
            fileIndex: -1,
            noMoreFiles: false
        });
        //   console.log('Files data in setData:', self.data.files);
        },
        fail() {
          wx.showToast({ title: '加载失败', icon: 'none' });
        }
      });
    },
  
    // 进入子目录
    openDirectory: function(e) {
      const path = e.currentTarget.dataset.path;
      this.loadDirectory(path); // 加载子目录
    },
  
    // 返回上一级目录
    goBack: function() {
      const path = this.data.currentDirectory;
      if (path !== this.data.baseUrl) {
        const parentDir = path.substring(0, path.lastIndexOf('/', path.length - 2) + 1);
        this.loadDirectory(parentDir); // 加载上一级目录
      }
    },
  
    // 返回首页（根目录）
    goHome: function() {
      this.loadDirectory(this.data.baseUrl);
    },
  
    // 播放视频文件
    playVideo: function(e) {
        const videoPath = e.currentTarget.dataset.path; // 获取点击的文件路径
        console.log('Playing video at path:', encodeURIComponent(videoPath));
        
        // 设置当前播放文件为视频文件的路径
        this.setData({ currentFile: videoPath });
    
        // 显示视频播放器，可以使用 <video> 组件
        wx.navigateTo({
          url: `/pages/videoPlayer/videoPlayer?path=${encodeURIComponent(videoPath)}` // 传递路径到视频播放页面
        });
        
    },
  
    // 查看图片文件
    viewImage: function(e) {
        console.log(e)
        const path = e.currentTarget.dataset.path;
        // console.log("page1-image path: " + path)
        // console.log("page1 - current path: " + this.data.currentDirectory)
        wx.navigateTo({
            url: `/pages/imagePlayer/imagePlayer?path=${path}&currentDirectory=${this.data.currentDirectory}`
          });        
        // wx.navigateTo({
        //   url: `/pages/imagePlayer/imagePlayer?path=${encodeURIComponent(path)}`
        // });
    },
  
    // 播放上一个文件
    prevFile: function() {
      const index = this.data.fileIndex - 1;
      if (index >= 0) {
        this.playFileAtIndex(index);
      } else {
        this.setData({ noMoreFiles: true });
      }
    },
  
    // 播放下一个文件
    nextFile: function() {
      const index = this.data.fileIndex + 1;
      if (index < this.data.files.length) {
        this.playFileAtIndex(index);
      } else {
        this.setData({ noMoreFiles: true });
      }
    },
  
    // 根据索引播放文件
    playFileAtIndex: function(index) {
      const file = this.data.files[index];
      if (this.isVideo(file.name) || this.isImage(file.name)) {
        this.setData({
          currentFile: file.path,
          fileIndex: index,
          noMoreFiles: false
        });
      } else {
        this.setData({ noMoreFiles: true });
      }
    },
  
    // 上滑（下拉）事件，播放上一个文件
    onPullDownRefresh: function() {
      this.prevFile();
      wx.stopPullDownRefresh();
    },
  
    // 下滑（触底）事件，播放下一个文件
    onReachBottom: function() {
      this.nextFile();
    }
  });
  
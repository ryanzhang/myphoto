Page({
    data: {
      imagePath: '',
      imageError: false
    },
  
    onLoad: function(options) {
      const path = decodeURIComponent(options.path);
      console.log('Loading image from path:', path); // 输出路径进行调试
      this.setData({ imagePath: path });
    },
  
    onImageError: function() {
      this.setData({ imageError: true });
      console.error('图片加载失败');
    }
  });
  
Page({
  onLoad: function ({ reference }) {
    this.setData({
      src: `https://mp.weixin.qq.com/s/${ reference }`
    });
  }
})
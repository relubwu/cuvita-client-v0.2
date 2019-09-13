const { Store } = getApp();

Component({
  options: {
    addGlobalClass: true
  },
  lifetimes: {
    attached: function () {
      let { systemInfo } = Store.getState().global;
      this.setData({
        systemInfo
      });
    }
  },
  methods: {
    back: function () {
      getCurrentPages().length > 1 ? 
      wx.navigateBack({
        delta: 1
      }) :
      wx.reLaunch({
        url: '/pages/discovery/discovery',
      });
    }
  }
})

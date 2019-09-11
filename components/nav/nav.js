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
      wx.navigateBack({
        delta: 1
      });
    }
  }
})

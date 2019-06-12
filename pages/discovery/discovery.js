import * as Actions from 'actions';
import * as LocalePackage from 'locale-package';

const { Store, GlobalActions } = getApp();

Page({
  data: {
    scrollTop: 0
  },
  mapStateToPage: function () {
    let newState = Store.getState();
    if (this.data.locale !== newState.global.locale)
      this.setData({
        locale: newState.global.locale
      });
  },
  onLoad: function (options) {
    // Synchronous storage hook
    this.setData({
      ...Store.getState().global
    });
  },
  onScroll: function ({ detail: { scrollTop } }) {
    if (this.data.scrollTop > -this.data.systemInfo.screenWidth * 1.2 && scrollTop <= -this.data.systemInfo.screenWidth * 1.2)
      wx.vibrateShort();
    this.setData({
      scrollTop
    });
  },
  onShow: function () {
    this.unsubscribe = Store.subscribe(() => {
      this.mapStateToPage();
    });
  },
  onHide: function () {
    this.unsubscribe();
  },
  onUnLoad: function () {

  }
})
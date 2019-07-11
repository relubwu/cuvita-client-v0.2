import * as LocalePackage from 'locale-package';

const { Store } = getApp();

Page({
  data: {
    LocalePackage
  },
  onLoad: function () {
    let { locale, systemInfo } = Store.getState().global;
    // Synchronous storage hook
    this.setData({
      locale, systemInfo
    });
    wx.setNavigationBarTitle({
      title: LocalePackage.title[this.data.locale]
    });
  },
  mapStateToPage: function () {
    let newState = Store.getState();
    if (this.data.locale !== newState.global.locale)
      this.setData({
        locale: newState.global.locale
      });
  },
  onShow: function () {
    this.unsubscribe = Store.subscribe(() => {
      this.mapStateToPage();
    });
  },
  onUnload: function () {
    this.unsubscribe();
  },
});
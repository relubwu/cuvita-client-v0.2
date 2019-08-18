import * as LocalePackage from 'locale-package';

const { Store } = getApp();

Page({
  onLoad: function () {
    let { global: { locale }, page: { discovery: { services } } } = Store.getState();
    wx.setNavigationBarTitle({
      title: LocalePackage.title[locale]
    });
    for (let service of services)
      if (service.name === 'finance')
        this.setData({
          src: service.options.src
        });
  }
})
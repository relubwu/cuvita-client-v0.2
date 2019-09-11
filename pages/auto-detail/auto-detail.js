import feedback from '../../utils/feedback';
import palette from '../../config/palette.config';
import * as promisfy from '../../lib/wx.promisfy';
import * as localePackage from 'locale-package';

const { Store, GlobalLocalePackage } = getApp();

Page({
  data: {
    localePackage, palette
  },
  onLoad: function ({ stockNumber }) {
    let { locale, systemInfo } = Store.getState().global;
    this.setData({
      locale,
      systemInfo
    });
    wx.setNavigationBarTitle({
      title: localePackage.title[this.data.locale]
    });
    wx.showLoading({
      title: GlobalLocalePackage.loading[Store.getState().global.locale]
    });
    promisfy.fetch(`/auto/detail/${ stockNumber }`)
      .then(({ data }) => {
        console.log(data);
        this.setData({
          vehicle: data
        })
        wx.hideLoading();
      })
  },
  preview: function ({ target: { dataset: { index } } }) {
    wx.previewImage({
      current: index.toString(),
      urls: this.data.gallery
    })
  },
  more: function() {
    let that = this;
    wx.showModal({
      title: localePackage.modal.more.title[this.data.locale],
      content: localePackage.modal.more.content[this.data.locale] + this.data.vehicle.stockNumber,
      confirmColor: palette.carmax,
      confirmText: localePackage.modal.more.action[this.data.locale],
      success: function ({ confirm }) {
        if (confirm)
          wx.makePhoneCall({
            phoneNumber: that.data.vehicle.tel
          });
      }
    })
  }
})
import feedback from '../../utils/feedback';
import palette from '../../config/palette.config';
import * as promisfy from '../../lib/wx.promisfy';
import * as localePackage from 'locale-package';

const { Store, GlobalActions, GlobalLocalePackage } = getApp();

Page({
  data: {
    localePackage, palette
  },
  onLoad: function({ reference }) {
    let { locale, systemInfo } = Store.getState().global;
    this.setData({ locale, systemInfo, reference });
    wx.showLoading({
      title: GlobalLocalePackage.loading[Store.getState().global.locale]
    });
    promisfy.fetch(`/vendor/detail/${ reference }`)
      .then(({ data }) => {
        let markers = [{ iconPath: '/assets/icons/vendor-pin.png', id: 0, longitude: data.location.coordinates[0], latitude: data.location.coordinates[1], width: 65, height: 65 }];
        this.setData({ ...this.data, ...data, markers });
        wx.hideLoading();
      });
  },
  preview: function ({ target: { dataset: { index } } }) {
    wx.previewImage({
      current: index.toString(),
      urls: this.data.gallery
    })
  },
  call: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.tel
    });
  },
  navigate: function () {
    wx.openLocation({
      latitude: this.data.location.coordinates[1],
      longitude: this.data.location.coordinates[0]
    })
  }
})
import { request, METHOD } from '../../utils/promisfy';
import * as API from '../../config/api.config';
import * as LocalePackage from 'locale-package';
import Palette from '../../config/palette.config';
import feedback from '../../utils/feedback';

const { Store, GlobalActions, GlobalLocalePackages } = getApp();

Page({
  data: {
    LocalePackage, Palette
  },
  onLoad: function(options) {
    // Synchronous storage hook
    let { locale, systemInfo } = Store.getState().global;
    this.setData({
      locale,
      systemInfo,
      options
    });
    wx.showLoading({
      title: GlobalLocalePackages.loading[Store.getState().global.locale]
    });
    request(API.VENDOR.DETAIL, METHOD.GET, { reference: this.data.options.reference })
      .then(res => {
        let markers = [];
        markers.push({ iconPath: '/assets/icons/vendor-pin.png', id: 0, longitude: res.location.coordinates[0], latitude: res.location.coordinates[1], width: 65, height: 65 });
        this.setData({ ...this.data, ...res, markers });
        wx.hideLoading();
      })
      .catch(e => {
        wx.showToast({
          title: GlobalLocalePackages.requestFailed[this.data.locale],
          image: '/assets/icons/request-fail.png'
        });
      });
  },
  mapStateToPage: function () {

  },
  onShow: function(options) {
    this.unsubscribe = Store.subscribe(() => {
      this.mapStateToPage();
    });
  },
  onHide: function () {
    this.unsubscribe();
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
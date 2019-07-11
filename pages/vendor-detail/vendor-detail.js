import { request, METHOD } from '../../utils/promisfy';
import * as API from '../../config/api.config';
import * as LocalePackage from 'locale-package';
import feedback from '../../utils/feedback';

const { Store, GlobalActions } = getApp();

Page({
  data: {
    LocalePackage
  },
  onLoad: function(options) {
    // Synchronous storage hook
    let { locale, systemInfo } = Store.getState().global;
    this.setData({
      locale,
      systemInfo,
      options
    });
  },
  mapStateToPage: function () {
    let newState = Store.getState();
    if (this.data.locale !== newState.global.locale)
      this.setData({
        locale: newState.global.locale
      });
  },
  onShow: function(options) {
    this.unsubscribe = Store.subscribe(() => {
      this.mapStateToPage();
    });
    request(API.VENDOR.DETAIL, METHOD.GET, { locale: Store.getState().global.locale, reference: this.data.options.reference })
      .then(res => { 
        let markers = [];
        markers.push({ iconPath: '/assets/icons/vendor-pin.png', id: 0, longitude: res.location.coordinates[0], latitude: res.location.coordinates[1], width: 65, height: 65 });
        this.setData({ ...this.data, ...res, markers });

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
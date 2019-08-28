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
  onLoad: function ({ stockNumber }) {
    // Synchronous storage hook
    let { locale, systemInfo } = Store.getState().global;
    this.setData({
      locale,
      systemInfo
    });
    wx.setNavigationBarTitle({
      title: LocalePackage.title[this.data.locale]
    });
    wx.showLoading({
      title: GlobalLocalePackages.loading[Store.getState().global.locale]
    });
    request(API.AUTO.DETAIL, METHOD.GET, { stockNumber })
      .then(res => {
        this.setData({
          vehicle: res
        })
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
  onShow: function (options) {
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
  more: function() {
    let that = this;
    wx.showModal({
      title: LocalePackage.modal.more.title[this.data.locale],
      content: LocalePackage.modal.more.content[this.data.locale] + this.data.vehicle.stockNumber,
      confirmColor: Palette.carmax,
      confirmText: LocalePackage.modal.more.action[this.data.locale],
      success: function ({ confirm }) {
        if (confirm)
          wx.makePhoneCall({
            phoneNumber: that.data.vehicle.tel
          });
      }
    })
  }
})
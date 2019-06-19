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
    this.setData({
      ...Store.getState().global,
      options
    });
    let { realm } = options;
    wx.setNavigationBarTitle({ title: LocalePackage.realms[realm][this.data.locale] });
  },
  mapStateToPage: function () {
    let newState = Store.getState();
    if (this.data.locale !== newState.global.locale)
      this.setData({
        locale: newState.global.locale
      });
  },
  onShow: function() {
    this.unsubscribe = Store.subscribe(() => {
      this.mapStateToPage();
    });
    wx.showLoading({});
    request(API.VENDOR.CATEGORIES, METHOD.GET, { locale: Store.getState().global.locale, realm: this.data.options.realm })
      .then(categories => {
        this.setData({ categories });
        if (!this.data.category)
          return request(API.VENDOR.LISTS, METHOD.GET, { locale: Store.getState().global.locale, realm: this.data.options.realm, category: categories[0].name });
      })
      .then(res => {
        let vendors = { ...this.data.vendors, ...res };
        this.setData({
          vendors
        });
        wx.hideLoading();
      });
  },
  onHide: function () {
    this.unsubscribe();
  },
  onChange: function ({ detail: { index } }) {
    feedback();
    wx.showLoading({});
    request(API.VENDOR.LISTS, METHOD.GET, { locale: this.data.locale, realm: this.data.options.realm, category: this.data.categories[index].name })
      .then(res => {
        let vendors = { ...this.data.vendors, ...res };
        this.setData({
          vendors
        });
        wx.hideLoading();
      });
  },
  feedback
})
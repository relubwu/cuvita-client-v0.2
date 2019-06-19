import {
  request,
  METHOD
} from '../../utils/promisfy';
import * as API from '../../config/api.config';
import * as LocalePackage from 'locale-package';
import feedback from '../../utils/feedback';

const {
  Store,
  GlobalActions
} = getApp();

Page({
  data: {
    LocalePackage,
    cursor: {},
    current: 0
  },
  onLoad: function (options) {
    let { locale } = Store.getState().global;
    // Synchronous storage hook
    this.setData({
      locale,
      options
    });
    let {
      realm
    } = options;
    wx.setNavigationBarTitle({
      title: LocalePackage.realms[realm][this.data.locale]
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
    wx.showLoading({});
    request(API.VENDOR.CATEGORIES, METHOD.GET, {
        locale: Store.getState().global.locale,
        realm: this.data.options.realm
      })
      .then(categories => {
        this.setData({
          categories
        });
        this.data.cursor[categories[0].name] = {
          start: 0,
          end: 10
        };
        if (!this.data.category)
          return request(API.VENDOR.LISTS, METHOD.GET, {
            locale: Store.getState().global.locale,
            realm: this.data.options.realm,
            category: categories[0].name,
            start: this.data.cursor[categories[0].name].start,
            end: this.data.cursor[categories[0].name].end
          });
      })
      .then(res => {
        let vendors = { ...this.data.vendors,
          ...res
        };
        this.setData({
          vendors
        });
        wx.hideLoading();
      });
  },
  onHide: function () {
    this.unsubscribe();
  },
  onChange: function({
    detail: {
      index
    }
  }) {
    feedback();
    this.setData({
      current: index
    });
    if (!this.data.vendors[this.data.categories[index].name])
      wx.showLoading({});
      if (!this.data.cursor[this.data.categories[index].name])
        this.data.cursor[this.data.categories[index].name] = {
          start: 0,
          end: 10
        };
      request(API.VENDOR.LISTS, METHOD.GET, {
          locale: this.data.locale,
          realm: this.data.options.realm,
          category: this.data.categories[index].name,
          start: this.data.cursor[this.data.categories[index].name].start,
          end: this.data.cursor[this.data.categories[index].name].end
        })
        .then(res => {
          let vendors = { ...this.data.vendors,
            ...res
          };
          this.setData({
            vendors
          });
          wx.hideLoading();
        });
  },
  onReachBottom: function (e) {
    wx.showLoading({});
    if (!!this.data.cursor[this.data.categories[this.data.current].name]) {
      this.data.cursor[this.data.categories[this.data.current].name].start += 10;
      this.data.cursor[this.data.categories[this.data.current].name].end += 10;
    }
    request(API.VENDOR.LISTS, METHOD.GET, {
      locale: this.data.locale,
      realm: this.data.options.realm,
      category: this.data.categories[this.data.current].name,
      start: this.data.cursor[this.data.categories[this.data.current].name].start,
      end: this.data.cursor[this.data.categories[this.data.current].name].end
    })
      .then(res => {
        res[this.data.categories[this.data.current].name] = [...this.data.vendors[this.data.categories[this.data.current].name], ...res[this.data.categories[this.data.current].name]];
        let vendors = {
          ...this.data.vendors,
          ...res
        };
        this.setData({
          vendors
        });
        wx.hideLoading();
      });
  },
  feedback
})
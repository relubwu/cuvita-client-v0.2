import { request, METHOD } from '../../utils/promisfy';
import * as API from '../../config/api.config';
import * as LocalePackage from 'locale-package';
import * as Toasts from '../../utils/toasts';
import Palette from '../../config/palette.config';
import feedback from '../../utils/feedback';

const {
  Store,
  GlobalActions,
  GlobalLocalePackages
} = getApp();

Page({
  data: {
    LocalePackage,
    Palette,
    cursor: {},
    current: 0,
    bottomFlag: [],
    search: {
      keyword: '',
      sort: {
        criteria: NaN
      }
    },
    filter: '',
    showFilter: false
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
    wx.showLoading({
      title: GlobalLocalePackages.loading[this.data.locale]
    });
    request(API.VENDOR.CATEGORIES, METHOD.GET, {
      locale: Store.getState().global.locale,
      realm: this.data.options.realm
    })
      .then(categories => {
        this.setData({
          categories
        });
        this.data.cursor[categories[0].name] = {
          skip: 0
        };
        this.fetchList(categories[0].name, 0, wx.hideLoading);
      })
  },
  mapStateToPage: function () {

  },
  onShow: function () {
    this.unsubscribe = Store.subscribe(() => {
      this.mapStateToPage();
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
      current: index,
      ['search.keyword']: ''
    });
    let currentCategory = this.data.categories[index].name;
    wx.showLoading({
      title: GlobalLocalePackages.loading[this.data.locale]
    });
    if (!this.data.cursor[this.data.categories[index].name])
      this.data.cursor[this.data.categories[index].name] = {
        skip: 0,
      };
    this.fetchList(currentCategory, 0, wx.hideLoading);
  },
  onReachBottom: function (e) {
    let currentCategory = this.data.categories[this.data.current].name;
    wx.showNavigationBarLoading();
    if (!!this.data.cursor[currentCategory]) {
      this.data.cursor[currentCategory].skip += 10;
    }
    if (!!this.data.bottomFlag[currentCategory]) {
      wx.hideNavigationBarLoading();
      return;
    }
    let { skip } = this.data.cursor[currentCategory];
    this.fetchList(currentCategory, skip, wx.hideNavigationBarLoading, this.data.search.keyword);
  },
  fetchList: function (category, skip, callback, keyword='', destructive=false) {
    request(API.VENDOR.LISTS, METHOD.GET, {
      realm: this.data.options.realm,
      category,
      skip,
      limit: 10,
      keyword
    })
      .then(res => {
        if (res[category].length == 0)
          return Toasts.requestNotFound(this.data.locale);
        if (res[category].length < 10) {
          this.setData({
            [`bottomFlag.${category}`]: true
          });
        } else {
          this.setData({
            [`bottomFlag.${category}`]: false
          });
        }
        let vendors;
        if (!this.data.vendors) {
          vendors = res;
        } else if (destructive) {
          this.setData({
            [`vendors.${category}`]: null,
            [`cursor.${category}.skip`]: 0
          });
          vendors = {
            ...this.data.vendors,
            ...res
          }
        } else {
          res[category] = !!this.data.vendors[category] ? [...this.data.vendors[category], ...res[category]] : res[category];
          vendors = {
            ...this.data.vendors,
            ...res
          };
        }
        this.setData({
          vendors
        });
        callback();
      })
      .catch(e => {
        Toasts.requestFailed(Store.getState().global.locale);
        callback();
      });
  },
  search: function ({ detail }) {
    wx.showLoading({
      title: GlobalLocalePackages.loading[this.data.locale]
    });
    let currentCategory = this.data.categories[this.data.current].name;
    this.setData({
      ['search.keyword']: detail
    });
    this.fetchList(currentCategory, 0, wx.hideLoading, detail, true);
  },
  clear: function () {
    if (this.data.search.keyword.length == 0)
      return;
    let currentCategory = this.data.categories[this.data.current].name;
    this.setData({
      ['search.keyword']: ''
    });
    this.fetchList(currentCategory, 0, () => {}, '', true);
  },
  filter: function () {
    this.setData({
      showFilter: !this.data.showFilter
    });
  },
  feedback
})
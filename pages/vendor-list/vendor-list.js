import feedback from '../../utils/feedback';
import palette from '../../config/palette.config';
import * as promisfy from '../../lib/wx.promisfy';
import * as localePackage from 'locale-package';

const { Store, GlobalLocalePackage } = getApp();
const limit = 10;

Page({
  data: {
    bottomFlag: {},
    currentCategory: { index: 0, alias: '' },
    localePackage,
    palette,
    skip: {},
    vendors: {}
  },
  onLoad: function ({ realm }) {
    let { locale, region, systemInfo } = Store.getState().global;
    this.setData({
      locale,
      systemInfo,
      region,
      realm
    });
    wx.setNavigationBarTitle({
      title: localePackage.realms[realm][this.data.locale]
    });
    wx.showLoading({
      title: GlobalLocalePackage.loading[this.data.locale]
    });
    promisfy.fetch(`/vendor/categories/${ realm }`)
      .then(({ data }) => {
        this.setData({
          categories: data,
          ['currentCategory.alias']: data[0].name
        });
        this.fetchList()
          .then(() => { 
            wx.hideLoading();
          });
      });
  },
  onChange: function({ detail: { index } }) {
    feedback();
    this.setData({
      currentCategory: { index, alias: this.data.categories[index].name },
      eol: false
    });
    let { alias } = this.data.currentCategory;
    wx.showLoading({ title: GlobalLocalePackage.loading[this.data.locale] });
    this.fetchList()
      .then(length => {
        length < limit && this.setData({ pending: false, [`bottomFlag.${ alias }`]: true, eol: true });
        wx.hideLoading();
      });
  },
  onReachBottom: function (e) {
    let { alias } = this.data.currentCategory;
    if (this.data.bottomFlag[alias]) {
      this.setData({ eol: true });
      return;
    }
    this.setData({ pending: true, eol: false });
    this.fetchList()
      .then(length => {
        length < limit ? this.setData({ pending: false,  [`bottomFlag.${ alias }`]: true, eol: true }) : this.setData({ pending: false });
      });
  },
  fetchList: function () {
    let { realm, region, currentCategory, skip, bottomFlag, vendors } = this.data;
    if (bottomFlag[currentCategory]) return;
    skip[currentCategory.alias] === undefined ? this.setData({ [`skip.${currentCategory.alias}`]: 0 }) : this.setData({ [`skip.${currentCategory.alias}`]: this.data.skip[currentCategory.alias] + limit });
    return new Promise((resolve, reject) => {
      promisfy.fetch(`/vendor/lists/${ realm }/${ currentCategory.alias }/${ region.alias }?limit=${ limit }&skip=${ skip[currentCategory.alias] }`)
        .then(({ data }) => {
          vendors[currentCategory.alias] ? this.setData({ [`vendors.${currentCategory.alias}`]: vendors[currentCategory.alias].concat(data) }) : this.setData({ [`vendors.${currentCategory.alias}`]: data });
          resolve(data.length);
        });
    });
  },
  feedback
})
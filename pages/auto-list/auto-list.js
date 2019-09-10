import feedback from '../../utils/feedback';
import palette from '../../config/palette.config';
import * as promisfy from '../../lib/wx.promisfy';
import * as localePackage from 'locale-package';

const { Store, GlobalLocalePackage } = getApp();
const limit = 10;

Page({
  data: { 
    bottomFlag: {},
    currentMake: { index: 0, alias: '' },
    localePackage,
    palette,
    skip: {},
    vehicles: {}
  },
  onLoad: function () {
    let { locale, systemInfo, region } = Store.getState().global;
    this.setData({
      locale,
      systemInfo,
      region
    });
    wx.setNavigationBarTitle({
      title: localePackage.title[this.data.locale]
    });
    wx.showLoading({
      title: GlobalLocalePackage.loading[this.data.locale]
    });
    promisfy.fetch(`/auto/makes`)
      .then(({ data }) => {
        this.setData({
          makes: data,
          ['currentMake.alias']: data[0].name
        });
        this.fetchList()
          .then(() => {
            wx.hideLoading();
          });
      });
  },
  onChange: function ({ detail: { index } }) {
    feedback();
    this.setData({
      currentMake: { index, alias: this.data.makes[index].name },
      eol: false
    });
    let { alias } = this.data.currentMake;
    wx.showLoading({ title: GlobalLocalePackage.loading[this.data.locale] });
    this.fetchList()
      .then(length => {
        length < limit && this.setData({ pending: false, [`bottomFlag.${ alias }`]: true, eol: true });
        wx.hideLoading();
      });
  },
  onReachBottom: function (e) {
    let { alias } = this.data.currentMake;
    if (this.data.bottomFlag[alias]) {
      this.setData({ eol: true });
      return;
    }
    this.setData({ pending: true, eol: false });
    this.fetchList()
      .then(length => {
        length < limit ? this.setData({ pending: false, [`bottomFlag.${ alias }`]: true, eol: true }) : this.setData({ pending: false });
      });
  },
  fetchList: function () {
    let { realm, region, currentMake, skip, bottomFlag, vehicles } = this.data;
    if (bottomFlag[currentMake]) return;
    skip[currentMake.alias] === undefined ? this.setData({ [`skip.${currentMake.alias}`]: 0 }) : this.setData({ [`skip.${currentMake.alias}`]: this.data.skip[currentMake.alias] + limit });
    return new Promise((resolve, reject) => {
      promisfy.fetch(`/auto/lists/${ currentMake.alias }/${ region.alias }?limit=${ limit }&skip=${ skip[currentMake.alias] }`)
        .then(({ data }) => {
          vehicles[currentMake.alias] ? this.setData({ [`vehicles.${currentMake.alias}`]: vehicles[currentMake.alias].concat(data) }) : this.setData({ [`vehicles.${ currentMake.alias }`]: data });
          resolve(data.length);
        });
    });
  },
  feedback
})
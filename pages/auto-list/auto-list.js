import { request, METHOD } from '../../utils/promisfy';
import * as API from '../../config/api.config';
import * as LocalePackage from 'locale-package';
import Palette from '../../config/palette.config';
import feedback from '../../utils/feedback';

const { Store, GlobalLocalePackages } = getApp();

Page({
  data: {
    LocalePackage,
    Palette,
    cursor: [],
    current: 0
  },
  onLoad: function () {
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
      title: GlobalLocalePackages.loading[this.data.locale]
    });
    request(API.AUTO.MAKES, METHOD.GET, {})
      .then(makes => {
        this.setData({
          makes,
          [`cursor.${makes[0].name}`]: {
            skip: 0
          }
        });
        this.fetchList(makes[0].name, 0, wx.hideLoading);
      });
  },
  mapStateToPage: function () {

  },
  onShow: function (options) {
    this.unsubscribe = Store.subscribe(() => {
      this.mapStateToPage();
    });
  },
  onChange: function ({
    detail: {
      index
    }
  }) {
    feedback();
    this.setData({
      current: index
    });
    let currentMake = this.data.makes[index].name;
    wx.showLoading({
      title: GlobalLocalePackages.loading[this.data.locale]
    });
    if (!this.data.cursor[this.data.makes[index].name])
      this.setData({
        [`cursor.${this.data.makes[index].name}`]: {
          skip: 0
        }
      });
    this.fetchList(currentMake, 0, wx.hideLoading);
  },
  onReachBottom: function (e) {
    let currentMake = this.data.makes[this.data.current].name;
    wx.showNavigationBarLoading();
    if (!!this.data.cursor[currentMake]) {
      this.data.cursor[currentMake].skip += 10;
    }
    let { skip } = this.data.cursor[currentMake];
    this.fetchList(currentMake, skip, wx.hideNavigationBarLoading);
  },
  fetchList: function (make, skip, callback, keyword = '') {
    request(API.AUTO.LISTS, METHOD.GET, {
      make,
      region: 'sd',
      skip
    })
      .then(res => {
        if (res[make].length == 0)
          return wx.showToast({
            title: GlobalLocalePackages.requestNotFound[this.data.locale],
            icon: 'none'
          });
        let cars;
        if (!this.data.cars) {
          cars = res;
        } else {
          res[make] = !!this.data.cars[make] ? [...this.data.cars[make], ...res[make]] : res[make];
          cars = {
            ...this.data.cars,
            ...res
          };
        }
        this.setData({
          cars
        });
        callback();
      })
      .catch(e => {
        wx.showToast({
          title: GlobalLocalePackages.requestFailed[this.data.locale],
          image: '/assets/icons/request-fail.png'
        });
        callback();
      });
  }
})
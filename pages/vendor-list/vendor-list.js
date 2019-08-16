import { request, METHOD } from '../../utils/promisfy';
import * as API from '../../config/api.config';
import * as LocalePackage from 'locale-package';
import * as Toasts from '../../utils/toasts';
import feedback from '../../utils/feedback';

const {
  Store,
  GlobalActions,
  GlobalLocalePackages
} = getApp();

Page({
  data: {
    LocalePackage,
    cursor: {},
    current: 0,
    bottomFlag: [],
    search: {
      keyword: '',
      sort: {
        criteria: NaN
      }
    }
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
      //   if (!this.data.category)
      //     return request(API.VENDOR.LISTS, METHOD.GET, {
      //       locale: Store.getState().global.locale,
      //       realm: this.data.options.realm,
      //       category: categories[0].name,
      //       start: this.data.cursor[categories[0].name].start,
      //       end: this.data.cursor[categories[0].name].end
      //     });
      // })
      // .then(res => {
      //   let vendors = { 
      //     ...this.data.vendors,
      //     ...res
      //   };
      //   this.setData({
      //     vendors
      //   });
      //   wx.hideLoading();
      // })
      // .catch(e => Toasts.requestFailed(Store.getState().global.locale));
      })
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
    let currentCategory = this.data.categories[index].name;
    wx.showLoading({
      title: GlobalLocalePackages.loading[this.data.locale]
    });
    if (!this.data.cursor[this.data.categories[index].name])
      this.data.cursor[this.data.categories[index].name] = {
        skip: 0,
      };
    this.fetchList(currentCategory, 0, wx.hideLoading);
      // request(API.VENDOR.LISTS, METHOD.GET, {
      //     locale: this.data.locale,
      //     realm: this.data.options.realm,
      //     category: this.data.categories[index].name,
      //     start: this.data.cursor[this.data.categories[index].name].start,
      //     end: this.data.cursor[this.data.categories[index].name].end
      //   })
      //   .then(res => {
      //     let vendors = { 
      //       ...this.data.vendors,
      //       ...res
      //     };
      //     this.setData({
      //       vendors
      //     });
      //     wx.hideLoading();
      //   });
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
    this.fetchList(currentCategory, skip, wx.hideNavigationBarLoading);
    // request(API.VENDOR.LISTS, METHOD.GET, {
    //   locale: this.data.locale,
    //   realm: this.data.options.realm,
    //   category: currentCategory,
    //   start: this.data.cursor[currentCategory].start,
    //   end: this.data.cursor[currentCategory].end
    // })
    //   .then(res => {
    //     res[currentCategory] = [...this.data.vendors[currentCategory], ...res[currentCategory]];
    //     let vendors = {
    //       ...this.data.vendors,
    //       ...res
    //     };
    //     this.setData({
    //       vendors
    //     });
    //     wx.hideNavigationBarLoading();
    //   })
    //   .catch(e => {
    //     if (e === 400) {
    //       this.setData({
    //         [`bottomFlag.${currentCategory}`]: true
    //       });
    //     }
    //     wx.hideNavigationBarLoading();
    //   });
  },
  fetchList: function (category, skip, callback) {
    request(API.VENDOR.LISTS, METHOD.GET, {
      realm: this.data.options.realm,
      category,
      skip,
      limit: 10
    })
      .then(res => {
        if (res[category].length < 10)
          this.setData({
            [`bottomFlag.${category}`]: true
          });
        let vendors;
        if (!this.data.vendors) {
          vendors = res;
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
        // if (e === 404) {
        //   this.setData({
        //     [`bottomFlag.${currentCategory}`]: true
        //   });
        // } else {
        Toasts.requestFailed(Store.getState().global.locale);
        // }
        callback();
      });
  },
  search: function ({ event: { detail } }) {

  },
  filter: function () {

  },
  feedback
})
import services from '../../config/services.config';
import { request, METHOD, getLocation } from '../../utils/promisfy';
import * as API from '../../config/api.config';
import feedback from '../../utils/feedback';

const { Store, GlobalActions, GlobalLocalePackages } = getApp();

Page({
  data: {
    scrollTop: 0,
    services
  },
  mapStateToPage: function () {
    let newState = Store.getState();
    if (this.data.locale !== newState.global.locale)
      this.setData({
        locale: newState.global.locale
      });
    if (this.data.region !== newState.global.region)
      this.setData({
        region: newState.global.region
      });
  },
  onLoad: function (options) {
    // Synchronous storage hook
    let { locale, systemInfo, region } = Store.getState().global
    this.setData({
      locale, systemInfo, region
    });
    this.unsubscribe = Store.subscribe(() => {
      this.mapStateToPage();
    });
    options.fallback !== 'region' ? getLocation()
      .then(({ latitude, longitude }) => {
        return request(API.REGION.NEAREST, METHOD.GET, { lat: latitude, long: longitude })
      })
      .then(({ id }) => {
        Store.dispatch(GlobalActions.setRegion(id));
        this.fetchData();
      })
      .catch(e => { this.fetchData() }) : this.fetchData();
  },
  onScroll: function ({ detail: { scrollTop } }) {
    if (this.data.scrollTop > -this.data.systemInfo.screenWidth * 1.2 && scrollTop <= -this.data.systemInfo.screenWidth * 1.2)
      this.feedback();
    this.setData({
      scrollTop
    });
  },
  onUnLoad: function () {
    this.unsubscribe();
  },
  fetchData: function () {
    wx.showLoading({
      title: GlobalLocalePackages.loading[this.data.locale]
    });
    let { region } = Store.getState().global;
    Promise.all([
      request(API.FIELD.BANNER, METHOD.GET, { region }),
      request(API.FIELD.SERVICES, METHOD.GET),
      request(API.FIELD.RECOMMENDATION, METHOD.GET, { region }),
      request(API.FIELD.FEED, METHOD.GET, { region })
    ])
      .then(res => {
        for (let index in res[1])
          res[1][index] = { ...res[1][index], ...this.data.services[index] };
        this.setData({
          banner: res[0],
          services: res[1],
          recommendations: res[2],
          feed: res[3]
        });
        wx.hideLoading();
      });
  },
  feedback
})
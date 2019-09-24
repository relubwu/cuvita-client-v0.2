import services from '../../config/services.config';
import feedback from '../../utils/feedback';
import mapStateToPage from '../../lib/wx.state.binder';
import palette from '../../config/palette.config';
import * as localePackage from 'locale-package';
import * as promisfy from '../../lib/wx.promisfy';

const { Store, GlobalActions, GlobalLocalePackage } = getApp();

Page({
  data: {
    scrollTop: 0,
    services
  },
  onLoad: function (options) {
    let { locale, systemInfo, region } = Store.getState().global
    this.setData({
      locale, systemInfo, region
    });
    this.unsubscribe = Store.subscribe(() => {
      mapStateToPage(Store, this, { locale: 'global.locale', region: 'global.region' });
    });
    options.fallback !== 'region' ? promisfy.getLocation()
      .then(({ latitude, longitude }) => {
        return promisfy.fetch('/region/nearest', { lat: latitude, long: longitude })
      })
      .then(region => {
        region ? Store.dispatch(GlobalActions.setRegion(data)) : wx.showModal({ title: localePackage.modal.noservice.title[this.data.locale], content: localePackage.modal.noservice.content[this.data.locale], showCancel: false, confirmColor: palette.primary });
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
    let { region: { alias } } = Store.getState().global;
    Promise.all([
      promisfy.fetch(`/field/tray/${ alias }`),
      promisfy.fetch(`/field/services`),
      promisfy.fetch(`/field/banner/${ alias }`),
      promisfy.fetch(`/field/recommendation/${ alias }`),
      promisfy.fetch(`/field/feed/${ alias }`)
    ])
      .then(res => {
        for (let index in res[1])
          res[1][index] = { ...res[1][index], ...this.data.services[index] };
        this.setData({
          tray: res[0],
          services: res[1],
          banner: res[2],
          recommendations: res[3],
          feed: res[4]
        });
      });
  },
  feedback
})
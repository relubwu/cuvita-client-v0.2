import * as Actions from 'actions';
import * as LocalePackage from 'locale-package';
import services from '../../config/services.config';
import feedback from '../../utils/feedback';
import { request, METHOD } from '../../utils/promisfy';
import { FIELD } from '../../config/api.config';

const { Store, GlobalActions } = getApp();

Page({
  data: {
    scrollTop: 0,
    tray: services.slice(0, 4),
    services: services.slice(4),
    recommendations: [{ items: [ {}, {}, {} ] }],
    feed: {
      title: "ABC",
      description: "DEF",
      items: [{ title: "asdqwef", description: "asdqwrjkhvla" }, {}, {}]
    }
  },
  mapStateToPage: function () {
    let newState = Store.getState();
    if (this.data.locale !== newState.global.locale)
      this.setData({
        locale: newState.global.locale
      });
  },
  onLoad: function (options) {
    // Synchronous storage hook
    let { locale, systemInfo } = Store.getState().global
    this.setData({
      locale, systemInfo
    });
  },
  onScroll: function ({ detail: { scrollTop } }) {
    if (this.data.scrollTop > -this.data.systemInfo.screenWidth * 1.2 && scrollTop <= -this.data.systemInfo.screenWidth * 1.2)
      this.feedback();
    this.setData({
      scrollTop
    });
  },
  onShow: function () {
    this.unsubscribe = Store.subscribe(() => {
      this.mapStateToPage();
    });
    request(FIELD, METHOD.GET, { locale: Store.getState().global.locale })
      .then(res => {
        this.setData({ ...this.data, ...res })
      })
  },
  onUnLoad: function () {
    this.unsubscribe();
  },
  feedback
})
import * as Actions from 'actions';
import services from '../../config/services.config';
// import sorry from '../../utils/sorry';
import { request, METHOD } from '../../utils/promisfy';
import { FIELD } from '../../config/api.config';

const { Store, GlobalActions } = getApp();

Page({
  data: {
    scrollTop: 0
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
    request(FIELD.BANNER, METHOD.GET)
      .then(banner => {
        this.setData({ banner })
      })
  },
  onUnLoad: function () {
    this.unsubscribe();
  }
})
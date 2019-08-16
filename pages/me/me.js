import { request, METHOD } from '../../utils/promisfy';
import * as API from '../../config/api.config';
import * as LocalePackage from 'locale-package';
import feedback from '../../utils/feedback';

const { Store, GlobalActions } = getApp();

Page({
  data: {
    LocalePackage
  },
  onLoad: function () {
    let { locale, systemInfo, member } = Store.getState().global;
    // Synchronous storage hook
    this.setData({
      locale, systemInfo, member
    });
  },
  mapStateToPage: function () {
    let newState = Store.getState();
    if (this.data.locale !== newState.global.locale)
      this.setData({
        locale: newState.global.locale
      });
    if (this.data.member !== newState.global.member)
      this.setData({
        member: newState.global.member
      });
  },
  onShow: function () {
    this.unsubscribe = Store.subscribe(() => {
      this.mapStateToPage();
    });
  },
  onUnload: function () {
    this.unsubscribe();
  },
  sorry: function () {
    sorry(Store.getState().global.locale);
  },
  onChange: function (e) {
    this.setData({
      currentSetting: e.detail
    });
  },
  setLocale: function ({ target: { dataset:  { locale } } }) {
    Store.dispatch(GlobalActions.setLocale(locale));
  }
})
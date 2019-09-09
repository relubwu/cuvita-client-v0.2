import feedback from '../../utils/feedback';
import palette from '../../config/palette.config';
import mapStateToPage from '../../lib/wx.state.binder';
import * as localePackage from 'locale-package';

const { Store, GlobalActions } = getApp();

Page({
  data: {
    localePackage,
    palette,
    options: {
      locale: ['zh', 'en']
    }
  },
  onLoad: function () {
    let { locale, systemInfo, member, region } = Store.getState().global;
    this.setData({
      locale, systemInfo, member, region
    });
    this.unsubscribe = Store.subscribe(() => {
      mapStateToPage(Store, this, { locale: 'global.locale', member: 'global.member' });
    });
  },
  onUnload: function () {
    this.unsubscribe();
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
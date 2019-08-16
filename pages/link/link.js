import { request, METHOD } from '../../utils/promisfy';
import * as API from '../../config/api.config';
import * as LocalePackage from 'locale-package';
import palette from '../../config/palette.config';

const { Store, GlobalActions } = getApp();

Page({
  data: {
    LocalePackage
  },
  onLoad: function () {
    let { locale } = Store.getState().global;
    // Synchronous storage hook
    this.setData({
      locale
    });
    wx.setNavigationBarTitle({
      title: LocalePackage.title[Store.getState().global.locale]
    });
  },
  mapStateToPage: function () {
    
  },
  onShow: function () {
    this.unsubscribe = Store.subscribe(() => {
      this.mapStateToPage();
    });
  },
  onUnload: function () {
    this.unsubscribe();
  },
  sanitizer: function ({ cardID, name }) {
    let sanity = true;
    if (!cardID) {
      sanity = false;
      this.setData({
        ['err.cardID']: LocalePackage.cardID.err[this.data.locale]
      });
    } else {
      this.setData({
        ['err.cardID']: ''
      });
    }
    if (!name) {
      sanity = false;
      this.setData({
        ['err.name']: LocalePackage.name.err[this.data.locale]
      });
    } else {
      this.setData({
        ['err.name']: ''
      });
    }
    return sanity;
  },
  onSubmit: function ({ detail: { value } }) {
    if (!this.sanitizer(value))
      return;
    let { cardID, name } = value;
    request(API.MEMBER.LINK, METHOD.GET, { cardID, name, openid: Store.getState().global.user.openid })
      .then(res => {
        Store.dispatch(GlobalActions.updateMember(res));
        wx.showModal({
          title: LocalePackage.modal.success.title[this.data.locale],
          content: LocalePackage.modal.success.content[this.data.locale],
          showCancel: false,
          confirmColor: palette.primary,
          success: function () {
            wx.reLaunch({
              url: '/pages/vitae/vitae'
            });
          }
        });
      })
      .catch(e => {
        wx.showModal({
          title: LocalePackage.modal.fail.title[this.data.locale],
          content: LocalePackage.modal.fail.content[this.data.locale],
          showCancel: false,
          confirmColor: palette.primary
        });
      })
  }
})
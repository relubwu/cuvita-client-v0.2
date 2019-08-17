import { request, METHOD } from '../../utils/promisfy';
import * as API from '../../config/api.config';
import * as LocalePackage from 'locale-package';
import Sanitizer from '../../utils/sanitizer';
import Palette from '../../config/palette.config';

const { Store, GlobalActions } = getApp();

Page({
  data: {
    LocalePackage,
    pending: false
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
  onSubmit: function ({ detail: { value } }) {
    let { clearance, failedItems } = Sanitizer(value, {
      name: 'avail',
      cardID: 'avail'
    });
    for (let key in value) {
      if (!!failedItems[key]) {
        if (LocalePackage[key].err)
          this.setData({
            [`err.${key}`]: LocalePackage[key].err[failedItems[key]][this.data.locale]
          });
      } else {
        if (LocalePackage[key].err)
          this.setData({
            [`err.${key}`]: ''
          });
      }
    }
    if (!clearance) {
      wx.showToast({
        title: GlobalLocalePackages.incompleteForm[this.data.locale],
        icon: 'none'
      });
      return;
    }
    this.setData({
      pending: true
    });
    let { cardID, name } = value;
    request(API.MEMBER.LINK, METHOD.GET, { cardID, name, openid: Store.getState().global.user.openid })
      .then(res => {
        Store.dispatch(GlobalActions.updateMember(res));
        this.setData({
          pending: false
        });
        wx.showModal({
          title: LocalePackage.modal.success.title[this.data.locale],
          content: LocalePackage.modal.success.content[this.data.locale],
          showCancel: false,
          confirmColor: Palette.primary,
          success: function () {
            wx.reLaunch({
              url: '/pages/vitae/vitae'
            });
          }
        });
      })
      .catch(e => {
        this.setData({
          pending: false
        });
        wx.showModal({
          title: LocalePackage.modal.fail.title[this.data.locale],
          content: LocalePackage.modal.fail.content[this.data.locale],
          showCancel: false,
          confirmColor: Palette.primary
        });
      })
  }
})
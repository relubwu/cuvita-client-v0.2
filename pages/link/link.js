import palette from '../../config/palette.config';
import * as promisfy from '../../lib/wx.promisfy';
import * as localePackage from 'locale-package';

const { Store, GlobalActions, GlobalLocalePackage } = getApp();

Page({
  data: {
    localePackage,
    pending: false
  },
  onLoad: function () {
    let { locale } = Store.getState().global;
    this.setData({
      locale,
      fields: [
        [
          { tag: 'van-field', name: 'name', type: 'text', label: localePackage.name.label[locale], placeholder: localePackage.name.placeholder[locale], required: true },
          { tag: 'van-field', name: 'cardid', type: 'number', label: localePackage.cardid.label[locale], placeholder: localePackage.cardid.placeholder[locale], required: true }
          
        ]
      ]
    });
    wx.setNavigationBarTitle({
      title: localePackage.title[Store.getState().global.locale]
    });
  },
  onSubmit: function ({ detail }) {
    let { name, cardid } = detail;
    let { openid } = Store.getState().global.user;
    wx.showLoading({
      title: GlobalLocalePackage.loading[this.data.locale]
    });
    promisfy.post('/member/link', { openid, name, cardid })
      .then(({ statusCode }) => {
        if (statusCode === 404) {
          wx.showToast({ title: localePackage.fail[this.data.locale], icon: 'none' });
          throw new Error('Unmatched');
        }
        return promisfy.fetch(`/member/${ openid }`);
      })
      .then(({ data }) => {
        Store.dispatch(GlobalActions.updateMember(data));
        wx.hideLoading();
        wx.showModal({
          title: localePackage.success.title[this.data.locale],
          content: localePackage.success.content[this.data.locale],
          confirmColor: palette.primary,
          showCancel: false,
          success: function () {
            wx.navigateBack({ delta: 1 });
          }
        });
      })
      .catch();
  }
})
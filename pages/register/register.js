import palette from '../../config/palette.config';
import * as promisfy from '../../lib/wx.promisfy';
import * as localePackage from 'locale-package';

const { Store, GlobalActions, GlobalLocalePackage } = getApp();
const minimumAge = 16;

Page({
  data: {
    localePackage
  },
  onLoad: function () {
    let { locale } = Store.getState().global;
    wx.setNavigationBarTitle({
      title: localePackage.title[Store.getState().global.locale]
    });
    this.setData({
      locale,
      fields: [
        [
          { tag: 'van-field', name: 'name', type: 'text', label: localePackage.name.label[locale], placeholder: localePackage.name.placeholder[locale], required: true },
          { tag: 'van-field', name: 'tel', type: 'text', label: localePackage.tel.label[locale], placeholder: localePackage.tel.placeholder[locale], required: true },
          { tag: 'van-field', name: 'email', type: 'text', label: localePackage.email.label[locale], placeholder: localePackage.email.placeholder[locale], required: true, is: 'email' },
          { tag: 'van-picker', name: 'school', title: localePackage.school.label[locale], required: true },
          { tag: 'van-picker', name: 'gender', options: [['男', '女', '其他'], ['Male', 'Female', 'Non-Binary']][locale], values: [0, 1, 2], title: localePackage.gender.label[locale], required: true, is: 'integer' },
          { tag: 'van-datetime-picker', name: 'birthday', title: localePackage.birthday.label[locale], options: { minDate: new Date(1960, 0, 1).getTime(), maxDate: new Date().setFullYear(new Date().getFullYear() - minimumAge) }, required: true, is: 'date'  }
        ]
      ]
    });
    wx.showLoading({
      title: GlobalLocalePackage.loading[locale],
      mask: true
    });
    promisfy.fetch(`/school`)
      .then(({ data }) => {
        this.setData({
          ['fields[0][3].options']: data.matrix[locale],
          ['fields[0][3].values']: data.values,
          ['fields[0][5].value']: this.data.fields[0][5].options.maxDate
        });
        wx.hideLoading();
      });
  },
  onSubmit: function ({ detail }) {
    wx.showLoading({ title: GlobalLocalePackage.loading[this.data.locale] });
    promisfy.post('/member/register', { ...detail, openid: Store.getState().global.user.openid })
      .then(({ data }) => { 
        wx.hideLoading();
        return promisfy.requestPayment(data);
      })
      .then(res => {
        return promisfy.fetch(`/member/${ Store.getState().global.user.openid }`)
      })
      .then(({ data, statusCode }) => {
        if (statusCode === 404) {
          wx.showToast({
            title: localePackage.unexpectedFail[this.data.locale],
            icon: 'none'
          });
        } else {
          Store.dispatch(GlobalActions.updateMember(data));
          wx.showModal({
            title: localePackage.modal.success.title[this.data.locale],
            content: localePackage.modal.success.content[this.data.locale],
            confirmColor: palette.primary,
            showCancel: false,
            success: function () { 
              wx.navigateBack({ delta: 1 });
            }
          });
        }
      })
      .catch(e => {
        wx.showToast({
          title: localePackage.paymentFailed[this.data.locale],
          icon: 'none'
        });
      });
  }
})
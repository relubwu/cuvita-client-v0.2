import palette from '../../config/palette.config';
import * as promisfy from '../../lib/wx.promisfy';
import * as localePackage from 'locale-package';

const { Store, GlobalActions, GlobalLocalePackage } = getApp();
const minimumAge = 16;

Page({
  data: {
    localePackage, palette,
  },
  onLoad: function () {
    let { locale } = Store.getState().global;
    wx.setNavigationBarTitle({
      title: localePackage.title[Store.getState().global.locale]
    });
    this.setData({
      locale,
      stages: [{ text: localePackage.stages[0][locale] }, { text: localePackage.stages[1][locale] }, { text: localePackage.stages[2][locale] }],
      currentStage: 0,
      fields: [
        [
          { tag: 'van-field', name: 'name', type: 'text', label: localePackage.form.name.label[locale], placeholder: localePackage.form.name.placeholder[locale], required: true },
          { tag: 'van-field', name: 'tel', type: 'number', label: localePackage.form.tel.label[locale], placeholder: localePackage.form.tel.placeholder[locale], required: true },
          { tag: 'van-field', name: 'email', type: 'text', label: localePackage.form.email.label[locale], placeholder: localePackage.form.email.placeholder[locale], required: true, is: 'email' },
          { tag: 'van-picker', name: 'school', title: localePackage.form.school.label[locale], required: true },
          { tag: 'van-picker', name: 'gender', options: [['男', '女', '其他'], ['Male', 'Female', 'Non-Binary']][locale], values: [0, 1, 2], title: localePackage.form.gender.label[locale], required: true, is: 'integer' },
          { tag: 'van-datetime-picker', name: 'birthday', title: localePackage.form.birthday.label[locale], options: { minDate: new Date(1960, 0, 1).getTime(), maxDate: new Date().setFullYear(new Date().getFullYear() - minimumAge) }, required: true, is: 'date'  }
        ]
      ]
    });
    wx.showLoading({
      title: GlobalLocalePackage.loading[locale],
      mask: true
    });
    promisfy.fetch(`/school`)
      .then(data => {
        this.setData({
          ['fields[0][3].options']: data.matrix[locale],
          ['fields[0][3].values']: data.values,
          ['fields[0][5].value']: this.data.fields[0][5].options.maxDate
        });
        wx.hideLoading();
      });
  },
  onSubmit: function ({ detail }) {
    wx.showLoading({ title: GlobalLocalePackage.loading[this.data.locale], mask: true });
    promisfy.post('/member/register', { ...detail, openid: Store.getState().global.user.openid })
      .then(bundle => { 
        wx.hideLoading();
        this.setData({ bundle });
        this.proceed(1);
        return promisfy.requestPayment(bundle);
      })
      .then(() => {
        wx.showLoading({ title: localePackage.transaction.verifying[this.data.locale], mask: true });
        return new Promise((resolve) => { setTimeout(resolve, 3000) });
      })
      .then(() => {
        return promisfy.fetch(`/member/${Store.getState().global.user.openid}`)
      })
      .then(member => {
        wx.hideLoading();
        if (member) {
          this.proceed(2);
          Store.dispatch(GlobalActions.updateMember(member));
        } else {
          this.proceed(0);
          wx.showModal({
            title: localePackage.fail.modal.title[this.data.locale],
            content: localePackage.fail.modal.content[this.data.locale],
            showCancel: false,
            confirmColor: palette.primary
          });
        }
      })
      .catch(e => {
        this.proceed(0);
        e.errMsg ? wx.showToast({
          title: localePackage.fail.toast.payment[this.data.locale],
          icon: 'none'
        }) : wx.showToast({
          title: localePackage.fail.toast.unexpected[this.data.locale],
          icon: 'none'
        });
      });
  },
  proceed: function (currentStage) {
    this.setData({ currentStage });
  },
  undo: function () {
    this.data.currentStage > 0 && this.setData({ currentStage: --this.data.currentStage });
  },
  exit: function () {
    wx.navigateBack({
      delta: 1
    });
  }
})
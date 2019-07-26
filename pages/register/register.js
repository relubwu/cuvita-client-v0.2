import { request, METHOD, requestPayment } from '../../utils/promisfy';
import * as API from '../../config/api.config';
import * as LocalePackage from 'locale-package';
import palette from '../../config/palette.config';

const { Store, GlobalActions } = getApp();

Page({
  data: {
    LocalePackage,
    popup: {},
    options: {
      gender: [['男', '女', '其他'], ['Male', 'Female', 'Non-Binary']],
      minDate: new Date(1980, 0, 1).getTime(),
      maxDate: new Date().getTime()
    }
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
    let newState = Store.getState();
    if (this.data.locale !== newState.global.locale)
      this.setData({
        locale: newState.global.locale
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
  sanitizer: function ({ name, gender, tel, birthday }) {
    let sanity = true;
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
    if (gender.length == 0)
      sanity = false;
    else
      sanity = true;
    if (!tel) {
      sanity = false;
      this.setData({
        ['err.tel']: LocalePackage.tel.err[this.data.locale]
      });
    } else {
      this.setData({
        ['err.tel']: ''
      });
    }
    if (!birthday)
      sanity = false;
    else
      sanity = true;
    return sanity;
  },
  onSubmit: function ({ detail: { value } }) {
    if (!this.sanitizer(value)) {
      wx.showModal({
        title: LocalePackage.modal.incomplete.title[this.data.locale],
        content: LocalePackage.modal.incomplete.content[this.data.locale],
        showCancel: false,
        confirmColor: palette.primary
      })
      return;
    }
    let { name, gender, tel, birthday } = value;
    gender = parseInt(gender);
    birthday = parseInt(birthday);
    request(API.MEMBER.REGISTER, METHOD.GET, { name, gender, tel, birthday, openid: Store.getState().global.user.openid })
      .then(bundle => requestPayment(bundle))
      .then(() => {
        wx.reLaunch({
          url: '/pages/vitae/vitae'
        });
      });
  },
  toggle: function ({ target: { dataset: { name } } }) {
    this.setData({
      [`popup.${name}`]: !this.data.popup[name]
    })
  },
  setGender: function ({ detail: { index, value }, target: { dataset: { name } } }) {
    this.setData({
      [name]: { label: value, value: index }
    });
  },
  setBirthday: function ({ detail }) {
    this.setData({
      birthday: { label: new Date(detail).toLocaleDateString(), value: detail }
    });
    this.toggle({ target: { dataset: { name: 'birthday' } } });
  }
})
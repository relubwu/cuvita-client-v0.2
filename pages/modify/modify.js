import { request, METHOD, requestPayment } from '../../utils/promisfy';
import * as API from '../../config/api.config';
import * as LocalePackage from 'locale-package';
import * as Toasts from '../../utils/toasts';
import Sanitizer from '../../utils/sanitizer';
import Palette from '../../config/palette.config';
import Autofiller from '../../utils/autofiller';
import Region from '../../config/region.config';

const { Store, GlobalLocalePackages } = getApp();

Page({
  data: {
    LocalePackage,
    popup: {},
    options: {
      gender: [['男', '女', '其他'], ['Male', 'Female', 'Non-Binary']],
      region: Region,
      minDate: new Date(1990, 0, 1).getTime(),
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

  },
  onShow: function () {
    this.unsubscribe = Store.subscribe(() => {
      this.mapStateToPage();
    });
    let fill = Autofiller([
      { key: 'name.value', alias: 'name' }, 
      { key: 'tel.value', alias: 'tel'}, 
      { key: 'email.value', alias: 'email' },
      { key: 'region.value', alias: 'region' },
      { key: 'gender.value', alias: 'gender' },
      { key: 'birthday.value', alias: 'birthday' }
    ], Store.getState().global.member);
    if (!!fill['birthday.value']) {
      let birthday = new Date(fill['birthday.value']);
      this.setData({
        birthday: { label: birthday.toLocaleDateString(), value: birthday.getTime() }
      });
      delete fill['birthday.value'];
    }
    for (let key of Object.keys(fill)) {
      this.setData({
        [key]: fill[key]
      })
    }
  },
  onUnload: function () {
    this.unsubscribe();
  },
  onSubmit: function ({ detail: { value } }) {
    let { clearance, failedItems } = Sanitizer(value, {
      name: 'avail',
      tel: 'avail',
      email: 'avail',
      gender: 'avail',
      birthday: 'avail',
      region: 'avail'
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
      Toasts.incompleteForm(this.data.locale);
      return;
    }
    let { name, gender, tel, birthday, email, region } = value;
    gender = parseInt(gender);
    birthday = parseInt(birthday);
    region = parseInt(region);
    wx.showLoading({ 
      title: GlobalLocalePackages.loading[this.data.locale]
    });
    request(API.MEMBER.MODIFY, METHOD.POST, { name, gender, tel, birthday, email, region, openid: Store.getState().global.user.openid })
      .then(res => {
        wx.hideLoading();
        wx.showModal({
          title: LocalePackage.modal.success.title[this.data.locale],
          content: LocalePackage.modal.success.content[this.data.locale],
          showCancel: false,
          confirmColor: Palette.primary,
          success: function () {
            wx.reLaunch({
              url: '/pages/discovery/discovery'
            });
          }
        });
      })
      .catch(e => {});
  },
  toggle: function ({ target: { dataset: { name } } }) {
    this.setData({
      [`popup.${name}`]: !this.data.popup[name]
    })
  },
  setGender: function ({ detail: { index, value } }) {
    this.setData({
      gender: { value: index }
    });
    this.toggle({ target: { dataset: { name: 'gender' } } });
  },
  setRegion: function ({ detail: { index, value } }) {
    this.setData({
      region: { value: index }
    });
    this.toggle({ target: { dataset: { name: 'region' } } });
  },
  setBirthday: function ({ detail }) {
    this.setData({
      birthday: { label: new Date(detail).toLocaleDateString(), value: detail }
    });
    this.toggle({ target: { dataset: { name: 'birthday' } } });
  }
})
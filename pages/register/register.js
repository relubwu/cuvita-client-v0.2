import { request, METHOD, requestPayment } from '../../utils/promisfy';
import * as API from '../../config/api.config';
import * as LocalePackage from 'locale-package';
import * as Toasts from '../../utils/toasts';
import Sanitizer from '../../utils/sanitizer';
import Palette from '../../config/palette.config';
import Region from '../../config/region.config';

const { Store, GlobalActions, GlobalLocalePackages } = getApp();

Page({
  data: {
    LocalePackage,
    pending: false,
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
    this.setData({
      pending: true
    });
    request(API.MEMBER.REGISTER, METHOD.POST, { name, gender, tel, birthday, email, region, openid: Store.getState().global.user.openid })
      .then(bundle => requestPayment(bundle))
      .then(() => {
        this.setData({
          pending: false
        });
        return request(API.MEMBER.GETINFO, METHOD.GET, { openid: Store.getState().global.user.openid })
      })
      .then(res => {
        Store.dispatch(GlobalActions.updateMember(res));
        wx.showModal({
          title: LocalePackage.modal.success.title[this.data.locale],
          content: LocalePackage.modal.success.content[this.data.locale],
          confirmColor: Palette.primary,
          showCancel: false,
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
        })
        Toasts.paymentFailed(this.data.locale)
      });
  },
  toggle: function ({ target: { dataset: { name } } }) {
    this.setData({
      [`popup.${name}`]: !this.data.popup[name]
    })
  },
  setGender: function ({ detail: { index, value } }) {
    this.setData({
      gender: { label: value, value: index }
    });
    this.toggle({ target: { dataset: { name: 'gender' } } });
  },
  setRegion: function ({ detail:  { index, value } }) {
    this.setData({
      region: { label: value, value: index }
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
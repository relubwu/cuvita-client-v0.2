import { request, METHOD } from '../../utils/promisfy';
import * as API from '../../config/api.config';
import * as LocalePackage from 'locale-package';
import Sanitizer from '../../utils/sanitizer';
import Palette from '../../config/palette.config';
import Autofiller from '../../utils/autofiller';
import { mapRegionToMatrix, mapIndexToRegion, mapRegionIdToIndex } from '../../utils/region-converter';

const { Store, GlobalActions, GlobalLocalePackages } = getApp();

Page({
  data: {
    LocalePackage,
    popup: {},
    options: {
      gender: [['男', '女', '其他'], ['Male', 'Female', 'Non-Binary']],
      minDate: new Date(1990, 0, 1).getTime(),
      maxDate: new Date().getTime()
    }
  },
  onLoad: function () {
    let { locale } = Store.getState().global;
    // Synchronous storage hook
    this.setData({
      locale,
      ['options.region']: mapRegionToMatrix()
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
    if (!!fill['region.value']) {
      this.setData({
        region: { value: mapRegionIdToIndex(fill['region.value']) }
      });
      delete fill['region.value'];
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
      wx.showToast({
        title: GlobalLocalePackages.incompleteForm[this.data.locale],
        icon: 'none'
      });
      return;
    }
    let { name, gender, tel, birthday, email, region } = value;
    gender = parseInt(gender);
    birthday = parseInt(birthday);
    region = parseInt(region);
    wx.showLoading({ 
      title: GlobalLocalePackages.loading[this.data.locale]
    });
    let { openid } = Store.getState().global.user;
    request(API.MEMBER.MODIFY, METHOD.POST, { name, gender, tel: tel.trim(), birthday, email: email.trim(), region: mapIndexToRegion(region).id, openid })
      .then(res => {
        return request(API.MEMBER.GETINFO, METHOD.GET, { openid });
      })
      .then(res => {
        Store.dispatch(GlobalActions.updateMember(res));
        wx.hideLoading();
        wx.showModal({
          title: LocalePackage.modal.success.title[this.data.locale],
          content: LocalePackage.modal.success.content[this.data.locale],
          showCancel: false,
          confirmColor: Palette.primary,
          success: function () {
            wx.navigateBack({
              delta: 1
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
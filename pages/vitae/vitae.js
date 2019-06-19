import { request, METHOD } from '../../utils/promisfy';
import * as API from '../../config/api.config';
import * as LocalePackage from 'locale-package';
import * as CreditPolicy from '../../config/credit.config';
import feedback from '../../utils/feedback';

const { Store, GlobalActions } = getApp();

Page({
  data: {
    LocalePackage,
    ...CreditPolicy,
    activeNames: ['history']
  },
  onLoad: function () {
    let { locale, systemInfo, member, user } = Store.getState().global;
    // Synchronous storage hook
    this.setData({
      locale, systemInfo, member, user
    });
  },
  mapStateToPage: function () {
    let newState = Store.getState();
    if (this.data.locale !== newState.global.locale)
      this.setData({
        locale: newState.global.locale
      });
    if (this.data.member !== newState.global.member)
      this.setData({
        member: newState.global.member
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
  onChange: function ({ detail }) {
    this.setData({
      activeNames: detail
    });
  },
  onPullDownRefresh: function () {
    request(API.MEMBER.GETINFO, METHOD.GET, { openid: this.data.user.openid })
      .then(res => Store.dispatch(GlobalActions.updateMember(res)))
      .catch(e => {
        Store.dispatch(GlobalActions.purgeMember());
        // wx.reLaunch({
        //   url: '/pages/discovery/discovery'
        // });
      });
  },
  testUpdate() {
    request(API.MEMBER.GETINFO, METHOD.GET, { openid: this.data.user.openid })
      .then(res => Store.dispatch(GlobalActions.updateMember(res)))
      .catch(e => {
        Store.dispatch(GlobalActions.purgeMember());
        // wx.reLaunch({
        //   url: '/pages/discovery/discovery'
        // });
      });
  }
})
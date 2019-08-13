import { request, METHOD } from '../../utils/promisfy';
import * as API from '../../config/api.config';
import * as LocalePackage from 'locale-package';
import feedback from '../../utils/feedback';

const { Store, GlobalActions } = getApp();

Page({
  data: {
    LocalePackage
  },
  onLoad: function () {
    let { systemInfo, member } = Store.getState().global;
    // Synchronous storage hook
    this.setData({
      systemInfo, member
    });
  },
  mapStateToPage: function () {
    let newState = Store.getState();
    if (this.data.member !== newState.global.member)
      this.setData({
        member: newState.global.member
      });
  },
  onShow: function () {
    this.unsubscribe = Store.subscribe(() => {
      this.mapStateToPage();
    });
    this.fetchData();
  },
  onUnload: function () {
    this.unsubscribe();
  },
  onPullDownRefresh: function () {
    this.fetchData(wx.stopPullDownRefresh);
  },
  fetchData: function (callback) {
    let { openid } = Store.getState().global.user;
    request(API.MEMBER.GETINFO, METHOD.GET, { openid })
      .then(res => {
        Store.dispatch(GlobalActions.updateMember(res));
        if (!!callback)
          callback();
      })
      .catch(e => {
        if (e === 404 && !!Store.getState().global.member) Store.dispatch(GlobalActions.purgeMember());
        if (!!callback)
          callback();
      });
  },
  feedback
})
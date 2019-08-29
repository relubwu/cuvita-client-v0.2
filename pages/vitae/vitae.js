import { request, METHOD } from '../../utils/promisfy';
import * as API from '../../config/api.config';
import * as LocalePackage from 'locale-package';
import feedback from '../../utils/feedback';
import implement from '../../utils/implement';

const { Store, GlobalActions } = getApp();

Page({
  data: {
    LocalePackage,
    palette: {
      card: ['linear-gradient(60deg, #a6403e, #b24846)' ,'linear-gradient(-45deg, #2b2b2b, #454545)'],
      font: ['beige', '#a6403e']
    },
    schema: 0
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
    if (JSON.stringify(this.data.member) !== JSON.stringify(newState.global.member))
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
    let { user: { openid }, locale, member } = Store.getState().global;
    request(API.MEMBER.GETINFO, METHOD.GET, { openid })
      .then(res => {
        Store.dispatch(GlobalActions.updateMember(res));
        implement(res, locale);
        if (!!callback)
          callback();
      })
      .catch(e => {
        if (e === 404 && !!member) Store.dispatch(GlobalActions.purgeMember());
        if (!!callback)
          callback();
      });
  },
  feedback,
  switchSchema: function () {
    this.setData({
      schema: this.data.schema == 0 ? 1 : 0
    })
  },
  showQR: function () {
    feedback();
    wx.navigateTo({
      url: `/pages/qrcode/qrcode?context=${Store.getState().global.member.cardID}`
    })
  }
})
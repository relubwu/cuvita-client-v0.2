import feedback from '../../utils/feedback';
import palette from '../../config/palette.config';
import mapStateToPage from '../../lib/wx.state.binder';
import * as promisfy from '../../lib/wx.promisfy';
import * as localePackage from 'locale-package';

const { Store, GlobalActions } = getApp();

Page({
  data: {
    localePackage,
    palette: {
      card: ['linear-gradient(60deg, #a6403e, #b24846)' ,'linear-gradient(-45deg, #2b2b2b, #454545)'],
      font: ['beige', '#a6403e']
    },
    schema: 0
  },
  onLoad: function () {
    let { systemInfo, member, locale } = Store.getState().global;
    this.setData({
      systemInfo, member, locale
    });
    this.unsubscribe = Store.subscribe(() => {
      mapStateToPage(Store, this, { member: 'global.member' });
    });
  },
  onShow: function () {
    this.fetchData();
  },
  onUnload: function () {
    this.unsubscribe();
  },
  onPullDownRefresh: function () {
    this.fetchData(wx.stopPullDownRefresh);
  },
  fetchData: function (callback) {
    let { user: { openid }, member } = Store.getState().global;
    promisfy.fetch(`/member/${ openid }`)
      .then(data => {
        data ? Store.dispatch(GlobalActions.updateMember(data)) : member && Store.dispatch(GlobalActions.purgeMember());
        data.incomplete && wx.showModal({
          title: localePackage.implement.title[this.data.locale],
          content: localePackage.implement.content[this.data.locale],
          confirmColor: palette.primary,
          confirmText: localePackage.implement.confirm[this.data.locale],
          success: function (res) { res.confirm && wx.navigateTo({ url: '/pages/modify/modify' }) }
        });
        callback && callback();
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
      url: `/pages/qrcode/qrcode?context=${Store.getState().global.member.cardid}`
    })
  }
})
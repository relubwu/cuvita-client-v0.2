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
    if (member) {
      let { name, gender, tel, school, birthday, email } = member;
      if (!name || gender === null || !tel || !school || !birthday || !email)
        wx.showModal({
          title: localePackage.implement.title[locale],
          content: localePackage.implement.content[locale],
          confirmColor: palette.primary,
          success: function () {
            wx.navigateTo({
              url: '/pages/modify/modify',
            })
          },
          confirmText: localePackage.implement.confirm[locale]
        });
    }
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
  fetchData: function (cb) {
    let { user: { openid }, member } = Store.getState().global;
    promisfy.fetch(`/member/${ openid }`)
      .then(({ statusCode, data }) => {
        statusCode === 404 ? !!member && Store.dispatch(GlobalActions.purgeMember()) : Store.dispatch(GlobalActions.updateMember(data)); 
      });
    cb && cb();
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
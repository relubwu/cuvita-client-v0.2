import QQMapSDK from '../../lib/wx.qqmap.jssdk.min';
import key from '../../config/qqmap.config';
import palette from '../../config/palette.config';
import feedback from '../../utils/feedback';
import * as promisfy from '../../lib/wx.promisfy';
import * as localePackage from 'locale-package';

const { Store, GlobalActions, GlobalLocalePackage } = getApp();

Page({
  data: {
    localePackage, palette
  },
  onLoad: function ({ id }) {
    let qqmap = new QQMapSDK({ key });
    let { locale, user } = Store.getState().global;
    this.setData({
      locale
    });
    id ? id = id : id = user.concierge.schedule;
    wx.showLoading({
      title: GlobalLocalePackage.loading[locale]
    });
    promisfy.fetch(`/concierge/schedule/${id}`)
      .then(({ data }) => {
        this.setData({ schedule: data });
        switch (data.status) {
          case 'PENDING':
            this.setData({
              
            });
        }
      });
  },
  selectSchedule: function () {
    feedback();
    wx.redirectTo({ url: '/pages/concierge-landing/concierge-landing' });
  }
})
import key from '../../config/qqmap.config';
import palette from '../../config/palette.config';
import feedback from '../../utils/feedback';
import * as promisfy from '../../lib/wx.promisfy';
import * as localePackage from 'locale-package';

const { Store, GlobalActions, GlobalLocalePackage } = getApp();

Page({
  data: {
    localePackage, palette, subkey: key
  },
  onLoad: function ({ id }) {
    let { locale, user } = Store.getState().global;
    this.setData({
      locale, user, id
    });
    id ? id = id : id = user.concierge.schedule;
    wx.showLoading({
      title: GlobalLocalePackage.loading[locale]
    });
    promisfy.fetch(`/concierge/schedule/${id}`)
      .then(({ data }) => {
        data.departTime = new Date(data.departTime).toLocaleString();
        this.setData({ schedule: data });
        wx.hideLoading();
        if (data.status === 'ENROUTE') promisfy.getDirection({
          ['from']: { latitude: this.data.schedule.location.lat, longitude: this.data.schedule.location.long },
          to: { latitude: this.data.schedule.destination.location.lat, longitude: this.data.schedule.destination.location.long }
        })
          .then(res => console.log(res));
      });
  },
  selectSchedule: function () {
    feedback();
    wx.redirectTo({ url: '/pages/concierge-landing/concierge-landing' });
  },
  makePhoneCall: function () {
    feedback();
    wx.makePhoneCall({
      phoneNumber: this.data.schedule.contact
    });
  },
  onShareAppMessage: function () {
    return {
      title: 'CUVita - 迎新接机服务',
      path: this.data.id ? `/pages/concierge-portal/concierge-portal?id=${ this.data.id }` : `/pages/concierge-portal/concierge-portal?id=${ this.data.schedule._id }`
    }
  }
})
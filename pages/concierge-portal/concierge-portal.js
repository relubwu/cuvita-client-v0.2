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
    let { locale, user } = Store.getState().global;
    id ? id = id : id = user.concierge.schedule;
    this.setData({
      locale, user, id
    });
    wx.showLoading({
      title: GlobalLocalePackage.loading[locale]
    });
    promisfy.fetch(`/concierge/schedule/${id}`)
      .then(({ data }) => {
        data.departTime = new Date(data.departTime).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });
        data.arrivalTime = data.arrivalTime ? new Date(data.arrivalTime).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }) : null;
        this.setData({ schedule: data });
        wx.hideLoading();
        if (data.status === 'ENROUTE')
          promisfy.getLocation()
            .then(({ latitude, longitude }) => {
              promisfy.post(`/concierge/report/${id}`, { latitude, longitude });
            }); 
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
  },
  feedback
})
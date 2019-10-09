import palette from '../../config/palette.config';
import autofiller from '../../utils/form-autofiller';
import * as promisfy from '../../lib/wx.promisfy';
import * as localePackage from 'locale-package';

const { Store, GlobalActions, GlobalLocalePackage } = getApp();

Page({
  data: {
    palette,
    localePackage,
    policy: '',
    event: {
      name: ['Event Name', 'Event Name'],
      date: new Date().toLocaleString()
    },
    policies: [
      {
        name: ['General Admission', 'General Admission'],
        description: ['GA Description', 'GA Description'],
        alias: 'stdga',
        merchandise: {
          price: 25000
        }
      },
      {
        name: ['Membership Exclusive', 'Membership Exclusive'],
        description: ['Membership Exclusive Description', 'Membership Exclusive Description'],
        alias: 'stdmex'
      },
      {
        name: ['Ticket type #3', 'Ticket type #3'],
        description: ['Membership Exclusive Description', 'Membership Exclusive Description'],
        alias: 't3',
        merchandise: {
          price: 25000
        }
      }
    ]
  },
  onLoad: function (options) {
    let { locale, member } = Store.getState().global;
    wx.setNavigationBarTitle({ title: localePackage.title[locale] });
    this.setData({ locale, member });
  },
  onChange: function ({ currentTarget: { dataset: { name } } }) {
    this.setData({
      policy: name
    });
  }
})
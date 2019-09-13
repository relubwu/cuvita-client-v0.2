import validator from 'validator';
import * as promisfy from '../../lib/wx.promisfy';
import * as localePackage from 'locale-package';

const { Store, GlobalActions, GlobalLocalePackage } = getApp();

Page({
  data: {
    localePackage,
    currentStage: 0,
    options: { minDate: new Date(2019, 8, 14).getTime(), maxDate: new Date(2019, 8, 19).getTime() }
  },
  onLoad: function () {
    let { locale, systemInfo } = Store.getState().global;
    this.setData({
      locale, systemInfo,
      stages: [
        {
          layout: {
            formBorderRadius: '50rpx 50rpx 0 0',
            formHeight: '45vh',
            formPaddingTop: '30px',
            formAction: localePackage.query[locale]
          },
          popup: {}
        },
        {
          layout: {
            formBorderRadius: '0',
            formHeight: '100vh',
            formPaddingTop: `${systemInfo.navigationBarHeight}px`
          }
        },
        {
          layout: {
            formBorderRadius: '0',
            formHeight: '100vh',
            formPaddingTop: `${systemInfo.navigationBarHeight}px`
          }
        },
        {
          layout: {
            formBorderRadius: '0',
            formHeight: '100vh',
            formPaddingTop: `${systemInfo.navigationBarHeight}px`
          }
        },
        {
          layout: {
            formBorderRadius: '0',
            formHeight: '100vh',
            formPaddingTop: `${systemInfo.navigationBarHeight}px`,
            formAction: localePackage.submit[locale]
          }
        }
      ]
    });
  },
  toggleDateTimePicker: function () {
    if (this.data.currentStage !== 0) return;
    this.setData({
      [`stages[0].popup.departTime`]: !this.data.stages[0].popup.departTime
    });
  },
  toggleCollapse: function ({ target: { dataset: { index } } }) {
    index < this.data.currentStage && this.setData({
      currentStage: index
    })
  },
  confirmDateTimePicker: function ({ detail }) {
    this.setData({
      [`stages[0].popup.departTime`]: false,
      [`stages[0].data.departTime.label`]: new Date(detail).toLocaleString(),
      [`stages[0].data.departTime.value`]: detail
    });
  },
  findFlight: function ({ detail: { value: { flight, departTime } } }) {
    if (flight === null || flight.length === 0) flight = 'CA887';
    if (departTime === "") departTime = new Date(2019, 8, 14, 9).getTime().toString();
    flight = flight.trim();
    flight = validator.blacklist(flight, ' ');
    flight = flight.toUpperCase();
    departTime = new Date(validator.toInt(departTime));
    wx.showLoading({
      title: GlobalLocalePackage.loading[this.data.locale]
    })
    promisfy.fetch(`/concierge/flight/${flight}/${departTime.getTime()}/${departTime.getTimezoneOffset()}`)
      .then(({ data, statusCode }) => {
        wx.hideLoading();
        if (statusCode === 404) return wx.showToast({ title: localePackage.flight.notFound[this.data.locale], icon: 'none' });
        this.setData({
          ['stages[1].data.flights']: data,
          ['stages[1].collapse']: ['1']
        })
        this.proceed(1);
      });

  },
  confirmFlight: function ({ target: { dataset: { index } } }) {
    let flight = this.data.stages[1].data.flights[index];
    this.setData({
      ['stages[1].data.flight']: flight,
      ['stages[1].collapse']: [],
      ['stages[2].data.destination']: null,
      ['stages[3].data.schedule']: null
    });
    wx.showLoading({
      title: GlobalLocalePackage.loading[this.data.locale]
    });
    promisfy.fetch(`/concierge/destination/${ flight.destination }`)
      .then(({ data, statusCode }) => {
        wx.hideLoading();
        this.setData({
          ['stages[2].data.destinations']: data,
          ['stages[2].collapse']: ['2']
        });
        this.proceed(2);
      });
  },
  confirmDestination: function ({ target: { dataset: { index } } }) {
    let destination = this.data.stages[2].data.destinations[index];
    let flight = this.data.stages[1].data.flight;
    this.setData({
      ['stages[2].data.destination']: destination,
      ['stages[2].collapse']: [],
      ['stages[3].data.schedule']: null
    });
    wx.showLoading({
      title: GlobalLocalePackage.loading[this.data.locale]
    });
    promisfy.fetch(`/concierge/schedule/${ flight.destination }-${ destination.alias }/${ flight.arrivaltime }`)
      .then(({ data, statusCode }) => {
        wx.hideLoading();
        for (let index in data) {
          data[index].departTime = new Date(data[index].departTime);
          data[index].label = data[index].departTime.toLocaleString();
        }
        this.setData({
          ['stages[3].data.schedules']: data,
          ['stages[3].collapse']: ['3']
        });
        this.proceed(3);
      });
  },
  confirmSchedule: function ({ target: { dataset: { index } } }) {
    let schedule = this.data.stages[3].data.schedules[index];
    this.setData({
      ['stages[3].data.schedule']: schedule,
      ['stages[3].collapse']: []
    });
    this.proceed(4);
  },
  proceed: function (stage) {
    this.setData({ currentStage: stage });
  },
  submit: function () {
    let { openid } = Store.getState().global.user;
    wx.showLoading({
      title: GlobalLocalePackage.loading[this.data.locale]
    });
    promisfy.post(`/concierge/stage`, { openid, schedule: this.data.stages[3].data.schedule._id, flight: this.data.stages[1].data.flight })
      .then(() => promisfy.fetch(`/user/${ openid }`))
      .then(({ data }) => {
        Store.dispatch(GlobalActions.setUser(data));
        wx.redirectTo({
          url: '/pages/concierge-portal/concierge-portal'
        });
      });
  }
})